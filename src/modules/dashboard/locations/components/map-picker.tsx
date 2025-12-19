"use client";

import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: "/marker-icon.png",
	shadowUrl: "/marker-shadow.png",
});

type Props = {
	onSelect: (lat: number, lon: number) => void;
	disabled?: boolean;
};

function ClickHandler({ onSelect }: Props) {
	useMapEvents({
		click(e) {
			onSelect(e.latlng.lat, e.latlng.lng);
		},
	});
	return null;
}

export default function MapPicker({ onSelect, disabled }: Props) {
	const [position, setPosition] = useState<[number, number] | null>(null);

	return (
		<MapContainer
			center={[43.23, 76.89]}
			zoom={13}
			style={{ height: "100%", width: "100%" }}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

			{!disabled && <ClickHandler
				onSelect={(lat, lon) => {
					setPosition([lat, lon]);
					onSelect(lat, lon);
				}}
			/>}

			{position && <Marker position={position} />}
		</MapContainer>
	);
}
