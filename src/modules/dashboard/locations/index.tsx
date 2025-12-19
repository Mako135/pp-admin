"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MapPicker = dynamic(() => import("./components/map-picker"), {
	ssr: false,
});

export default function LocationPage() {
	const [address, setAddress] = useState<string | null>(null);

	async function handleSelect(lat: number, lon: number) {
		const res = await fetch(`/api/reverse?lat=${lat}&lon=${lon}`);
		const data = await res.json();
		setAddress(data.address);
	}

	return (
		<>
			<MapPicker onSelect={handleSelect} />

			{address && (
				<div style={{ marginTop: 12 }}>
					<strong>Адрес:</strong> {address}
				</div>
			)}
		</>
	);
}
