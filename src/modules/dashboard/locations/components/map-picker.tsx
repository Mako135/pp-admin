"use client";

import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
	onSelect: (lat: number, lon: number) => void;
};

function ClickHandler({ onSelect }: Props) {
	useMapEvents({
		click(e) {
			onSelect(e.latlng.lat, e.latlng.lng);
		},
	});
	return null;
}

export default function MapPicker({ onSelect }: Props) {
	const [position, setPosition] = useState<[number, number] | null>(null);

	return (
		<MapContainer
			center={[43.23, 76.89]}
			zoom={13}
			style={{ height: 800, width: "100%" }}
		>
			<TileLayer
				attribution="© OpenStreetMap"
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			<ClickHandler
				onSelect={(lat, lon) => {
					setPosition([lat, lon]);
					onSelect(lat, lon);
				}}
			/>

			{position && <Marker position={position} />}
		</MapContainer>
	);
}
