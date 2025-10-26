// src/components/MapLibreMap.tsx
import React, { useState, useCallback } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import '../styles/LocationMap.css';

interface MapLibreMapProps {
  onSelectPosition?: (lat: number, lng: number) => void;
  lat?: number;
  lng?: number;
}

export const LocationMap: React.FC<MapLibreMapProps> = ({ onSelectPosition, lat, lng }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  let latitude = 5.0703;
  let longitude = -75.5138;
  if (lat && lng){
    latitude = lat;
    longitude = lng;
  }
  const handleMapClick = useCallback((e: any) => {
    const { lngLat } = e;
    const coords = { lat: lngLat.lat, lng: lngLat.lng };
    setPosition(coords);
    if (onSelectPosition) onSelectPosition(coords.lat, coords.lng);
  }, [onSelectPosition]);

  return (
    <div className="maplibre-wrapper">
      
      <Map
        initialViewState={{
          latitude: latitude,
          longitude: longitude,
          zoom: 13,
        }}
        style={{ width: "100%", height: "400px", borderRadius: "10px" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        onClick={handleMapClick}
      >
        <NavigationControl position="top-right" />
        {position && (
          <Marker
            latitude={position.lat}
            longitude={position.lng}
            color="red"
            anchor="bottom"
          />
        )}
      </Map>

      {position && (
        <div className="maplibre-coordinates">
          📍 <strong>Latitud:</strong> {position.lat.toFixed(6)} |{" "}
          <strong>Longitud:</strong> {position.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};
