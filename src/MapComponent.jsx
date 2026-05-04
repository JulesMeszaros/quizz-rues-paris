import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function MapComponent() {
    const mapRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        fetch("/voie.geojson")
            .then((res) => res.json())
            .then((data) => {
                L.geoJSON(data).addTo(mapRef.current);
            });
    }, []);

    useEffect(() => {
        // ⛔ important : import dynamique
        import("leaflet").then((L) => {
            if (mapRef.current) return;

            const map = L.map(containerRef.current, {
                minZoom: 12,
                maxZoom: 16,
            }).setView([48.8566, 2.3522], 12.4);

            L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png", {
                attribution: "&copy; OpenStreetMap & Carto",
            }).addTo(map);

            mapRef.current = map;
        });
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ height: "100%", width: "100%" }}
        />
    );
}