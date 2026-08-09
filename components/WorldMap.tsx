"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

type Office = { id:string; city:string; country:string; state:string; address:string; lat:number; lng:number; headcount:number; projects:number; pulse:string; unit:string };

const MapInner = dynamic(() => Promise.resolve(MapComponent), { ssr: false });

function MapComponent({ offices, onSelect }: { offices: Office[]; onSelect: (o: Office)=>void }) {
  const [L, setL] = useState<any>(null);
  const [ready, setReady] = useState(false);
  useEffect(()=> {
    import("leaflet").then(mod=> { setL(mod); setReady(true); });
    if (!document.querySelector('link[href*="leaflet@1.9.4"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.querySelector('link[href*="MarkerCluster.css"]')) {
      const c2 = document.createElement("link");
      c2.rel = "stylesheet";
      c2.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
      document.head.appendChild(c2);
      const c3 = document.createElement("link");
      c3.rel = "stylesheet";
      c3.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
      document.head.appendChild(c3);
    }
  },[]);

  if (!ready || !L) return <div className="h-[420px] grid place-items-center text-white/50 bg-[#0f1a33] rounded-2xl">Loading world map…</div>;

  return <LeafletMap offices={offices} onSelect={onSelect} L={L} />;
}

function LeafletMap({ offices, onSelect, L }: any) {
  const mapRef = useRef<any>(null);
  const clusterRef = useRef<any>(null);
  const onSelectRef = useRef(onSelect);
  useEffect(()=> { onSelectRef.current = onSelect; }, [onSelect]);

  // Init map once
  useEffect(()=> {
    const container = document.getElementById("tievora-map");
    if (!container) return;
    if ((container as any)._leaflet_id) {
      try { (container as any)._leaflet_id = null; } catch {}
      container.innerHTML = "";
    }
    let cancelled = false;
    let map: any = null;

    (async () => {
      map = L.map("tievora-map", { worldCopyJump: true, zoomControl: true }).setView([48, 20], 3);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { attribution: "&copy; CARTO &copy; OpenStreetMap", maxZoom: 18 }).addTo(map);
      try {
        await import("leaflet.markercluster");
        clusterRef.current = (L as any).markerClusterGroup({ showCoverageOnHover:false, spiderfyOnMaxZoom:true, maxClusterRadius: 40 });
      } catch {
        clusterRef.current = L.layerGroup();
      }
      if (!cancelled) {
        map.addLayer(clusterRef.current);
        mapRef.current = map;
      }
    })();

    return () => {
      cancelled = true;
      try { if (map) map.remove(); } catch {}
      mapRef.current = null;
      clusterRef.current = null;
      try {
        const c = document.getElementById("tievora-map");
        if (c) { (c as any)._leaflet_id = null; c.innerHTML = ""; }
      } catch {}
    };
  }, [L]);

  // Update markers when offices change — without re-creating map
  useEffect(()=> {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster || !L) return;
    try { cluster.clearLayers(); } catch {}
    const colors: Record<string,string> = { Create:"#d4a843", Banking:"#3dd5d6", Industry:"#7c5cfc", Connect:"#34d399", Care:"#f472b6", Transform:"#f59e0b" };
    offices.forEach((o: Office) => {
      const color = colors[o.unit] || "#d4a843";
      const html = `<div style="background:${color};width:14px;height:14px;border-radius:999px;border:2px solid #0a0f1e;box-shadow:0 0 10px ${color}99"></div>`;
      const icon = L.divIcon({ html, className:"", iconSize:[14,14], iconAnchor:[7,7] });
      const m = L.marker([o.lat, o.lng], { icon });
      m.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:220px">
          <b>${o.city}</b> <span style="color:#6b7280">• ${o.country} / ${o.state}</span><br/>
          <span style="font-size:11px;color:#6b7280">${o.address}</span><br/>
          <span style="font-size:11px;background:${color}20;color:${color};padding:2px 6px;border-radius:999px;border:1px solid ${color}40">${o.unit}</span>
          <span style="font-size:11px;margin-left:6px">${o.headcount} people • ${o.projects} projects</span>
          <div style="margin-top:6px;font-size:12px;color:#0a0f1e;background:#f8fafc;border:1px solid #e2e8f0;padding:6px 8px;border-radius:8px">› ${o.pulse}</div>
          <div style="margin-top:6px;font-size:11px;color:#3b82f6">Tap to focus office card ↓</div>
        </div>
      `);
      m.on("click", ()=> onSelectRef.current(o));
      cluster.addLayer(m);
    });
    if (offices.length) {
      try {
        const bounds = L.latLngBounds(offices.map((o:Office)=>[o.lat,o.lng]));
        map.fitBounds(bounds.pad(0.25), { animate: true });
      } catch {}
    }
  }, [offices, L]);

  return <div id="tievora-map" className="h-[420px] md:h-[520px] w-full rounded-2xl overflow-hidden border border-white/10" />;
}

export default function WorldMap({ offices, onSelect }: { offices: Office[]; onSelect: (o: Office)=>void }) {
  return <MapInner offices={offices} onSelect={onSelect} />;
}
