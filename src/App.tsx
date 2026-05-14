import { useState, useRef, useCallback, useEffect } from "react";

// ─── TRUCK DATA (grouped by manufacturer) ─────────────
interface TruckProfile {
  id: string; name: string; shape: "rectangular" | "trapezoid";
  length: number; topWidth: number; bottomWidth: number; depth: number;
  capacity: string; axle: string;
}
interface TruckMfg {
  id: string; name: string; logo: string; models: TruckProfile[];
}

const TRUCK_MANUFACTURERS: TruckMfg[] = [
  { id: "ford", name: "Ford", logo: "#003478", models: [
    { id: "f350", name: "F-350 Dump", shape: "rectangular", length: 8, topWidth: 7, bottomWidth: 7, depth: 2, capacity: "3-4 yd³", axle: "Single" },
    { id: "f450", name: "F-450 Dump", shape: "rectangular", length: 9, topWidth: 7, bottomWidth: 7, depth: 2.2, capacity: "4-5 yd³", axle: "Single" },
    { id: "f550", name: "F-550 Dump", shape: "rectangular", length: 10, topWidth: 7, bottomWidth: 7, depth: 2.5, capacity: "5-6 yd³", axle: "Single" },
    { id: "f600", name: "F-600 Dump", shape: "trapezoid", length: 10, topWidth: 7, bottomWidth: 6.5, depth: 2.5, capacity: "5-6 yd³", axle: "Single" },
    { id: "f650", name: "F-650 Dump", shape: "trapezoid", length: 11, topWidth: 7, bottomWidth: 6.5, depth: 2.8, capacity: "6-8 yd³", axle: "Single" },
    { id: "f750", name: "F-750 Dump", shape: "trapezoid", length: 12, topWidth: 7.5, bottomWidth: 6.5, depth: 3, capacity: "8-10 yd³", axle: "Single" },
  ]},
  { id: "chevy", name: "Chevrolet / GMC", logo: "#D1A827", models: [
    { id: "silv3500", name: "Silverado/Sierra 3500HD", shape: "rectangular", length: 8, topWidth: 7, bottomWidth: 7, depth: 2, capacity: "3-4 yd³", axle: "Single" },
    { id: "silv4500", name: "Silverado 4500HD", shape: "rectangular", length: 9, topWidth: 7, bottomWidth: 7, depth: 2.2, capacity: "4-5 yd³", axle: "Single" },
    { id: "silv5500", name: "Silverado 5500HD", shape: "rectangular", length: 10, topWidth: 7, bottomWidth: 7, depth: 2.5, capacity: "5-6 yd³", axle: "Single" },
    { id: "silv6500", name: "Silverado 6500HD", shape: "trapezoid", length: 11, topWidth: 7, bottomWidth: 6.5, depth: 2.8, capacity: "6-8 yd³", axle: "Single" },
    { id: "kodiak", name: "TopKick/Kodiak C7500", shape: "trapezoid", length: 12, topWidth: 7.5, bottomWidth: 6.5, depth: 3, capacity: "8-10 yd³", axle: "Single" },
  ]},
  { id: "ram", name: "RAM", logo: "#1A1A1A", models: [
    { id: "ram3500", name: "RAM 3500 Dump", shape: "rectangular", length: 8, topWidth: 7, bottomWidth: 7, depth: 2, capacity: "3-4 yd³", axle: "Single" },
    { id: "ram4500", name: "RAM 4500 Dump", shape: "rectangular", length: 9, topWidth: 7, bottomWidth: 7, depth: 2.2, capacity: "4-5 yd³", axle: "Single" },
    { id: "ram5500", name: "RAM 5500 Dump", shape: "rectangular", length: 10, topWidth: 7, bottomWidth: 7, depth: 2.5, capacity: "5-6 yd³", axle: "Single" },
  ]},
  { id: "intl", name: "International", logo: "#C41230", models: [
    { id: "mv607", name: "MV607 Dump", shape: "trapezoid", length: 10, topWidth: 7, bottomWidth: 6.5, depth: 2.3, capacity: "5-6 yd³", axle: "Single" },
    { id: "hv507", name: "HV507 Single Axle", shape: "trapezoid", length: 11, topWidth: 7, bottomWidth: 6.5, depth: 2.5, capacity: "6-8 yd³", axle: "Single" },
    { id: "hv613", name: "HV613 Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", axle: "Tandem" },
    { id: "hx615", name: "HX615 Tandem", shape: "trapezoid", length: 14.5, topWidth: 7.5, bottomWidth: 6.5, depth: 2.7, capacity: "11-13 yd³", axle: "Tandem" },
    { id: "hx620_tri", name: "HX620 Tri-Axle", shape: "trapezoid", length: 17, topWidth: 8, bottomWidth: 7, depth: 3.5, capacity: "16-18 yd³", axle: "Tri-Axle" },
    { id: "hx620_quad", name: "HX620 Quad Axle", shape: "trapezoid", length: 18, topWidth: 8, bottomWidth: 7, depth: 3.7, capacity: "18-20 yd³", axle: "Quad" },
  ]},
  { id: "mack", name: "Mack", logo: "#8B7355", models: [
    { id: "mack_md6", name: "MD6 Medium Duty", shape: "trapezoid", length: 10, topWidth: 7, bottomWidth: 6.5, depth: 2.3, capacity: "5-6 yd³", axle: "Single" },
    { id: "mack_granite_s", name: "Granite Single Axle", shape: "trapezoid", length: 12, topWidth: 7.5, bottomWidth: 6.5, depth: 2.5, capacity: "8-10 yd³", axle: "Single" },
    { id: "mack_granite_t", name: "Granite Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", axle: "Tandem" },
    { id: "mack_granite_tri", name: "Granite Tri-Axle", shape: "trapezoid", length: 17, topWidth: 8, bottomWidth: 7, depth: 3.5, capacity: "16-18 yd³", axle: "Tri-Axle" },
    { id: "mack_granite_quad", name: "Granite Quad Axle", shape: "trapezoid", length: 18, topWidth: 8, bottomWidth: 7, depth: 3.7, capacity: "18-20 yd³", axle: "Quad" },
    { id: "mack_pinnacle", name: "Pinnacle Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.7, capacity: "10-12 yd³", axle: "Tandem" },
  ]},
  { id: "kenworth", name: "Kenworth", logo: "#E85D00", models: [
    { id: "kw_t370", name: "T370 Single Axle", shape: "trapezoid", length: 11, topWidth: 7, bottomWidth: 6.5, depth: 2.5, capacity: "6-8 yd³", axle: "Single" },
    { id: "kw_t470", name: "T470 Single Axle", shape: "trapezoid", length: 12, topWidth: 7.5, bottomWidth: 6.5, depth: 2.8, capacity: "8-10 yd³", axle: "Single" },
    { id: "kw_t800_s", name: "T800 Single Axle", shape: "trapezoid", length: 12, topWidth: 7.5, bottomWidth: 6.5, depth: 2.5, capacity: "8-10 yd³", axle: "Single" },
    { id: "kw_t800_t", name: "T800 Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", axle: "Tandem" },
    { id: "kw_t880_t", name: "T880 Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", axle: "Tandem" },
    { id: "kw_t880_tri", name: "T880 Tri-Axle", shape: "trapezoid", length: 17, topWidth: 8, bottomWidth: 7, depth: 3.5, capacity: "16-18 yd³", axle: "Tri-Axle" },
    { id: "kw_t880_quad", name: "T880S Quad Axle", shape: "trapezoid", length: 18, topWidth: 8, bottomWidth: 7, depth: 3.7, capacity: "18-20 yd³", axle: "Quad" },
  ]},
  { id: "peterbilt", name: "Peterbilt", logo: "#C8102E", models: [
    { id: "pb_348", name: "348 Single Axle", shape: "trapezoid", length: 11, topWidth: 7, bottomWidth: 6.5, depth: 2.5, capacity: "6-8 yd³", axle: "Single" },
    { id: "pb_365", name: "365 Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", axle: "Tandem" },
    { id: "pb_567_t", name: "567 Tandem", shape: "trapezoid", length: 14.5, topWidth: 7.5, bottomWidth: 6.5, depth: 2.7, capacity: "11-13 yd³", axle: "Tandem" },
    { id: "pb_567_tri", name: "567 Tri-Axle", shape: "trapezoid", length: 17, topWidth: 8, bottomWidth: 7, depth: 3.5, capacity: "16-18 yd³", axle: "Tri-Axle" },
    { id: "pb_567_quad", name: "567 Quad Axle", shape: "trapezoid", length: 18, topWidth: 8, bottomWidth: 7, depth: 3.7, capacity: "18-20 yd³", axle: "Quad" },
    { id: "pb_389", name: "389 Transfer Dump", shape: "trapezoid", length: 22, topWidth: 8, bottomWidth: 7, depth: 4, capacity: "24-26 yd³", axle: "Transfer" },
  ]},
  { id: "volvo", name: "Volvo", logo: "#003057", models: [
    { id: "volvo_vhd_s", name: "VHD 300 Single Axle", shape: "trapezoid", length: 12, topWidth: 7.5, bottomWidth: 6.5, depth: 2.5, capacity: "8-10 yd³", axle: "Single" },
    { id: "volvo_vhd_t", name: "VHD 300 Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", axle: "Tandem" },
    { id: "volvo_vhd_tri", name: "VHD 300 Tri-Axle", shape: "trapezoid", length: 17, topWidth: 8, bottomWidth: 7, depth: 3.5, capacity: "16-18 yd³", axle: "Tri-Axle" },
    { id: "volvo_a25", name: "A25G Articulated", shape: "trapezoid", length: 14, topWidth: 9, bottomWidth: 7.5, depth: 4, capacity: "16-18 yd³", axle: "Artic 6x6" },
    { id: "volvo_a30", name: "A30G Articulated", shape: "trapezoid", length: 15, topWidth: 9.5, bottomWidth: 8, depth: 4.5, capacity: "20-22 yd³", axle: "Artic 6x6" },
    { id: "volvo_a40", name: "A40G Articulated", shape: "trapezoid", length: 16.5, topWidth: 10, bottomWidth: 8.5, depth: 5, capacity: "26-28 yd³", axle: "Artic 6x6" },
  ]},
  { id: "freightliner", name: "Freightliner", logo: "#555555", models: [
    { id: "fl_m2106", name: "M2 106 Single Axle", shape: "trapezoid", length: 11, topWidth: 7, bottomWidth: 6.5, depth: 2.5, capacity: "6-8 yd³", axle: "Single" },
    { id: "fl_m2112", name: "M2 112 Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", axle: "Tandem" },
    { id: "fl_114sd_s", name: "114SD Single Axle", shape: "trapezoid", length: 12, topWidth: 7.5, bottomWidth: 6.5, depth: 2.5, capacity: "8-10 yd³", axle: "Single" },
    { id: "fl_114sd_t", name: "114SD Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", axle: "Tandem" },
    { id: "fl_114sd_tri", name: "114SD Tri-Axle", shape: "trapezoid", length: 17, topWidth: 8, bottomWidth: 7, depth: 3.5, capacity: "16-18 yd³", axle: "Tri-Axle" },
    { id: "fl_122sd_t", name: "122SD Tandem", shape: "trapezoid", length: 14.5, topWidth: 7.5, bottomWidth: 6.5, depth: 2.7, capacity: "11-13 yd³", axle: "Tandem" },
    { id: "fl_122sd_tri", name: "122SD Tri-Axle", shape: "trapezoid", length: 17, topWidth: 8, bottomWidth: 7, depth: 3.5, capacity: "16-18 yd³", axle: "Tri-Axle" },
  ]},
  { id: "western_star", name: "Western Star", logo: "#1C3D6E", models: [
    { id: "ws_4700", name: "4700SF Single Axle", shape: "trapezoid", length: 12, topWidth: 7.5, bottomWidth: 6.5, depth: 2.5, capacity: "8-10 yd³", axle: "Single" },
    { id: "ws_4700_t", name: "4700SB Tandem", shape: "trapezoid", length: 14, topWidth: 7.5, bottomWidth: 6.5, depth: 2.6, capacity: "10-12 yd³", axle: "Tandem" },
    { id: "ws_4900_t", name: "4900 Tandem", shape: "trapezoid", length: 14.5, topWidth: 7.5, bottomWidth: 6.5, depth: 2.7, capacity: "11-13 yd³", axle: "Tandem" },
    { id: "ws_4900_tri", name: "4900 Tri-Axle", shape: "trapezoid", length: 17, topWidth: 8, bottomWidth: 7, depth: 3.5, capacity: "16-18 yd³", axle: "Tri-Axle" },
    { id: "ws_6900_tri", name: "6900XD Tri-Axle", shape: "trapezoid", length: 17.5, topWidth: 8, bottomWidth: 7, depth: 3.6, capacity: "17-19 yd³", axle: "Tri-Axle" },
  ]},
  { id: "cat", name: "Caterpillar", logo: "#FFCB05", models: [
    { id: "cat_730", name: "730 Articulated", shape: "trapezoid", length: 14, topWidth: 9, bottomWidth: 7.5, depth: 4, capacity: "16-18 yd³", axle: "Artic 6x6" },
    { id: "cat_735", name: "735 Articulated", shape: "trapezoid", length: 14.5, topWidth: 9.5, bottomWidth: 8, depth: 4.2, capacity: "18-20 yd³", axle: "Artic 6x6" },
    { id: "cat_740", name: "740 GC Articulated", shape: "trapezoid", length: 15, topWidth: 9.5, bottomWidth: 8, depth: 4.5, capacity: "20-22 yd³", axle: "Artic 6x6" },
    { id: "cat_745", name: "745 Articulated", shape: "trapezoid", length: 16, topWidth: 10, bottomWidth: 8.5, depth: 5, capacity: "26-28 yd³", axle: "Artic 6x6" },
    { id: "cat_770", name: "770G Off-Highway", shape: "trapezoid", length: 18, topWidth: 12, bottomWidth: 10, depth: 6, capacity: "40-42 yd³", axle: "Rigid" },
    { id: "cat_775", name: "775G Off-Highway", shape: "trapezoid", length: 20, topWidth: 13, bottomWidth: 11, depth: 7, capacity: "55-58 yd³", axle: "Rigid" },
  ]},
  { id: "trailer", name: "Trailers / Other", logo: "#4A8B3F", models: [
    { id: "transfer", name: "Transfer Dump", shape: "trapezoid", length: 22, topWidth: 8, bottomWidth: 7, depth: 4, capacity: "24-26 yd³", axle: "Transfer" },
    { id: "belly", name: "Belly Dump Trailer", shape: "trapezoid", length: 20, topWidth: 8, bottomWidth: 5, depth: 4.5, capacity: "20-22 yd³", axle: "Bottom-dump" },
    { id: "end_dump", name: "End Dump Trailer", shape: "trapezoid", length: 24, topWidth: 8, bottomWidth: 7, depth: 5, capacity: "28-32 yd³", axle: "Trailer" },
    { id: "side_dump", name: "Side Dump Trailer", shape: "trapezoid", length: 26, topWidth: 8.5, bottomWidth: 7, depth: 5.5, capacity: "32-36 yd³", axle: "Trailer" },
  ]},
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

// ─── STORAGE ─────────────────────────────────────────
function loadHistory(): any[] { try { const d = localStorage.getItem("truckload_history"); return d ? JSON.parse(d) : []; } catch { return []; } }
function saveEstimate(entry: any) { try { const h = loadHistory(); h.push({ ...entry, ts: Date.now() }); localStorage.setItem("truckload_history", JSON.stringify(h.slice(-100))); } catch {} }
function getSuggestion(truckId: any, materialId: any) {
  try {
    const h = loadHistory().filter((x: any) => x.truckId === truckId && x.materialId === materialId);
    if (h.length < 3) return null;
    const avgFill = Math.round(h.reduce((s: number, m: any) => s + m.fillPct, 0) / h.length);
    const hc: any = {}; h.forEach((m: any) => { hc[m.heapId] = (hc[m.heapId] || 0) + 1; });
    return { fillPct: avgFill, heapId: Object.entries(hc).sort((a: any, b: any) => b[1] - a[1])[0][0], count: h.length };
  } catch { return null; }
}

// ─── API KEY STORAGE ─────────────────────────────────
function getStoredKey(): string { return localStorage.getItem("truckload_openai_key") || ""; }
function storeKey(k: string) { localStorage.setItem("truckload_openai_key", k); }
function getStoredToggles() {
  try { const d = localStorage.getItem("truckload_ai_toggles"); return d ? JSON.parse(d) : { truck: true, photo: true }; }
  catch { return { truck: true, photo: true }; }
}
function storeToggles(t: { truck: boolean; photo: boolean }) { localStorage.setItem("truckload_ai_toggles", JSON.stringify(t)); }

// ─── GPT API ─────────────────────────────────────────
async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 1, messages: [{ role: "user", content: "hi" }] }),
    });
    return res.ok;
  } catch { return false; }
}

async function lookupTruckDimensions(query: string, apiKey: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini", temperature: 0.2,
      messages: [
        { role: "system", content: `You are a dump truck specifications expert. Given a truck description, return dump bed dimensions as JSON only. Format: {"name":"Full Model Name","shape":"trapezoid or rectangular","length":FT,"topWidth":FT,"bottomWidth":FT,"depth":FT,"capacity":"X-Y yd³","confidence":"high/medium/low"}. All in feet. Rectangular beds: topWidth equals bottomWidth. Return ONLY valid JSON.` },
        { role: "user", content: query }
      ],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "API error");
  return JSON.parse(data.choices[0].message.content.trim().replace(/```json\n?|```/g, "").trim());
}

async function analyzeLoadPhotos(base64Images: string[], apiKey: string) {
  const imageContent = base64Images.map(img => ({ type: "image_url" as const, image_url: { url: img, detail: "low" as const } }));
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o", temperature: 0.3, max_tokens: 600,
      messages: [
        { role: "system", content: `You analyze photos of loaded dump trucks. You may receive 1-3 photos. Return JSON only.

FIRST: determine if the photo(s) actually show a dump truck with a loaded bed. If NOT (e.g. person, animal, car, landscape, random object, empty truck, selfie), return:
{"isValidLoad":false,"rejection":"Brief reason why this isn't a loaded dump truck photo"}

If it IS a loaded dump truck, return:
{"isValidLoad":true,"fillPercent":NUMBER_10_to_100,"materialGuess":"material name","heapProfile":"flat|crowned|heaped|maxheap","truckGuess":"truck make/model if visible","confidence":"high|medium|low","issue":null_or_string,"betterAngle":null_or_string,"notes":"brief observation"}

confidence: high=clear load view, medium=partially obscured, low=bad angle/blurry.
issue: null if fine, otherwise what's wrong. betterAngle: null or suggested angle.
Return ONLY valid JSON, no markdown.` },
        { role: "user", content: [
          ...imageContent,
          { type: "text", text: `Analyze ${base64Images.length === 1 ? "this photo" : "these " + base64Images.length + " photos"}. First determine if this shows a loaded dump truck. If yes, estimate fill level, material, and heap profile.` }
        ]}
      ],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "API error");
  const raw = data.choices[0].message.content.trim().replace(/```json\n?|```/g, "").trim();
  try { return JSON.parse(raw); }
  catch { return { isValidLoad: false, rejection: "AI returned an unreadable response. Try with a clearer photo." }; }
}

// ─── COLORS ──────────────────────────────────────────
const C = {
  green: "#4A8B3F", greenLight: "#6BBF59", greenPale: "#E8F5E4",
  blue: "#5B7DB1", bluePale: "#E4ECF5",
  dark: "#2D3B2D", bg: "#FFFFFF", surface: "#F7F9F5", surface2: "#EFF3EB",
  border: "#D4DDD0", dim: "#7A8A72", text: "#1A2B1A",
  red: "#C0392B", success: "#27AE60", warn: "#E67E22",
};

// ─── TOGGLE SWITCH COMPONENT ─────────────────────────
function Toggle({ on, onToggle, label, desc }: { on: boolean; onToggle: () => void; label: string; desc: string }) {
  return (
    <button onClick={onToggle} style={{
      display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
      border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left",
    }}>
      <div style={{
        width: 40, height: 22, borderRadius: 11, padding: 2,
        background: on ? C.green : C.border, transition: "background .2s",
        flexShrink: 0,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: 9, background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.15)",
          transform: on ? "translateX(18px)" : "translateX(0)", transition: "transform .2s",
        }} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: on ? C.text : C.dim }}>{label}</div>
        <div style={{ fontSize: 10, color: C.dim }}>{desc}</div>
      </div>
    </button>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────
export default function LoadWeighV2() {
  const [step, setStep] = useState(0);
  const [selMfgIdx, setSelMfgIdx] = useState<number | null>(null);
  const [selModelIdx, setSelModelIdx] = useState<number | null>(null);
  const [bedShape, setBedShape] = useState<"rectangular" | "trapezoid">("rectangular");
  const [dims, setDims] = useState({ length: 0, topWidth: 0, bottomWidth: 0, depth: 0 });
  const [materialIdx, setMaterialIdx] = useState<number | null>(null);
  const [materialFilter, setMaterialFilter] = useState("All");
  const [moistureIdx, setMoistureIdx] = useState(0);
  const [fillPct, setFillPct] = useState(85);
  const [heapIdx, setHeapIdx] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  // ─── AI state ───
  const [apiKey, setApiKey] = useState(getStoredKey());
  const [keyInput, setKeyInput] = useState("");
  const [keyStatus, setKeyStatus] = useState<"none" | "checking" | "valid" | "invalid">(getStoredKey() ? "valid" : "none");
  const [aiTruck, setAiTruck] = useState(getStoredToggles().truck);
  const [aiPhoto, setAiPhoto] = useState(getStoredToggles().photo);
  const [truckQuery, setTruckQuery] = useState("");
  const [truckLookupLoading, setTruckLookupLoading] = useState(false);
  const [truckLookupResult, setTruckLookupResult] = useState<any>(null);
  const [truckLookupError, setTruckLookupError] = useState("");
  const [photoAnalysis, setPhotoAnalysis] = useState<any>(null);
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);
  const [photoAnalysisError, setPhotoAnalysisError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const keyInputRef = useRef<HTMLInputElement>(null);

  const selectedTruck = selMfgIdx !== null && selModelIdx !== null ? TRUCK_MANUFACTURERS[selMfgIdx].models[selModelIdx] : null;
  const keyValid = keyStatus === "valid";

  // Re-validate stored key on mount
  useEffect(() => {
    if (apiKey && keyStatus === "valid") {
      validateApiKey(apiKey).then(ok => { if (!ok) { setKeyStatus("invalid"); } });
    }
  }, []);

  useEffect(() => {
    if (selectedTruck && materialIdx !== null) setSuggestion(getSuggestion(selectedTruck.id, MATERIALS[materialIdx].id));
  }, [selectedTruck, materialIdx]);
  useEffect(() => { setHistoryCount(loadHistory().length); }, []);

  const handleToggleTruck = () => {
    const next = !aiTruck; setAiTruck(next); storeToggles({ truck: next, photo: aiPhoto });
  };
  const handleTogglePhoto = () => {
    const next = !aiPhoto; setAiPhoto(next); storeToggles({ truck: aiTruck, photo: next });
  };

  const handleKeySave = async () => {
    const k = keyInput.trim();
    if (!k) return;
    setKeyStatus("checking");
    const ok = await validateApiKey(k);
    if (ok) {
      setApiKey(k); storeKey(k); setKeyStatus("valid");
    } else {
      setKeyStatus("invalid");
    }
  };

  const handleKeyRemove = () => {
    setApiKey(""); storeKey(""); setKeyInput(""); setKeyStatus("none");
  };

  const handleModelSelect = (mfgIdx: number, modelIdx: number) => {
    setSelMfgIdx(mfgIdx); setSelModelIdx(modelIdx); setTruckLookupResult(null);
    const m = TRUCK_MANUFACTURERS[mfgIdx].models[modelIdx];
    setBedShape(m.shape); setDims({ length: m.length, topWidth: m.topWidth, bottomWidth: m.bottomWidth, depth: m.depth });
  };

  const handleTruckLookup = async () => {
    if (!truckQuery.trim() || !apiKey) return;
    setTruckLookupLoading(true); setTruckLookupError(""); setTruckLookupResult(null);
    try {
      const r = await lookupTruckDimensions(truckQuery, apiKey);
      setTruckLookupResult(r); setBedShape(r.shape);
      setDims({ length: r.length, topWidth: r.topWidth, bottomWidth: r.bottomWidth, depth: r.depth });
      setSelMfgIdx(null); setSelModelIdx(null);
    } catch (e: any) { setTruckLookupError(e.message || "Lookup failed"); }
    finally { setTruckLookupLoading(false); }
  };

  const handlePhoto = (e: any) => {
    const file = e.target.files?.[0];
    if (file && photos.length < 3) {
      const r = new FileReader();
      r.onload = (ev: any) => { setPhotos(prev => [...prev, ev.target.result]); setPhotoAnalysis(null); setPhotoAnalysisError(""); };
      r.readAsDataURL(file);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAnalyzePhoto = async () => {
    if (photos.length === 0 || !apiKey) return;
    setPhotoAnalyzing(true); setPhotoAnalysisError(""); setPhotoAnalysis(null);
    try { setPhotoAnalysis(await analyzeLoadPhotos(photos, apiKey)); }
    catch (e: any) { setPhotoAnalysisError(e.message || "Analysis failed"); }
    finally { setPhotoAnalyzing(false); }
  };

  const applyPhotoAnalysis = () => {
    if (!photoAnalysis || !photoAnalysis.isValidLoad) return;
    setFillPct(Math.max(10, Math.min(100, photoAnalysis.fillPercent)));
    const heapMap: any = { flat: 0, crowned: 1, heaped: 2, maxheap: 3 };
    if (heapMap[photoAnalysis.heapProfile] !== undefined) setHeapIdx(heapMap[photoAnalysis.heapProfile]);
    const guess = photoAnalysis.materialGuess.toLowerCase();
    const mi = MATERIALS.findIndex(m => m.name.toLowerCase().includes(guess) || guess.includes(m.name.toLowerCase()) || guess.includes(m.id.replace(/_/g, " ")));
    if (mi >= 0 && materialIdx === null) setMaterialIdx(mi);
  };

  const handleDrag = useCallback((clientY: number) => {
    const c = photoContainerRef.current; if (!c) return;
    const r = c.getBoundingClientRect();
    setFillPct(Math.round(Math.max(10, Math.min(100, (1 - (clientY - r.top) / r.height) * 100))));
  }, []);

  const onPointerDown = (e: any) => { setDragging(true); handleDrag(e.clientY); };
  const onPointerMove = (e: any) => { if (dragging) handleDrag(e.clientY); };
  const onPointerUp = () => setDragging(false);

  const calcVolume = () => {
    const { length: l, topWidth: tw, bottomWidth: bw, depth: d } = dims;
    return bedShape === "trapezoid" ? (l * ((tw + bw) / 2) * d) / 27 : (l * tw * d) / 27;
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

  const handleSave = () => {
    if (materialIdx === null || saved) return;
    saveEstimate({ truckId: selectedTruck?.id || truckLookupResult?.name || "custom", materialId: MATERIALS[materialIdx].id, fillPct, heapId: HEAP_PROFILES[heapIdx].id, moistureId: MOISTURE_LEVELS[moistureIdx].id, weight: estimatedWeight });
    setSaved(true); setHistoryCount(p => p + 1);
  };

  const applySuggestion = () => {
    if (!suggestion) return; setFillPct(suggestion.fillPct);
    const hi = HEAP_PROFILES.findIndex(h => h.id === suggestion.heapId); if (hi >= 0) setHeapIdx(hi);
  };

  const categories = ["All", ...new Set(MATERIALS.map(m => m.cat))];
  const filteredMaterials = materialFilter === "All" ? MATERIALS : MATERIALS.filter(m => m.cat === materialFilter);
  const STEPS = ["Truck", "Material", "Moisture", "Load", "Result"];
  const canProceed = [bedVolumeYd3 > 0.1, materialIdx !== null, true, true, true];
  const truckDisplayName = selectedTruck ? `${TRUCK_MANUFACTURERS[selMfgIdx!].name} ${selectedTruck.name}` : truckLookupResult ? `${truckLookupResult.name} (AI)` : "Custom";

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', 'Fira Code', monospace", background: C.bg, color: C.text, minHeight: "100vh", maxWidth: 500, margin: "0 auto", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fade { animation: fadeUp .3s ease-out; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } }
        @keyframes spin { to { transform: rotate(360deg) } }
        input[type=range] { -webkit-appearance:none; width:100%; height:8px; background:${C.surface2}; border-radius:4px; outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:28px; height:28px; background:${C.green}; border-radius:50%; cursor:pointer; border:3px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,.15); }
        input[type=number], input[type=text], input[type=password] { background:${C.surface}; border:1px solid ${C.border}; color:${C.text}; padding:10px 12px; border-radius:8px; font-family:inherit; font-size:15px; width:100%; outline:none; }
        input[type=number]:focus, input[type=text]:focus, input[type=password]:focus { border-color:${C.green}; box-shadow:0 0 0 3px ${C.greenPale}; }
        .card { background:${C.surface}; border:1px solid ${C.border}; border-radius:14px; padding:16px; margin-bottom:12px; }
        .label { font-size:10px; color:${C.dim}; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px; font-weight:600; }
        .chip { display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:10px; font-size:13px; cursor:pointer; transition:all .15s; border:1px solid ${C.border}; background:#fff; color:${C.dim}; width:100%; text-align:left; font-family:inherit; }
        .chip:hover { border-color:${C.green}; background:${C.greenPale}; }
        .chip.sel { border-color:${C.green}; background:${C.greenPale}; color:${C.green}; box-shadow:0 0 0 2px ${C.greenPale}; }
        .chip-sm { padding:8px 12px; font-size:12px; }
        .btn { width:100%; padding:14px; border:none; border-radius:12px; background:${C.green}; color:#fff; font-family:'Outfit',sans-serif; font-size:15px; font-weight:700; cursor:pointer; letter-spacing:.5px; transition:all .15s; box-shadow:0 2px 8px rgba(74,139,63,.25); }
        .btn:hover { filter:brightness(1.08); }
        .btn:disabled { opacity:.3; cursor:not-allowed; box-shadow:none; }
        .btn-ghost { padding:10px 16px; border:1px solid ${C.border}; border-radius:10px; background:#fff; color:${C.dim}; font-family:inherit; font-size:13px; cursor:pointer; }
        .btn-ghost:hover { border-color:${C.green}; color:${C.green}; }
        .pill-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
        .pill { padding:5px 12px; border-radius:20px; font-size:11px; font-weight:500; cursor:pointer; border:1px solid ${C.border}; background:#fff; color:${C.dim}; font-family:inherit; letter-spacing:.4px; transition:all .15s; }
        .pill.active { background:${C.green}; color:#fff; border-color:${C.green}; font-weight:700; }
        .pill.done { background:${C.greenPale}; color:${C.success}; border-color:${C.success}; }
        .swatch { width:14px; height:14px; border-radius:4px; flex-shrink:0; border:1px solid rgba(0,0,0,.08); }
        .photo-container { position:relative; width:100%; border-radius:10px; overflow:hidden; touch-action:none; user-select:none; }
        .fill-line { position:absolute; left:0; right:0; height:3px; background:${C.green}; box-shadow:0 0 8px ${C.greenLight}; pointer-events:none; z-index:2; }
        .fill-label { position:absolute; right:8px; transform:translateY(-50%); background:${C.green}; color:#fff; font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px; z-index:3; pointer-events:none; }
        .fill-overlay { position:absolute; left:0; right:0; bottom:0; z-index:1; pointer-events:none; opacity:.3; }
        .suggestion-bar { background:${C.blue}; color:#fff; padding:10px 14px; border-radius:10px; font-size:12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; cursor:pointer; }
        .ai-bar { background:${C.bluePale}; border:1px solid ${C.blue}; color:${C.text}; padding:12px 14px; border-radius:10px; font-size:12px; margin-bottom:12px; }
        .ai-bar-title { font-weight:700; font-size:12px; color:${C.blue}; display:flex; align-items:center; gap:6px; margin-bottom:6px; }
        .breakdown-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid ${C.border}; font-size:13px; }
        .breakdown-row:last-child { border:none; }
        .conversion-box { background:${C.surface2}; padding:12px; border-radius:8px; text-align:center; }
        .spinner { display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:spin .6s linear infinite; }
        .spinner-dark { display:inline-block; width:14px; height:14px; border:2px solid ${C.border}; border-top-color:${C.green}; border-radius:50%; animation:spin .6s linear infinite; }
        .ai-badge { display:inline-flex; align-items:center; gap:4px; background:${C.blue}; color:#fff; font-size:9px; font-weight:700; padding:2px 7px; border-radius:4px; letter-spacing:.5px; }
        .mfg-btn { display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:10px; border:1px solid ${C.border}; background:#fff; cursor:pointer; font-family:inherit; width:100%; text-align:left; transition:all .15s; font-size:13px; color:${C.text}; }
        .mfg-btn:hover { border-color:${C.green}; background:${C.greenPale}; }
        .mfg-btn.open { border-color:${C.green}; background:${C.greenPale}; }
        .mfg-models { padding:0 0 6px 28px; }
      `}</style>

      {/* ─── HEADER ──── */}
      <div style={{ padding: "14px 20px 10px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="12" r="10" fill="#5B7DB1" stroke="#2D3B2D" strokeWidth="1.2"/>
              <path d="M6 14 Q8 8 12 6 Q15 5 18 6 Q16 10 13 9 Q10 8 8 12 Q7 14 6 14 Z" fill="#6BBF59"/>
              <path d="M20 7 Q22 9 22 12 Q21 14 19 15 Q18 12 20 10 Z" fill="#6BBF59"/>
              <path d="M9 16 Q12 18 16 17 Q19 16 21 17 Q18 20 14 20 Q10 19 9 16 Z" fill="#6BBF59"/>
              <path d="M7 20 C9 18 12 23 15 24 C18 23 21 18 23 20" stroke="#4A8B3F" strokeWidth="2.2" fill="#6BBF59" fillOpacity=".4" strokeLinecap="round"/>
              <path d="M10 22 C12 21 13.5 25 15 26 C16.5 25 18 21 20 22" stroke="#3D6B3D" strokeWidth="1.6" fill="#4A8B3F" fillOpacity=".3" strokeLinecap="round"/>
              <path d="M15 23 L15 29" stroke="#2D3B2D" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 900, letterSpacing: -1, color: C.dark }}>TRUCKLOAD</div>
              <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2, fontWeight: 300 }}>WEIGHT ESTIMATOR • V2</div>
            </div>
          </div>
          {historyCount > 0 && <div style={{ fontSize: 10, color: C.dim }}><span style={{ color: C.success, fontWeight: 600 }}>{historyCount}</span> saved</div>}
        </div>
        <div className="pill-row" style={{ marginBottom: 0 }}>
          {STEPS.map((s, i) => (
            <button key={s} className={`pill ${i === step ? "active" : i < step ? "done" : ""}`}
              onClick={() => { if (i < step) setStep(i); }}>{i < step ? "✓" : ""} {s}</button>
          ))}
        </div>
      </div>

      {/* ─── AI PANEL (always visible, contextual) ──── */}
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{
          background: keyValid ? C.greenPale : C.surface,
          border: `1px solid ${keyValid ? C.green : C.border}`,
          borderRadius: 12, padding: "12px 14px", marginBottom: 12,
        }}>
          {keyStatus === "none" || keyStatus === "invalid" ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>🤖</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Enable AI Features</span>
                <span style={{ fontSize: 10, color: C.dim }}>(optional)</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input ref={keyInputRef} type="password" placeholder="Paste OpenAI API key (sk-...)"
                  value={keyInput} onChange={e => setKeyInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleKeySave(); }}
                  style={{ fontSize: 12, padding: "8px 10px", flex: 1 }} />
                <button className="btn" onClick={handleKeySave}
                  disabled={keyStatus === "checking" || !keyInput.trim()}
                  style={{ width: "auto", padding: "8px 16px", fontSize: 12 }}>
                  {keyStatus === "checking" ? <span className="spinner" /> : "Verify"}
                </button>
              </div>
              {keyStatus === "invalid" && (
                <div style={{ fontSize: 11, color: C.red, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  ✗ Invalid key — check and try again
                </div>
              )}
              <div style={{ fontSize: 10, color: C.dim, marginTop: 6 }}>
                AI can look up truck specs and analyze load photos. You can use the app fully without it.
              </div>
            </>
          ) : keyStatus === "checking" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
              <span className="spinner-dark" />
              <span style={{ fontSize: 12, color: C.dim }}>Verifying API key...</span>
            </div>
          ) : (
            /* keyStatus === "valid" */
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: C.success, fontWeight: 700 }}>✓ AI Connected</span>
                  <span className="ai-badge">GPT</span>
                </div>
                <button onClick={handleKeyRemove} style={{
                  border: "none", background: "transparent", color: C.dim, fontSize: 10,
                  cursor: "pointer", fontFamily: "inherit", textDecoration: "underline",
                }}>Remove key</button>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <Toggle on={aiTruck} onToggle={handleToggleTruck}
                  label="Truck Lookup" desc="Search any truck by name" />
                <Toggle on={aiPhoto} onToggle={handleTogglePhoto}
                  label="Photo Analysis" desc="AI reads your load photos" />
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: "0 20px 120px" }}>

        {/* STEP 0: TRUCK */}
        {step === 0 && (
          <div className="fade">

            {/* AI Truck Lookup — only if key valid + toggle on */}
            {keyValid && aiTruck && (
              <>
                <div className="card" style={{ borderColor: C.blue }}>
                  <div className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="ai-badge">AI</span> Look Up Any Truck
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="text" placeholder='"Mack Granite tri-axle" or "CAT 740"'
                      value={truckQuery} onChange={e => setTruckQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleTruckLookup(); }}
                      style={{ fontSize: 12, flex: 1 }} />
                    <button className="btn" onClick={handleTruckLookup}
                      disabled={truckLookupLoading || !truckQuery.trim()}
                      style={{ width: "auto", padding: "10px 18px", fontSize: 13 }}>
                      {truckLookupLoading ? <span className="spinner" /> : "Search"}
                    </button>
                  </div>
                  {truckLookupError && <div style={{ color: C.red, fontSize: 11, marginTop: 8 }}>{truckLookupError}</div>}
                  {truckLookupResult && (
                    <div className="ai-bar" style={{ marginTop: 10, marginBottom: 0 }}>
                      <div className="ai-bar-title">🤖 {truckLookupResult.name}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11 }}>
                        <span>Length: <strong>{truckLookupResult.length}'</strong></span>
                        <span>Top Width: <strong>{truckLookupResult.topWidth}'</strong></span>
                        <span>Bottom Width: <strong>{truckLookupResult.bottomWidth}'</strong></span>
                        <span>Depth: <strong>{truckLookupResult.depth}'</strong></span>
                        <span>Shape: <strong>{truckLookupResult.shape}</strong></span>
                        <span>Capacity: <strong>{truckLookupResult.capacity}</strong></span>
                      </div>
                      <div style={{ fontSize: 10, marginTop: 6, color: C.dim }}>
                        Confidence: <span style={{ color: truckLookupResult.confidence === "high" ? C.success : truckLookupResult.confidence === "medium" ? C.warn : C.red, fontWeight: 600 }}>
                          {truckLookupResult.confidence}</span> — verify with iPhone Measure if in doubt
                      </div>
                      <button className="btn" style={{ fontSize: 12, padding: "8px 14px", marginTop: 8, width: "auto" }}
                        onClick={() => { setBedShape(truckLookupResult.shape); setDims({ length: truckLookupResult.length, topWidth: truckLookupResult.topWidth, bottomWidth: truckLookupResult.bottomWidth, depth: truckLookupResult.depth }); setSelMfgIdx(null); setSelModelIdx(null); }}>
                        ✓ Accept Dimensions
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "center", fontSize: 10, color: C.dim, margin: "4px 0 12px", letterSpacing: 1 }}>— OR SELECT FROM DATABASE ({TRUCK_MANUFACTURERS.reduce((s, m) => s + m.models.length, 0)} trucks) —</div>
              </>
            )}

            <div className="label">Select Manufacturer → Model</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
              {TRUCK_MANUFACTURERS.map((mfg, mIdx) => (
                <div key={mfg.id}>
                  <button className={`mfg-btn ${selMfgIdx === mIdx ? "open" : ""}`}
                    onClick={() => setSelMfgIdx(selMfgIdx === mIdx ? null : mIdx)}>
                    <div style={{ width:28, height:28, borderRadius:6, background:mfg.logo, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color: ["#FFCB05","#D1A827"].includes(mfg.logo) ? "#1A1A1A" : "#fff", flexShrink:0, fontFamily:"'Outfit',sans-serif" }}>{mfg.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{mfg.name}</div><div style={{ fontSize: 10, color: C.dim }}>{mfg.models.length} models</div></div>
                    <span style={{ fontSize: 12, color: C.dim }}>{selMfgIdx === mIdx ? "▲" : "▼"}</span>
                  </button>
                  {selMfgIdx === mIdx && (
                    <div className="mfg-models fade">
                      {mfg.models.map((model, mi) => {
                        const isSel = selMfgIdx === mIdx && selModelIdx === mi;
                        return (
                          <button key={model.id} className={`chip ${isSel ? "sel" : ""}`} onClick={() => handleModelSelect(mIdx, mi)} style={{ marginTop: 4 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, color: isSel ? C.green : C.text, fontSize: 12 }}>{model.name}</div>
                              <div style={{ fontSize: 10, color: C.dim, marginTop: 1 }}>{model.axle} • {model.shape}</div>
                            </div>
                            <div style={{ fontSize: 11, color: C.dim, textAlign: "right" }}>{model.capacity}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="card">
              <div className="label">Bed Shape</div>
              <div style={{ display: "flex", gap: 8 }}>
                {(["rectangular", "trapezoid"] as const).map(s => (
                  <button key={s} className={`chip chip-sm ${bedShape === s ? "sel" : ""}`} onClick={() => setBedShape(s)} style={{ flex: 1, justifyContent: "center" }}>
                    <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{s}</span>
                  </button>
                ))}
              </div>
              <svg viewBox="0 0 200 70" style={{ width: "100%", height: 55, marginTop: 10 }}>
                {bedShape === "rectangular"
                  ? <rect x="30" y="10" width="140" height="50" rx="2" fill="none" stroke={C.green} strokeWidth="2" opacity=".6" />
                  : <polygon points="45,60 20,10 180,10 155,60" fill="none" stroke={C.green} strokeWidth="2" opacity=".6" />}
                <text x="100" y="40" textAnchor="middle" fill={C.dim} fontSize="9" fontFamily="monospace">{bedShape === "trapezoid" ? "Top wider than bottom" : "Equal top & bottom"}</text>
              </svg>
            </div>

            <div className="card">
              <div className="label">Bed Dimensions (feet) — verify with iPhone Measure App</div>
              <div style={{ display: "grid", gridTemplateColumns: bedShape === "trapezoid" ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10, marginTop: 4 }}>
                <div><div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>Length</div>
                  <input type="number" step="0.5" min="0" max="50" value={dims.length || ""} onChange={e => { setDims({ ...dims, length: parseFloat(e.target.value) || 0 }); setSelMfgIdx(null); setSelModelIdx(null); }} placeholder="0" /></div>
                <div><div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>{bedShape === "trapezoid" ? "Top Width" : "Width"}</div>
                  <input type="number" step="0.5" min="0" max="20" value={dims.topWidth || ""} onChange={e => { const v = parseFloat(e.target.value) || 0; setDims({ ...dims, topWidth: v, ...(bedShape === "rectangular" ? { bottomWidth: v } : {}) }); setSelMfgIdx(null); setSelModelIdx(null); }} placeholder="0" /></div>
                {bedShape === "trapezoid" && <div><div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>Bottom Width</div>
                  <input type="number" step="0.5" min="0" max="20" value={dims.bottomWidth || ""} onChange={e => { setDims({ ...dims, bottomWidth: parseFloat(e.target.value) || 0 }); setSelMfgIdx(null); setSelModelIdx(null); }} placeholder="0" /></div>}
                <div><div style={{ fontSize: 10, color: C.dim, marginBottom: 4 }}>Depth</div>
                  <input type="number" step="0.5" min="0" max="10" value={dims.depth || ""} onChange={e => { setDims({ ...dims, depth: parseFloat(e.target.value) || 0 }); setSelMfgIdx(null); setSelModelIdx(null); }} placeholder="0" /></div>
              </div>
              <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: C.dim }}>Bed Volume</span>
                <span style={{ color: C.green, fontWeight: 700, fontFamily: "'Outfit',sans-serif", fontSize: 16 }}>{bedVolumeYd3.toFixed(1)} yd³</span>
              </div>
              {bedShape === "trapezoid" && dims.topWidth > 0 && dims.bottomWidth > 0 && (
                <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>Trapezoid correction: {((1 - dims.bottomWidth / dims.topWidth) * 100).toFixed(0)}% narrower at bottom</div>
              )}
            </div>

            <button className="btn" onClick={() => setStep(1)} disabled={!canProceed[0]}>NEXT → SELECT MATERIAL</button>
          </div>
        )}

        {/* STEP 1: MATERIAL */}
        {step === 1 && (
          <div className="fade">
            <div className="label">Material Type</div>
            {photoAnalysis?.materialGuess && materialIdx === null && (
              <div className="ai-bar" style={{ marginBottom: 10 }}>
                <div className="ai-bar-title">🤖 AI detected: {photoAnalysis.materialGuess}</div>
                <div style={{ fontSize: 11, color: C.dim }}>Select the matching material below</div>
              </div>
            )}
            <div className="pill-row">
              {categories.map(c => <button key={c} className={`pill ${materialFilter === c ? "active" : ""}`} onClick={() => setMaterialFilter(c)}>{c}</button>)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {filteredMaterials.map(m => {
                const oi = MATERIALS.indexOf(m);
                return (
                  <button key={m.id} className={`chip ${materialIdx === oi ? "sel" : ""}`} onClick={() => setMaterialIdx(oi)}>
                    <div className="swatch" style={{ background: m.color }} />
                    <div style={{ flex: 1 }}><span style={{ fontWeight: 600, color: materialIdx === oi ? C.green : C.text }}>{m.name}</span><span style={{ fontSize: 10, color: C.dim, marginLeft: 8 }}>{m.cat}</span></div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.dim }}>{m.density} t/yd³</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn-ghost" onClick={() => setStep(0)}>← Back</button>
              <button className="btn" style={{ flex: 1 }} onClick={() => setStep(2)} disabled={!canProceed[1]}>NEXT → MOISTURE</button>
            </div>
          </div>
        )}

        {/* STEP 2: MOISTURE */}
        {step === 2 && (
          <div className="fade">
            <div className="label">Moisture Condition</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MOISTURE_LEVELS.map((m, i) => (
                <button key={m.id} className={`chip ${moistureIdx === i ? "sel" : ""}`} onClick={() => setMoistureIdx(i)} style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 24 }}>{m.icon}</span>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 15, color: moistureIdx === i ? C.green : C.text }}>{m.label}</div><div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{m.desc}</div></div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.dim }}>×{m.factor}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn" style={{ flex: 1 }} onClick={() => setStep(3)}>NEXT → ESTIMATE LOAD</button>
            </div>
          </div>
        )}

        {/* STEP 3: LOAD */}
        {step === 3 && (
          <div className="fade">
            {suggestion && (
              <div className="suggestion-bar" onClick={applySuggestion}>
                <div><div style={{ fontWeight: 600 }}>💡 Based on {suggestion.count} past estimates</div>
                  <div style={{ fontSize: 10, opacity: .8, marginTop: 2 }}>Fill: {suggestion.fillPct}% • Heap: {HEAP_PROFILES.find(h => h.id === suggestion.heapId)?.label}</div></div>
                <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,.2)", padding: "4px 10px", borderRadius: 6 }}>APPLY</span>
              </div>
            )}
            <div className="card">
              <div className="label">
                {keyValid && aiPhoto
                  ? `Reference Photos — up to 3 angles (${photos.length}/3)`
                  : "Reference Photo — drag line to fill level"}
              </div>
              {photos.length > 0 ? (
                <>
                  {/* Photo thumbnails row */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    {photos.map((p, i) => (
                      <div key={i} style={{ position: "relative", width: photos.length === 1 ? "100%" : `${100 / photos.length}%`, height: photos.length === 1 ? 200 : 90, borderRadius: 8, overflow: "hidden" }}>
                        <img src={p} alt={`Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <button onClick={() => { setPhotos(prev => prev.filter((_, j) => j !== i)); setPhotoAnalysis(null); }} style={{
                          position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,.6)", border: "none", color: "#fff",
                          width: 20, height: 20, borderRadius: "50%", cursor: "pointer", fontSize: 11, zIndex: 5,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>✕</button>
                        {i === 0 && photos.length === 1 && (
                          <div style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,.6)", color: "#fff", fontSize: 10, padding: "3px 6px", borderRadius: 4, zIndex: 5 }}>
                            {keyValid && aiPhoto ? "📸 Main photo" : "↕ DRAG TO SET FILL"}
                          </div>
                        )}
                        {photos.length > 1 && (
                          <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,.6)", color: "#fff", fontSize: 9, padding: "2px 5px", borderRadius: 3 }}>
                            {i === 0 ? "Side" : i === 1 ? "Top/Front" : "Detail"}
                          </div>
                        )}
                      </div>
                    ))}
                    {photos.length < 3 && (
                      <button onClick={() => fileRef.current?.click()} style={{
                        width: photos.length === 1 ? 90 : `${100 / (photos.length + 1)}%`, minWidth: 70,
                        height: photos.length === 1 ? 200 : 90,
                        border: `2px dashed ${C.border}`, borderRadius: 8, background: "transparent",
                        color: C.dim, cursor: "pointer", fontFamily: "inherit", fontSize: 11,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                      }}>
                        <span style={{ fontSize: 20 }}>+</span>
                        <span>Add angle</span>
                      </button>
                    )}
                  </div>
                  {keyValid && aiPhoto && (
                    <div style={{ fontSize: 10, color: C.dim, marginBottom: 8 }}>
                      💡 Multiple angles improve accuracy: side view (fill level), top view (material), front (truck ID)
                    </div>
                  )}

                  {/* Fill line on first photo for manual drag */}
                  {!keyValid || !aiPhoto ? (
                    <div className="photo-container" ref={photoContainerRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} style={{ height: 200, marginBottom: 8 }}>
                      <img src={photos[0]} alt="Load" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div className="fill-overlay" style={{ height: `${fillPct}%`, background: mat?.color || C.green }} />
                      <div className="fill-line" style={{ bottom: `${fillPct}%` }} />
                      <div className="fill-label" style={{ bottom: `${fillPct}%` }}>{fillPct}%</div>
                    </div>
                  ) : null}

                  {/* AI Analyze button */}
                  {keyValid && aiPhoto && !photoAnalysis && (
                    <button className="btn" onClick={handleAnalyzePhoto} disabled={photoAnalyzing} style={{ marginTop: 4, background: C.blue }}>
                      {photoAnalyzing ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span className="spinner" /> Analyzing {photos.length} photo{photos.length > 1 ? "s" : ""} with GPT-4o...</span>
                        : `🤖 Analyze ${photos.length} Photo${photos.length > 1 ? "s" : ""} with AI`}
                    </button>
                  )}
                  {photoAnalysisError && <div style={{ color: C.red, fontSize: 11, marginTop: 8 }}>{photoAnalysisError}</div>}
                  {photoAnalysis && !photoAnalysis.isValidLoad && (
                    <div style={{ marginTop: 10, padding: "14px", background: "#FFEBEE", border: `1px solid ${C.red}`, borderRadius: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.red, marginBottom: 4 }}>❌ Not a loaded dump truck</div>
                      <div style={{ fontSize: 12, color: C.text }}>{photoAnalysis.rejection}</div>
                      <div style={{ fontSize: 11, color: C.dim, marginTop: 6 }}>Please upload a photo showing the loaded bed of a dump truck.</div>
                      <button className="btn-ghost" onClick={() => { setPhotos([]); setPhotoAnalysis(null); fileRef.current?.click(); }}
                        style={{ marginTop: 8, fontSize: 11, padding: "6px 12px" }}>📸 Take a new photo</button>
                    </div>
                  )}
                  {photoAnalysis && photoAnalysis.isValidLoad && (
                    <div className="ai-bar" style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className="ai-bar-title" style={{ marginBottom: 0 }}>🤖 AI Photo Analysis</div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                          background: photoAnalysis.confidence === "high" ? C.greenPale : photoAnalysis.confidence === "medium" ? "#FFF3E0" : "#FFEBEE",
                          color: photoAnalysis.confidence === "high" ? C.success : photoAnalysis.confidence === "medium" ? C.warn : C.red,
                        }}>{photoAnalysis.confidence} confidence</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11, marginTop: 6 }}>
                        <span>Fill: <strong>{photoAnalysis.fillPercent}%</strong></span><span>Heap: <strong>{photoAnalysis.heapProfile}</strong></span>
                        <span>Material: <strong>{photoAnalysis.materialGuess}</strong></span><span>Truck: <strong>{photoAnalysis.truckGuess}</strong></span>
                      </div>
                      {photoAnalysis.notes && <div style={{ fontSize: 10, color: C.dim, marginTop: 6, fontStyle: "italic" }}>"{photoAnalysis.notes}"</div>}

                      {/* Low/medium confidence guidance */}
                      {(photoAnalysis.issue || photoAnalysis.betterAngle) && (
                        <div style={{ marginTop: 8, padding: "8px 10px", background: photoAnalysis.confidence === "low" ? "#FFEBEE" : "#FFF8E1", borderRadius: 6, fontSize: 11 }}>
                          {photoAnalysis.issue && <div style={{ color: photoAnalysis.confidence === "low" ? C.red : C.warn, fontWeight: 600 }}>⚠ {photoAnalysis.issue}</div>}
                          {photoAnalysis.betterAngle && <div style={{ color: C.dim, marginTop: 2 }}>📸 Tip: {photoAnalysis.betterAngle}</div>}
                          {photos.length < 3 && (
                            <button className="btn-ghost" onClick={() => { setPhotoAnalysis(null); fileRef.current?.click(); }}
                              style={{ marginTop: 6, fontSize: 11, padding: "6px 12px" }}>
                              + Add another photo and re-analyze
                            </button>
                          )}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        <button className="btn" style={{ fontSize: 12, padding: "8px 14px" }} onClick={applyPhotoAnalysis}>✓ Apply AI Estimates</button>
                        <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => setPhotoAnalysis(null)}>
                          {photoAnalysis.confidence === "low" ? "Retry" : "Dismiss"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: "32px 16px", border: `2px dashed ${C.border}`, borderRadius: 10, background: "transparent", color: C.dim, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                  📸 Tap to photograph the loaded truck
                  <div style={{ fontSize: 10, marginTop: 4, opacity: .5 }}>{keyValid && aiPhoto ? "AI will analyze fill level, material & heap • add up to 3 angles" : "Or use slider below"}</div>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="label" style={{ margin: 0 }}>Fill Level</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 900, color: C.green }}>{fillPct}%</div>
              </div>
              <input type="range" min="10" max="100" value={fillPct} onChange={e => setFillPct(parseInt(e.target.value))} style={{ marginTop: 8 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.dim, marginTop: 4, letterSpacing: .5 }}>
                <span>10% QUARTER</span><span>50% HALF</span><span>75% ¾</span><span>100% FULL</span>
              </div>
              <svg viewBox="0 0 220 55" style={{ width: "100%", height: 45, marginTop: 8 }}>
                {bedShape === "trapezoid" ? (<>
                  <polygon points="25,50 10,5 210,5 195,50" fill="none" stroke={C.border} strokeWidth="1.5" />
                  <clipPath id="bedClip"><polygon points="25,50 10,5 210,5 195,50" /></clipPath>
                  <rect x="0" y={50 - fillPct * .45} width="220" height={fillPct * .45} fill={mat?.color || C.green} opacity=".35" clipPath="url(#bedClip)" />
                </>) : (<>
                  <rect x="10" y="5" width="200" height="45" rx="2" fill="none" stroke={C.border} strokeWidth="1.5" />
                  <rect x="11" y={5 + 45 * (1 - fillPct / 100)} width="198" height={45 * fillPct / 100} fill={mat?.color || C.green} opacity=".35" rx="1" />
                </>)}
                {heapIdx >= 2 && <polygon points={bedShape === "trapezoid"
                  ? `25,${50 - fillPct * .45} 110,${50 - fillPct * .45 - heapIdx * 5} 195,${50 - fillPct * .45}`
                  : `11,${5 + 45 * (1 - fillPct / 100)} 110,${5 + 45 * (1 - fillPct / 100) - heapIdx * 5} 209,${5 + 45 * (1 - fillPct / 100)}`} fill={mat?.color || C.green} opacity=".25" />}
              </svg>
            </div>

            <div className="card">
              <div className="label">Heap Profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {HEAP_PROFILES.map((h, i) => (
                  <button key={h.id} className={`chip chip-sm ${heapIdx === i ? "sel" : ""}`} onClick={() => setHeapIdx(i)} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 600 }}>{h.label}</span><span style={{ fontSize: 10, color: C.dim }}>{h.desc} (×{h.factor})</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button className="btn" style={{ flex: 1 }} onClick={() => { setStep(4); setSaved(false); }}>CALCULATE →</button>
            </div>
          </div>
        )}

        {/* STEP 4: RESULT */}
        {step === 4 && mat && (
          <div className="fade">
            <div className="card" style={{ textAlign: "center", borderColor: C.green, padding: 28, background: `linear-gradient(180deg, ${C.greenPale} 0%, #fff 100%)` }}>
              <div style={{ fontSize: 10, color: C.dim, letterSpacing: 3 }}>ESTIMATED WEIGHT</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 56, fontWeight: 900, color: C.green, lineHeight: 1, marginTop: 8 }}>{estimatedWeight.toFixed(1)}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, color: C.dim, fontWeight: 600 }}>TONS</div>
              <div style={{ marginTop: 14, fontSize: 13, color: C.text, background: C.surface2, padding: "10px 18px", borderRadius: 10, display: "inline-block" }}>
                Range: <strong>{rangeLow.toFixed(1)}</strong> – <strong>{rangeHigh.toFixed(1)}</strong> tons
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: C.red, fontWeight: 500 }}>⚠ ±15% estimate — verify on certified scale</div>
            </div>

            {photoAnalysis && photoAnalysis.isValidLoad && (
              <div className="ai-bar">
                <div className="ai-bar-title">🤖 AI Cross-Check</div>
                <div style={{ fontSize: 11 }}>
                  AI estimated <strong>{photoAnalysis.fillPercent}%</strong> fill with <strong>{photoAnalysis.heapProfile}</strong> heap
                  {photoAnalysis.materialGuess && <> • detected <strong>{photoAnalysis.materialGuess}</strong></>}
                  {Math.abs(photoAnalysis.fillPercent - fillPct) > 15 && (
                    <div style={{ color: C.warn, marginTop: 4, fontWeight: 600 }}>⚠ AI fill ({photoAnalysis.fillPercent}%) differs from yours ({fillPct}%) by {Math.abs(photoAnalysis.fillPercent - fillPct)}%</div>
                  )}
                </div>
              </div>
            )}

            <button className={saved ? "btn-ghost" : "btn"} onClick={handleSave} disabled={saved}
              style={{ marginBottom: 12, ...(saved ? { width: "100%", borderColor: C.success, color: C.success } : {}) }}>
              {saved ? "✓ Saved — improving future suggestions" : "💾 Save Estimate"}
            </button>

            <div className="card">
              <div className="label">Calculation Breakdown</div>
              {[["Truck", truckDisplayName], ["Bed Shape", bedShape.charAt(0).toUpperCase() + bedShape.slice(1)],
              ["Bed Dimensions", `${dims.length}' × ${dims.topWidth}'${bedShape === "trapezoid" ? `/${dims.bottomWidth}'` : ""} × ${dims.depth}'`],
              ["Bed Volume", `${bedVolumeYd3.toFixed(2)} yd³`], ["Fill Level", `${fillPct}%`],
              ["Heap Factor", `×${heapFactor} (${HEAP_PROFILES[heapIdx].label})`], ["Effective Volume", `${effectiveVolume.toFixed(2)} yd³`],
              ["Material", mat.name], ["Base Density", `${mat.density} tons/yd³`],
              ["Moisture", `${MOISTURE_LEVELS[moistureIdx].label} (×${moistureFactor})`], ["Adjusted Density", `${adjustedDensity.toFixed(3)} tons/yd³`],
              ].map(([k, v]) => <div key={k} className="breakdown-row"><span style={{ color: C.dim }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span></div>)}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", marginTop: 6 }}>
                <span style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>TOTAL WEIGHT</span>
                <span style={{ color: C.green, fontWeight: 900, fontSize: 18, fontFamily: "'Outfit',sans-serif" }}>{estimatedWeight.toFixed(2)} tons</span>
              </div>
            </div>

            <div className="card">
              <div className="label">Conversions</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[[(estimatedWeight * 2000).toFixed(0), "POUNDS"], [(estimatedWeight * 0.9072).toFixed(2), "METRIC TONS"],
                [(estimatedWeight * 907.2).toFixed(0), "KILOGRAMS"], [effectiveVolume.toFixed(1), "CUBIC YARDS"]].map(([v, l]) => (
                  <div key={l} className="conversion-box"><div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: C.text }}>{v}</div>
                    <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1, marginTop: 2 }}>{l}</div></div>
                ))}
              </div>
            </div>

            {photos.length > 0 && (
              <div className="card" style={{ padding: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {photos.map((p, i) => <img key={i} src={p} alt={`Reference ${i+1}`} style={{ width: `${100/photos.length}%`, borderRadius: 8, maxHeight: 140, objectFit: "cover" }} />)}
                </div>
                <div style={{ fontSize: 9, color: C.dim, marginTop: 4, textAlign: "center" }}>{photos.length} reference photo{photos.length > 1 ? "s" : ""} • {new Date().toLocaleDateString()}</div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="btn-ghost" onClick={() => setStep(3)}>← Adjust</button>
              <button className="btn" style={{ flex: 1 }} onClick={() => {
                setStep(0); setSelMfgIdx(null); setSelModelIdx(null); setMaterialIdx(null);
                setPhotos([]); setFillPct(85); setHeapIdx(1); setMoistureIdx(0);
                setSuggestion(null); setDims({ length: 0, topWidth: 0, bottomWidth: 0, depth: 0 });
                setTruckLookupResult(null); setTruckQuery(""); setPhotoAnalysis(null);
              }}>NEW ESTIMATE</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 500, padding: "10px 20px 6px", background: "linear-gradient(transparent, #fff 40%)", pointerEvents: "none" }}>
        <div style={{ fontSize: 8, color: C.dim, textAlign: "center", opacity: .5, letterSpacing: 1 }}>TRUCKLOAD V2 • HAMPTON ROADS, VA • ESTIMATES ONLY — NOT FOR BILLING</div>
      </div>
    </div>
  );
}
