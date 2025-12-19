"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MapPicker = dynamic(() => import("./components/map-picker"), {
	ssr: false,
});

export default function LocationPage() {
	const [address, setAddress] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSelect(lat: number, lon: number) {
		setLoading(true);
		const res = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
		);
		const data = await res.json();

		if ("display_name" in data) {
			let finalAddress = data.display_name.split(",");
			finalAddress = finalAddress[0].includes("улица")
				? finalAddress
				: finalAddress.slice(1);

			setAddress(finalAddress.join(", "));
		}
		setLoading(false);
	}

	return (
		<>
			<section className="w-full h-[90vh]">
				<MapPicker onSelect={handleSelect} disabled={loading} />
			</section>

			{address && (
				<div style={{ marginTop: 12 }}>
					<strong>Адрес:</strong> {JSON.stringify(address)}
				</div>
			)}
		</>
	);
}
