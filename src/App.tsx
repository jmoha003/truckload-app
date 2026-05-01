import { useState, useRef, useCallback, useEffect } from "react";

// ─── DATA ──────────────────────────────────────────────
const TRUCK_PROFILES = [
  { id: "custom", name: "Custom Truck", shape: "rectangular", length: 0, topWidth: 0, bottomWidth: 0, depth: 0, capacity: "—", desc: "Enter your own dimensions" },
  { id: "f350", name: "Ford F-350 Dump", shape: "rectangular", length: 8, topWidth: 7, bottomWidth: 7, depth: 2, capacity: "3-4 yd³", desc: "Pickup contractor dump" },
  { id: "f450", name: "Ford F-450/550", shape: "rectangular", length: 9, topWidth: 7, bottomWidth: 7, depth: 2.2, capacity: "4-5 yd³", desc: "Medium duty pickup" },
  { id: "intl4300", name: "International 4300", shape: "trapezoid", length: 10, topWidth: 7, bottomWidth: 6.5, depth: 2.3, capacity: "5-6 yd³", desc: "Single axle – common in VA Beach" },
  { id: "intl7400", name: "International 7400", shape: "trapezoid", length: 12, topWidth: 7.5, bottomWidth: 6.5, depth: 2.5, capacity: "8-10 yd³", desc: "Single axle heavy" },
  { id: "mack_granite", name: "Mack Granite Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", desc: "Workhorse of Hampton Roads" },
  { id: "kenworth_t880", name: "Kenworth T880 Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", desc: "Common in VA DOT jobs" },
  { id: "peterbilt_567", name: "Peterbilt 567 Tandem", shape: "trapezoid", length: 14.5, topWidth: 7.5, bottomWidth: 6.5, depth: 2.7, capacity: "11-13 yd³", desc: "Heavy haul tandem" },
  { id: "triaxle", name: "Tri-Axle Dump", shape: "trapezoid", length: 17, topWidth: 8, bottomWidth: 7, depth: 3.5, capacity: "16-18 yd³", desc: "Large jobs, site work" },
  { id: "quadaxle", name: "Quad Axle Dump", shape: "trapezoid", length: 18, topWidth: 8, bottomWidth: 7, depth: 3.7, capacity: "18-20 yd³", desc: "Max legal highway load" },
  { id: "transfer", name: "Transfer Dump", shape: "trapezoid", length: 22, topWidth: 8, bottomWidth: 7, depth: 4, capacity: "24-26 yd³", desc: "Truck + pup trailer" },
  { id: "belly", name: "Belly Dump Trailer", shape: "trapezoid", length: 20, topWidth: 8, bottomWidth: 5, depth: 4.5, capacity: "20-22 yd³", desc: "Bottom-discharge, highway haul" },
  { id: "art_a25", name: "Volvo A25 (Artic)", shape: "trapezoid", length: 14, topWidth: 9, bottomWidth: 7.5, depth: 4, capacity: "16-18 yd³", desc: "Off-road articulated" },
  { id: "art_a30", name: "Volvo A30 (Artic)", shape: "trapezoid", length: 15, topWidth: 9.5, bottomWidth: 8, depth: 4.5, capacity: "20-22 yd³", desc: "Large site articulated" },
];

const MATERIALS = [
  { id: "topsoil", name: "Topsoil", density: 1.1, cat: "Soil", color: "#5C4033" },
  { id: "fill_dirt", name: "Fill Dirt", density: 1.15, cat: "Soil", color: "#8B7355" },
  { id: "clay_dry", name: "Clay (Dry)", density: 1.05, cat: "Soil", color: "#C4A35A" },
  { id: "clay_wet", name: "Clay (Wet)", density: 1.55, cat: "Soil", color: "#7A6A4F" },
  { id: "loam", name: "Loam", density: 1.2, cat: "Soil", color: "#6B4226" },
  { id: "57_stone", name: "#57 Stone", density: 1.4, cat: "Stone", color: "#808080" },
  { id: "67_stone", name: "#67 Stone", density: 1.35, cat: "Stone", color: "#909090" },
  { id: "2_stone", name: "#2 Stone", density: 1.45, cat: "Stone", color: "#707070" },
  { id: "cr6", name: "CR-6 (21A)", density: 1.5, cat: "Stone", color: "#7A7A6A" },
  { id: "rip_rap", name: "Riprap / Armor Stone", density: 1.65, cat: "Stone", color: "#6E6E6E" },
  { id: "crush_gravel", name: "Crushed Gravel", density: 1.35, cat: "Gravel", color: "#A0A0A0" },
  { id: "pea_gravel", name: "Pea Gravel", density: 1.45, cat: "Gravel", color: "#B8A88A" },
  { id: "bank_gravel", name: "Bank Run Gravel", density: 1.55, cat: "Gravel", color: "#9A8A6A" },
  { id: "sand_dry", name: "Sand (Dry)", density: 1.35, cat: "Sand", color: "#E8D5A3" },
  { id: "sand_wet", name: "Sand (Wet)", density: 1.7, cat: "Sand", color: "#C4B07B" },
  { id: "mason_sand", name: "Mason Sand", density: 1.5, cat: "Sand", color: "#DCC89A" },
  { id: "mulch_wood", name: "Wood Mulch", density: 0.35, cat: "Mulch", color: "#6B3A2A" },
  { id: "mulch_bark", name: "Bark Mulch", density: 0.25, cat: "Mulch", color: "#4A2A1A" },
  { id: "mulch_dyed", name: "Dyed Mulch", density: 0.38, cat: "Mulch", color: "#2A0A0A" },
  { id: "compost", name: "Compost", density: 0.5, cat: "Organic", color: "#3D2B1F" },
  { id: "asphalt_mill", name: "Asphalt Millings", density: 1.15, cat: "Recycled", color: "#333333" },
  { id: "recycled_conc", name: "Recycled Concrete", density: 1.3, cat: "Recycled", color: "#B0B0B0" },
  { id: "slag", name: "Slag", density: 1.5, cat: "Recycled", color: "#555566" },
];

const MOISTURE_LEVELS = [
  { id: "dry", label: "Dry", factor: 1.0, icon: "☀️", desc: "Dusty, no rain 48h+" },
  { id: "damp", label: "Damp", factor: 1.10, icon: "💦", desc: "Recent rain, moist" },
  { id: "wet", label: "Wet", factor: 1.25, icon: "🌧", desc: "Active rain, saturated" },
];

const HEAP_PROFILES = [
  { id: "flat", label: "Flat / Struck", factor: 1.0, desc: "Level with walls" },
  { id: "crowned", label: "Slight Crown", factor: 1.1, desc: "~10% above bed line" },
  { id: "heaped", label: "Heaped", factor: 1.25, desc: "Standard cone" },
  { id: "maxheap", label: "Max Heap", factor: 1.4, desc: "Overloaded" },
];

// ─── STORAGE HELPERS ──────────────────────────────────
async function loadHistory() {
  try {
    const result = await window.storage.get("loadweigh_history");
    return result ? JSON.parse(result.value) : [];
  } catch { return []; }
}
async function saveEstimate(entry) {
  try {
    const history = await loadHistory();
    history.push({ ...entry, ts: Date.now() });
    // Keep last 100
    const trimmed = history.slice(-100);
    await window.storage.set("loadweigh_history", JSON.stringify(trimmed));
  } catch (e) { console.error("Storage save error:", e); }
}
async function getSuggestion(truckId, materialId) {
  try {
    const history = await loadHistory();
    const matches = history.filter(h => h.truckId === truckId && h.materialId === materialId);
    if (matches.length < 3) return null;
    const avgFill = Math.round(matches.reduce((s, m) => s + m.fillPct, 0) / matches.length);
    // Most common heap profile
    const heapCounts = {};
    matches.forEach(m => { heapCounts[m.heapId] = (heapCounts[m.heapId] || 0) + 1; });
    const topHeap = Object.entries(heapCounts).sort((a, b) => b[1] - a[1])[0][0];
    return { fillPct: avgFill, heapId: topHeap, count: matches.length };
  } catch { return null; }
}

// ─── MAIN COMPONENT ──────────────────────────────────
export default function LoadWeighV1() {
  const [step, setStep] = useState(0);
  // Step 0: Truck
  const [truckIdx, setTruckIdx] = useState(0);
  const [bedShape, setBedShape] = useState("rectangular");
  const [dims, setDims] = useState({ length: 0, topWidth: 0, bottomWidth: 0, depth: 0 });
  // Step 1: Material
  const [materialIdx, setMaterialIdx] = useState(null);
  const [materialFilter, setMaterialFilter] = useState("All");
  // Step 2: Moisture
  const [moistureIdx, setMoistureIdx] = useState(0);
  // Step 3: Fill + Heap
  const [fillPct, setFillPct] = useState(85);
  const [heapIdx, setHeapIdx] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [saved, setSaved] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  const fileRef = useRef(null);
  const photoContainerRef = useRef(null);

  // Load suggestion when truck+material are set
  useEffect(() => {
    if (truckIdx > 0 && materialIdx !== null) {
      const truck = TRUCK_PROFILES[truckIdx];
      const mat = MATERIALS[materialIdx];
      getSuggestion(truck.id, mat.id).then(s => {
        setSuggestion(s);
      });
    }
  }, [truckIdx, materialIdx]);

  // Load history count on mount
  useEffect(() => {
    loadHistory().then(h => setHistoryCount(h.length));
  }, []);

  const handleTruckSelect = (idx) => {
    setTruckIdx(idx);
    const t = TRUCK_PROFILES[idx];
    if (idx > 0) {
      setBedShape(t.shape);
      setDims({ length: t.length, topWidth: t.topWidth, bottomWidth: t.bottomWidth, depth: t.depth });
    }
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Draggable fill line on photo
  const handleDrag = useCallback((clientY) => {
    const container = photoContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const y = clientY - rect.top;
    const pct = Math.round(Math.max(10, Math.min(100, (1 - y / rect.height) * 100)));
    setFillPct(pct);
  }, []);

  const onPointerDown = (e) => { setDragging(true); handleDrag(e.clientY); };
  const onPointerMove = (e) => { if (dragging) handleDrag(e.clientY); };
  const onPointerUp = () => setDragging(false);

  // ─── CALCULATIONS ──────────────────────────────────
  const calcVolume = () => {
    const { length: l, topWidth: tw, bottomWidth: bw, depth: d } = dims;
    if (bedShape === "trapezoid") {
      return (l * ((tw + bw) / 2) * d) / 27; // yd³
    }
    return (l * tw * d) / 27;
  };

  const bedVolumeYd3 = calcVolume();
  const heapFactor = HEAP_PROFILES[heapIdx].factor;
  const effectiveVolume = bedVolumeYd3 * (fillPct / 100) * heapFactor;
  const mat = materialIdx !== null ? MATERIALS[materialIdx] : null;
  const moistureFactor = MOISTURE_LEVELS[moistureIdx].factor;
  const adjustedDensity = mat ? mat.density * moistureFactor : 0;
  const estimatedWeight = effectiveVolume * adjustedDensity;
  const rangeLow = estimatedWeight * 0.85;
  const rangeHigh = estimatedWeight * 1.15;

  const handleSave = async () => {
    if (materialIdx === null || saved) return;
    await saveEstimate({
      truckId: TRUCK_PROFILES[truckIdx].id,
      materialId: MATERIALS[materialIdx].id,
      fillPct,
      heapId: HEAP_PROFILES[heapIdx].id,
      moistureId: MOISTURE_LEVELS[moistureIdx].id,
      weight: estimatedWeight,
    });
    setSaved(true);
    setHistoryCount(prev => prev + 1);
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    setFillPct(suggestion.fillPct);
    const hIdx = HEAP_PROFILES.findIndex(h => h.id === suggestion.heapId);
    if (hIdx >= 0) setHeapIdx(hIdx);
  };

  const categories = ["All", ...new Set(MATERIALS.map(m => m.cat))];
  const filteredMaterials = materialFilter === "All" ? MATERIALS : MATERIALS.filter(m => m.cat === materialFilter);

  const STEPS = ["Truck", "Material", "Moisture", "Load", "Result"];
  const canProceed = [
    bedVolumeYd3 > 0.1,
    materialIdx !== null,
    true,
    true,
    true,
  ];

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      background: "#0A0A0C",
      color: "#E5E3DD",
      minHeight: "100vh",
      maxWidth: 500,
      margin: "0 auto",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800;900&display=swap');
        :root {
          --bg: #0A0A0C; --s1: #131316; --s2: #1B1B1F; --s3: #242428;
          --border: #2E2E33; --dim: #6B6B70; --text: #E5E3DD;
          --amber: #F5A623; --amber-dim: #F5A62330; --red: #E54D42;
          --green: #3DD68C; --blue: #4A9EF5;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fade { animation: fadeUp .3s ease-out; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } }
        @keyframes pulseAmber { 0%,100% { box-shadow: 0 0 0 0 var(--amber-dim) } 50% { box-shadow: 0 0 0 8px transparent } }

        input[type=range] { -webkit-appearance:none; width:100%; height:8px; background:var(--s3); border-radius:4px; outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:28px; height:28px; background:var(--amber); border-radius:50%; cursor:pointer; border:3px solid var(--bg); }
        input[type=number] { background:var(--s1); border:1px solid var(--border); color:var(--text); padding:10px 12px; border-radius:8px; font-family:inherit; font-size:15px; width:100%; outline:none; }
        input[type=number]:focus { border-color:var(--amber); }

        .card { background:var(--s1); border:1px solid var(--border); border-radius:14px; padding:16px; margin-bottom:12px; }
        .label { font-size:10px; color:var(--dim); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px; font-weight:600; }
        .chip {
          display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:10px;
          font-size:13px; cursor:pointer; transition:all .15s; border:1px solid var(--border);
          background:var(--s1); color:var(--dim); width:100%; text-align:left; font-family:inherit;
        }
        .chip:hover { border-color:var(--s3); background:var(--s2); }
        .chip.sel { border-color:var(--amber); background:var(--amber-dim); color:var(--amber); }
        .chip-sm { padding:8px 12px; font-size:12px; }
        .btn {
          width:100%; padding:14px; border:none; border-radius:12px;
          background:var(--amber); color:var(--bg); font-family:'Outfit',sans-serif;
          font-size:15px; font-weight:700; cursor:pointer; letter-spacing:.5px; transition:all .15s;
        }
        .btn:hover { filter:brightness(1.08); }
        .btn:disabled { opacity:.25; cursor:not-allowed; }
        .btn-ghost {
          padding:10px 16px; border:1px solid var(--border); border-radius:10px;
          background:transparent; color:var(--dim); font-family:inherit; font-size:13px; cursor:pointer;
        }
        .btn-ghost:hover { border-color:var(--amber); color:var(--amber); }
        .pill-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
        .pill {
          padding:5px 12px; border-radius:20px; font-size:11px; font-weight:500; cursor:pointer;
          border:1px solid var(--border); background:transparent; color:var(--dim); font-family:inherit;
          letter-spacing:.4px; transition:all .15s;
        }
        .pill.active { background:var(--amber); color:var(--bg); border-color:var(--amber); font-weight:700; }
        .pill.done { background:var(--s2); color:var(--green); border-color:var(--green); }

        .swatch { width:14px; height:14px; border-radius:4px; flex-shrink:0; border:1px solid rgba(255,255,255,.08); }
        .photo-container { position:relative; width:100%; border-radius:10px; overflow:hidden; touch-action:none; user-select:none; }
        .fill-line {
          position:absolute; left:0; right:0; height:3px; background:var(--amber);
          box-shadow:0 0 8px var(--amber); pointer-events:none; z-index:2;
        }
        .fill-label {
          position:absolute; right:8px; transform:translateY(-50%); background:var(--amber);
          color:var(--bg); font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px;
          z-index:3; pointer-events:none;
        }
        .fill-overlay {
          position:absolute; left:0; right:0; bottom:0; z-index:1; pointer-events:none; opacity:.35;
        }
        .suggestion-bar {
          background:var(--blue); color:#fff; padding:10px 14px; border-radius:10px;
          font-size:12px; display:flex; justify-content:space-between; align-items:center;
          margin-bottom:12px; cursor:pointer; animation:pulseAmber 2s ease infinite;
        }
        .breakdown-row {
          display:flex; justify-content:space-between; padding:6px 0;
          border-bottom:1px solid var(--border); font-size:13px;
        }
        .breakdown-row:last-child { border:none; }
        .conversion-box {
          background:var(--s2); padding:12px; border-radius:8px; text-align:center;
        }
      `}</style>

      {/* ─── HEADER ──── */}
      <div style={{ padding:"14px 20px 10px", borderBottom:`1px solid var(--border)`, background:"var(--s1)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:22, fontWeight:900, letterSpacing:-1, display:"flex", alignItems:"center", gap:8 }}>
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="2" width="17" height="11" rx="1.5" stroke="var(--amber)" strokeWidth="1.8" fill="var(--amber)" fillOpacity=".15"/>
                <rect x="2" y="6" width="8" height="7" rx="1.5" stroke="var(--amber)" strokeWidth="1.5" fill="none"/>
                <rect x="3.5" y="7.5" width="4" height="3" rx="1" fill="var(--amber)" fillOpacity=".3"/>
                <circle cx="6" cy="17" r="3" stroke="var(--amber)" strokeWidth="1.5" fill="var(--s1)"/>
                <circle cx="20" cy="17" r="3" stroke="var(--amber)" strokeWidth="1.5" fill="var(--s1)"/>
                <circle cx="14" cy="17" r="3" stroke="var(--amber)" strokeWidth="1.5" fill="var(--s1)"/>
                <line x1="2" y1="13" x2="26" y2="13" stroke="var(--amber)" strokeWidth="1.2"/>
                <text x="17.5" y="10" textAnchor="middle" fill="var(--amber)" fontSize="7" fontWeight="bold" fontFamily="monospace">T</text>
              </svg>
              TRUCKLOAD
            </div>
            <div style={{ fontSize:10, color:"var(--dim)", letterSpacing:2, fontWeight:300 }}>TRUCK LOAD WEIGHT ESTIMATOR • V1</div>
          </div>
          {historyCount > 0 && (
            <div style={{ fontSize:10, color:"var(--dim)", textAlign:"right" }}>
              <span style={{ color:"var(--green)", fontWeight:600 }}>{historyCount}</span> estimates saved
            </div>
          )}
        </div>
        <div className="pill-row" style={{ marginBottom:0 }}>
          {STEPS.map((s, i) => (
            <button key={s} className={`pill ${i === step ? "active" : i < step ? "done" : ""}`}
              onClick={() => { if (i < step) setStep(i); }}>
              {i < step ? "✓" : ""} {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 20px 120px" }}>

        {/* ═══════ STEP 0: TRUCK ═══════ */}
        {step === 0 && (
          <div className="fade">
            <div className="label">Select Truck Profile</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
              {TRUCK_PROFILES.map((t, i) => (
                <button key={t.id} className={`chip ${truckIdx === i ? "sel" : ""}`}
                  onClick={() => handleTruckSelect(i)}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, color: truckIdx === i ? "var(--amber)" : "var(--text)", fontSize:13 }}>{t.name}</div>
                    <div style={{ fontSize:10, opacity:.6, marginTop:2 }}>{t.desc}</div>
                  </div>
                  <div style={{ fontSize:11, opacity:.5, textAlign:"right" }}>{t.capacity}</div>
                </button>
              ))}
            </div>

            {/* Bed Shape */}
            <div className="card">
              <div className="label">Bed Shape</div>
              <div style={{ display:"flex", gap:8 }}>
                {["rectangular", "trapezoid"].map(s => (
                  <button key={s} className={`chip chip-sm ${bedShape === s ? "sel" : ""}`}
                    onClick={() => setBedShape(s)} style={{ flex:1, justifyContent:"center" }}>
                    <span style={{ fontWeight:600, textTransform:"capitalize" }}>{s}</span>
                  </button>
                ))}
              </div>

              {/* Shape diagram */}
              <svg viewBox="0 0 200 70" style={{ width:"100%", height:55, marginTop:10 }}>
                {bedShape === "rectangular" ? (
                  <rect x="30" y="10" width="140" height="50" rx="2" fill="none"
                    stroke="var(--amber)" strokeWidth="2" opacity=".6" />
                ) : (
                  <polygon points="45,60 20,10 180,10 155,60" fill="none"
                    stroke="var(--amber)" strokeWidth="2" opacity=".6" />
                )}
                <text x="100" y="40" textAnchor="middle" fill="var(--dim)" fontSize="9" fontFamily="monospace">
                  {bedShape === "trapezoid" ? "Top wider than bottom" : "Equal top & bottom"}
                </text>
              </svg>
            </div>

            {/* Dimensions */}
            <div className="card">
              <div className="label">Bed Dimensions (feet) — from Apple Measure App</div>
              <div style={{ display:"grid", gridTemplateColumns: bedShape === "trapezoid" ? "1fr 1fr" : "1fr 1fr 1fr", gap:10, marginTop:4 }}>
                <div>
                  <div style={{ fontSize:10, color:"var(--dim)", marginBottom:4 }}>Length</div>
                  <input type="number" step="0.5" min="0" max="50" value={dims.length || ""}
                    onChange={e => { setDims({...dims, length:parseFloat(e.target.value)||0}); setTruckIdx(0); }}
                    placeholder="0" />
                </div>
                <div>
                  <div style={{ fontSize:10, color:"var(--dim)", marginBottom:4 }}>
                    {bedShape === "trapezoid" ? "Top Width" : "Width"}
                  </div>
                  <input type="number" step="0.5" min="0" max="20" value={dims.topWidth || ""}
                    onChange={e => {
                      const v = parseFloat(e.target.value)||0;
                      setDims({...dims, topWidth:v, ...(bedShape==="rectangular"?{bottomWidth:v}:{})});
                      setTruckIdx(0);
                    }} placeholder="0" />
                </div>
                {bedShape === "trapezoid" && (
                  <div>
                    <div style={{ fontSize:10, color:"var(--dim)", marginBottom:4 }}>Bottom Width</div>
                    <input type="number" step="0.5" min="0" max="20" value={dims.bottomWidth || ""}
                      onChange={e => { setDims({...dims, bottomWidth:parseFloat(e.target.value)||0}); setTruckIdx(0); }}
                      placeholder="0" />
                  </div>
                )}
                <div>
                  <div style={{ fontSize:10, color:"var(--dim)", marginBottom:4 }}>Depth</div>
                  <input type="number" step="0.5" min="0" max="10" value={dims.depth || ""}
                    onChange={e => { setDims({...dims, depth:parseFloat(e.target.value)||0}); setTruckIdx(0); }}
                    placeholder="0" />
                </div>
              </div>

              <div style={{ marginTop:14, display:"flex", justifyContent:"space-between", fontSize:13 }}>
                <span style={{ color:"var(--dim)" }}>Bed Volume</span>
                <span style={{ color:"var(--amber)", fontWeight:700, fontFamily:"'Outfit',sans-serif", fontSize:16 }}>
                  {bedVolumeYd3.toFixed(1)} yd³
                </span>
              </div>
              {bedShape === "trapezoid" && dims.topWidth > 0 && dims.bottomWidth > 0 && (
                <div style={{ fontSize:10, color:"var(--dim)", marginTop:4 }}>
                  Trapezoid correction: {((1 - dims.bottomWidth/dims.topWidth) * 100).toFixed(0)}% narrower at bottom
                </div>
              )}
            </div>

            {/* Truck side view */}
            <div className="card" style={{ padding:8 }}>
              <svg viewBox="0 0 320 90" style={{ width:"100%", height:75 }}>
                {/* cab */}
                <rect x="15" y="38" width="45" height="35" rx="4" fill="var(--s2)" stroke="var(--border)" strokeWidth="1.5" />
                <rect x="20" y="42" width="18" height="14" rx="2" fill="var(--s3)" opacity=".5" />
                <text x="30" y="66" fill="var(--dim)" fontSize="7" fontFamily="monospace" textAnchor="middle">CAB</text>
                {/* bed */}
                {bedShape === "rectangular" ? (
                  <rect x="65" y="18" width={Math.min(220, Math.max(60, dims.length*12))}
                    height={Math.min(55, Math.max(20, dims.depth*14))}
                    rx="2" fill="none" stroke="var(--amber)" strokeWidth="2" strokeDasharray="5 3" />
                ) : (
                  <polygon points={`
                    ${65 + Math.min(55, Math.max(20, dims.depth*14)) * 0.15},${18 + Math.min(55, Math.max(20, dims.depth*14))}
                    65,18
                    ${65 + Math.min(220, Math.max(60, dims.length*12))},18
                    ${65 + Math.min(220, Math.max(60, dims.length*12)) - Math.min(55, Math.max(20, dims.depth*14)) * 0.15},${18 + Math.min(55, Math.max(20, dims.depth*14))}
                  `} fill="none" stroke="var(--amber)" strokeWidth="2" strokeDasharray="5 3" />
                )}
                {/* wheels */}
                <circle cx="50" cy="78" r="8" fill="var(--s2)" stroke="var(--border)" strokeWidth="2" />
                <circle cx={65 + Math.min(220, Math.max(60, dims.length*12)) - 25} cy="78" r="8" fill="var(--s2)" stroke="var(--border)" strokeWidth="2" />
                <circle cx={65 + Math.min(220, Math.max(60, dims.length*12)) - 45} cy="78" r="8" fill="var(--s2)" stroke="var(--border)" strokeWidth="2" />
                {/* dims label */}
                <text x={65 + Math.min(220, Math.max(60, dims.length*12))/2}
                  y={18 + Math.min(55, Math.max(20, dims.depth*14))/2 + 3}
                  textAnchor="middle" fill="var(--amber)" fontSize="9" fontFamily="monospace" opacity=".7">
                  {dims.length}' × {dims.topWidth}'{bedShape==="trapezoid" ? `/${dims.bottomWidth}'` : ""} × {dims.depth}'
                </text>
              </svg>
            </div>

            <button className="btn" onClick={() => setStep(1)} disabled={!canProceed[0]}>
              NEXT → SELECT MATERIAL
            </button>
          </div>
        )}

        {/* ═══════ STEP 1: MATERIAL ═══════ */}
        {step === 1 && (
          <div className="fade">
            <div className="label">Material Type</div>
            <div className="pill-row">
              {categories.map(c => (
                <button key={c} className={`pill ${materialFilter === c ? "active" : ""}`}
                  onClick={() => setMaterialFilter(c)}>{c}</button>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {filteredMaterials.map((m) => {
                const origIdx = MATERIALS.indexOf(m);
                return (
                  <button key={m.id} className={`chip ${materialIdx === origIdx ? "sel" : ""}`}
                    onClick={() => setMaterialIdx(origIdx)}>
                    <div className="swatch" style={{ background:m.color }} />
                    <div style={{ flex:1 }}>
                      <span style={{ fontWeight:600, color: materialIdx === origIdx ? "var(--amber)" : "var(--text)" }}>{m.name}</span>
                      <span style={{ fontSize:10, color:"var(--dim)", marginLeft:8 }}>{m.cat}</span>
                    </div>
                    <span style={{ fontSize:12, fontWeight:500, opacity:.5 }}>{m.density} t/yd³</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button className="btn-ghost" onClick={() => setStep(0)}>← Back</button>
              <button className="btn" style={{ flex:1 }} onClick={() => setStep(2)} disabled={!canProceed[1]}>
                NEXT → MOISTURE
              </button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 2: MOISTURE ═══════ */}
        {step === 2 && (
          <div className="fade">
            <div className="label">Moisture Condition</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {MOISTURE_LEVELS.map((m, i) => (
                <button key={m.id} className={`chip ${moistureIdx === i ? "sel" : ""}`}
                  onClick={() => setMoistureIdx(i)}
                  style={{ padding:"14px 16px" }}>
                  <span style={{ fontSize:24 }}>{m.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:15, color: moistureIdx === i ? "var(--amber)" : "var(--text)" }}>{m.label}</div>
                    <div style={{ fontSize:11, opacity:.5, marginTop:2 }}>{m.desc}</div>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, opacity:.5 }}>×{m.factor}</span>
                </button>
              ))}
            </div>

            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn" style={{ flex:1 }} onClick={() => setStep(3)}>
                NEXT → ESTIMATE LOAD
              </button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 3: FILL + HEAP ═══════ */}
        {step === 3 && (
          <div className="fade">
            {/* Suggestion bar */}
            {suggestion && (
              <div className="suggestion-bar" onClick={applySuggestion} style={{ boxShadow:"none", animation:"none" }}>
                <div>
                  <div style={{ fontWeight:600 }}>💡 Based on {suggestion.count} past estimates</div>
                  <div style={{ fontSize:10, opacity:.8, marginTop:2 }}>
                    Fill: {suggestion.fillPct}% • Heap: {HEAP_PROFILES.find(h=>h.id===suggestion.heapId)?.label}
                  </div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, background:"rgba(255,255,255,.2)", padding:"4px 10px", borderRadius:6 }}>APPLY</span>
              </div>
            )}

            {/* Photo capture with draggable fill line */}
            <div className="card">
              <div className="label">Reference Photo — drag line to fill level</div>
              {photo ? (
                <div className="photo-container" ref={photoContainerRef}
                  onPointerDown={onPointerDown} onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
                  style={{ height:240 }}>
                  <img src={photo} alt="Load" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  {/* Fill overlay */}
                  <div className="fill-overlay"
                    style={{ height:`${fillPct}%`, background: mat?.color || "var(--amber)" }} />
                  {/* Draggable line */}
                  <div className="fill-line" style={{ bottom:`${fillPct}%` }} />
                  <div className="fill-label" style={{ bottom:`${fillPct}%` }}>{fillPct}%</div>
                  <button onClick={() => setPhoto(null)} style={{
                    position:"absolute", top:8, right:8, background:"rgba(0,0,0,.7)",
                    border:"none", color:"#fff", width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:14, zIndex:5,
                  }}>✕</button>
                  <div style={{ position:"absolute", top:8, left:8, background:"rgba(0,0,0,.7)",
                    color:"var(--amber)", fontSize:10, padding:"4px 8px", borderRadius:4, zIndex:5 }}>
                    ↕ DRAG TO SET FILL
                  </div>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} style={{
                  width:"100%", padding:"32px 16px", border:"2px dashed var(--border)",
                  borderRadius:10, background:"transparent", color:"var(--dim)",
                  cursor:"pointer", fontFamily:"inherit", fontSize:13,
                }}>
                  📸 Tap to photograph the loaded truck
                  <div style={{ fontSize:10, marginTop:4, opacity:.5 }}>Or use slider below without a photo</div>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" capture="environment"
                onChange={handlePhoto} style={{ display:"none" }} />
            </div>

            {/* Fill slider (always visible) */}
            <div className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div className="label" style={{ margin:0 }}>Fill Level</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:28, fontWeight:900, color:"var(--amber)" }}>{fillPct}%</div>
              </div>
              <input type="range" min="10" max="100" value={fillPct}
                onChange={e => setFillPct(parseInt(e.target.value))} style={{ marginTop:8 }} />
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"var(--dim)", marginTop:4, letterSpacing:.5 }}>
                <span>10% QUARTER</span><span>50% HALF</span><span>75% ¾</span><span>100% FULL</span>
              </div>

              {/* Fill viz */}
              <svg viewBox="0 0 220 55" style={{ width:"100%", height:45, marginTop:8 }}>
                {bedShape === "trapezoid" ? (
                  <>
                    <polygon points="25,50 10,5 210,5 195,50" fill="none" stroke="var(--border)" strokeWidth="1.5" />
                    <clipPath id="bedClip"><polygon points="25,50 10,5 210,5 195,50" /></clipPath>
                    <rect x="0" y={50 - fillPct*.45} width="220" height={fillPct*.45} fill={mat?.color||"var(--amber)"} opacity=".35" clipPath="url(#bedClip)" />
                  </>
                ) : (
                  <>
                    <rect x="10" y="5" width="200" height="45" rx="2" fill="none" stroke="var(--border)" strokeWidth="1.5" />
                    <rect x="11" y={5+45*(1-fillPct/100)} width="198" height={45*fillPct/100} fill={mat?.color||"var(--amber)"} opacity=".35" rx="1" />
                  </>
                )}
                {heapIdx >= 2 && (
                  <polygon
                    points={bedShape === "trapezoid"
                      ? `25,${50 - fillPct*.45} 110,${50 - fillPct*.45 - heapIdx*5} 195,${50 - fillPct*.45}`
                      : `11,${5+45*(1-fillPct/100)} 110,${5+45*(1-fillPct/100)-heapIdx*5} 209,${5+45*(1-fillPct/100)}`
                    }
                    fill={mat?.color||"var(--amber)"} opacity=".25" />
                )}
              </svg>
            </div>

            {/* Heap Profile */}
            <div className="card">
              <div className="label">Heap Profile</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {HEAP_PROFILES.map((h, i) => (
                  <button key={h.id} className={`chip chip-sm ${heapIdx === i ? "sel" : ""}`}
                    onClick={() => setHeapIdx(i)}
                    style={{ flexDirection:"column", alignItems:"flex-start" }}>
                    <span style={{ fontWeight:600 }}>{h.label}</span>
                    <span style={{ fontSize:10, opacity:.5 }}>{h.desc} (×{h.factor})</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", gap:8, marginTop:4 }}>
              <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button className="btn" style={{ flex:1 }} onClick={() => { setStep(4); setSaved(false); }}>
                CALCULATE →
              </button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 4: RESULT ═══════ */}
        {step === 4 && mat && (
          <div className="fade">
            {/* Hero result */}
            <div className="card" style={{
              textAlign:"center", borderColor:"var(--amber)", padding:28,
              background:"linear-gradient(180deg, #1a1608 0%, var(--s1) 100%)",
            }}>
              <div style={{ fontSize:10, color:"var(--dim)", letterSpacing:3 }}>ESTIMATED WEIGHT</div>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:56, fontWeight:900, color:"var(--amber)", lineHeight:1, marginTop:8 }}>
                {estimatedWeight.toFixed(1)}
              </div>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:18, color:"var(--dim)", fontWeight:600 }}>TONS</div>
              <div style={{
                marginTop:14, fontSize:13, color:"var(--text)",
                background:"var(--s2)", padding:"10px 18px", borderRadius:10, display:"inline-block",
              }}>
                Range: <strong>{rangeLow.toFixed(1)}</strong> – <strong>{rangeHigh.toFixed(1)}</strong> tons
              </div>
              <div style={{ marginTop:8, fontSize:11, color:"var(--red)", fontWeight:500 }}>
                ⚠ ±15% estimate — verify on certified scale
              </div>
            </div>

            {/* Save for learning */}
            <button className={saved ? "btn-ghost" : "btn"} onClick={handleSave} disabled={saved}
              style={{ marginBottom:12, ...(saved ? {width:"100%", borderColor:"var(--green)", color:"var(--green)"} : {}) }}>
              {saved ? "✓ Saved — improving future suggestions" : "💾 Save Estimate (Improves Suggestions)"}
            </button>

            {/* Breakdown */}
            <div className="card">
              <div className="label">Calculation Breakdown</div>
              {[
                ["Truck", TRUCK_PROFILES[truckIdx].name],
                ["Bed Shape", bedShape.charAt(0).toUpperCase() + bedShape.slice(1)],
                ["Bed Dimensions", `${dims.length}' × ${dims.topWidth}'${bedShape==="trapezoid"?`/${dims.bottomWidth}'`:""} × ${dims.depth}'`],
                ["Bed Volume", `${bedVolumeYd3.toFixed(2)} yd³`],
                ["Fill Level", `${fillPct}%`],
                ["Heap Factor", `×${heapFactor} (${HEAP_PROFILES[heapIdx].label})`],
                ["Effective Volume", `${effectiveVolume.toFixed(2)} yd³`],
                ["Material", mat.name],
                ["Base Density", `${mat.density} tons/yd³`],
                ["Moisture", `${MOISTURE_LEVELS[moistureIdx].label} (×${moistureFactor})`],
                ["Adjusted Density", `${adjustedDensity.toFixed(3)} tons/yd³`],
              ].map(([k,v]) => (
                <div key={k} className="breakdown-row">
                  <span style={{ color:"var(--dim)" }}>{k}</span>
                  <span style={{ fontWeight:500 }}>{v}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0 0", marginTop:6 }}>
                <span style={{ color:"var(--amber)", fontWeight:700, fontSize:14 }}>TOTAL WEIGHT</span>
                <span style={{ color:"var(--amber)", fontWeight:900, fontSize:18, fontFamily:"'Outfit',sans-serif" }}>
                  {estimatedWeight.toFixed(2)} tons
                </span>
              </div>
            </div>

            {/* Conversions */}
            <div className="card">
              <div className="label">Conversions</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  [(estimatedWeight * 2000).toFixed(0), "POUNDS"],
                  [(estimatedWeight * 0.9072).toFixed(2), "METRIC TONS"],
                  [(estimatedWeight * 907.2).toFixed(0), "KILOGRAMS"],
                  [effectiveVolume.toFixed(1), "CUBIC YARDS"],
                ].map(([val, label]) => (
                  <div key={label} className="conversion-box">
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:700 }}>{val}</div>
                    <div style={{ fontSize:9, color:"var(--dim)", letterSpacing:1, marginTop:2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {photo && (
              <div className="card" style={{ padding:8 }}>
                <img src={photo} alt="Reference" style={{ width:"100%", borderRadius:8, maxHeight:140, objectFit:"cover" }} />
                <div style={{ fontSize:9, color:"var(--dim)", marginTop:4, textAlign:"center" }}>Reference photo • {new Date().toLocaleDateString()}</div>
              </div>
            )}

            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <button className="btn-ghost" onClick={() => setStep(3)}>← Adjust</button>
              <button className="btn" style={{ flex:1 }} onClick={() => {
                setStep(0); setTruckIdx(0); setMaterialIdx(null); setPhoto(null);
                setFillPct(85); setHeapIdx(1); setMoistureIdx(0); setSuggestion(null);
                setDims({ length:0, topWidth:0, bottomWidth:0, depth:0 });
              }}>
                NEW ESTIMATE
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:500, padding:"10px 20px 6px",
        background:"linear-gradient(transparent, var(--bg) 40%)", pointerEvents:"none",
      }}>
        <div style={{ fontSize:8, color:"var(--dim)", textAlign:"center", opacity:.5, letterSpacing:1 }}>
          TRUCKLOAD V1 • HAMPTON ROADS, VA • ESTIMATES ONLY — NOT FOR BILLING
        </div>
      </div>
    </div>
  );
}