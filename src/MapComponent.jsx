/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import "leaflet/dist/leaflet.css";

const MapComponent = forwardRef(function MapComponent({onMapReady}, ref) {
    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const layerRef = useRef(null);

    const [layerReady, setLayerReady] = useState(false);

    useEffect(() => {
        // ⛔ important : import dynamique
        import("leaflet").then((L) => {
            if (mapRef.current) return;

            const map = L.map(containerRef.current, {
                minZoom: 12,
                maxZoom: 17,
            }).setView([48.8566, 2.3522], 12.4);

            const layer = L.geoJSON(null, {
                style: { color: "red", weight: 4 },
            }).addTo(map);

            L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png", {
                attribution: "&copy; OpenStreetMap & Carto",
            }).addTo(map);

            mapRef.current = map;
            layerRef.current = layer;

            setLayerReady(true); // ✅ Couche prête
        });
    }, []);

    //Permet de notifier le parent que la carte est prête
    useEffect(()=>{
        if(onMapReady){
            onMapReady(layerReady);
        }
    },[onMapReady])

    // 👇 API exposée au parent

    useImperativeHandle(ref, () => ({
        addStreet(feature) {
            layerRef.current.addData(feature);
        },
    }));

    return (
        <div
            ref={containerRef}
            style={{ height: "100%", width: "100%" }}
        />
    );
});

export default MapComponent;