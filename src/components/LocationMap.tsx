import React, { useState, useCallback, useEffect } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/LocationMap.css";
interface MapLibreMapProps {
  onSelectPosition?: (lat: number, lng: number) => void;
  lat?: number;
  lng?: number;
}

export const LocationMap: React.FC<MapLibreMapProps> = ({
  onSelectPosition,
  lat,
  lng,
}) => {
  // 🔹 Estado del marcador (posición seleccionada)
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  //  Coordenadas iniciales (por defecto: Manizales)
  const defaultLat = 5.0703;
  const defaultLng = -75.5138;

  // ✅ Si nos pasan `lat` y `lng`, inicializa el marcador con ellos
  useEffect(() => {
    if (lat && lng) {
      setPosition({ lat, lng });
    }
  }, [lat, lng]);

  // 🔹 Maneja los clics en el mapa para actualizar marcador
  const handleMapClick = useCallback(
    (e: any) => {
      const { lngLat } = e;
      const coords = { lat: lngLat.lat, lng: lngLat.lng };
      setPosition(coords);
      if (onSelectPosition) onSelectPosition(coords.lat, coords.lng);
    },
    [onSelectPosition]
  );

  return (
    <div className="maplibre-wrapper">
      <Map
        initialViewState={{
          latitude: lat ?? defaultLat,
          longitude: lng ?? defaultLng,
          zoom: 13,
        }}
        style={{ width: "100%", height: "400px", borderRadius: "10px" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        onClick={handleMapClick}
      >
        <NavigationControl position="top-right" />

        {/* ✅ Muestra marcador si hay posición inicial o seleccionada */}
        {position && (
          <Marker
            latitude={position.lat}
            longitude={position.lng}
            color="red"
            anchor="bottom"
          />
        )}
      </Map>

      {/* ✅ Muestra coordenadas seleccionadas */}
      {position && (
        <div className="maplibre-coordinates">
          📍 <strong>Latitud:</strong> {position.lat.toFixed(6)} |{" "}
          <strong>Longitud:</strong> {position.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};
