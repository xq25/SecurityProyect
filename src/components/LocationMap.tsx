import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import '../styles/LocationMap.css';
import L from "leaflet";

// ⚙️ Corrige los íconos de Leaflet (necesario en React)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapSelectorProps {
  onSelectPosition?: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<{ setPosition: (pos: [number, number]) => void }> = ({
  setPosition,
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

  // 📍 Captura clics en el mapa
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      setPosition([lat, lng]);
    },
  });

  return markerPosition ? <Marker position={markerPosition} /> : null;
};

export const LocationMap: React.FC<MapSelectorProps> = ({ onSelectPosition }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleSetPosition = (pos: [number, number]) => {
    setPosition(pos);
    if (onSelectPosition) onSelectPosition(pos[0], pos[1]);
  };

  return (
    <div className="map-container-wrapper">
      <div className="map-container">
        <MapContainer
          center={[5.0703, -75.5138]} // 📍 Manizales
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />
          <LocationMarker setPosition={handleSetPosition} />
        </MapContainer>
      </div>

      {/* 📊 Coordenadas seleccionadas */}
      {position && (
        <div className="map-coordinates">
          📍 <strong>Latitud:</strong> {position[0].toFixed(6)} |{" "}
          <strong>Longitud:</strong> {position[1].toFixed(6)}
        </div>
      )}
    </div>
  );
};
