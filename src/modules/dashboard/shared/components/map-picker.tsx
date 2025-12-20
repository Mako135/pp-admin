"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLng } from "leaflet";
//@ts-ignore
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

function MapContent({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}) {
  const map = useMap();
  const [position, setPosition] = useState<[number, number]>([
    43.234684, 76.897039,
  ]); // Алматы по умолчанию

  const handleMapClick = async (e: any) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);

    // Получаем адрес из координат (обратное геокодирование)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const address = data.address?.street
        ? `${data.address.street}, ${
            data.address.city || data.address.town || ""
          }`
        : data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      onLocationSelect(lat, lng, address);
    } catch (error) {
      console.error("Error fetching address:", error);
      onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  useEffect(() => {
    if (map) {
      map.on("click", handleMapClick);
      return () => {
        map.off("click", handleMapClick);
      };
    }
  }, [map]);

  return (
    <>
      <TileLayer
        //@ts-ignore

        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Выбранное местоположение</Popup>
      </Marker>
    </>
  );
}

export function MapPicker({ onLocationSelect }: MapPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-96 bg-muted flex items-center justify-center rounded-md">
        Загрузка карты...
      </div>
    );
  }

  return (
    <MapContainer
      //@ts-ignore

      center={[43.23, 76.89]}
      zoom={12}
      style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
      className="border rounded-md"
    >
      <MapContent onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
}
