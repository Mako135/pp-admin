export async function reverseGeocode(lat: number, lon: number) {
	const res = await fetch("/api/nominatim/reverse", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ lat, lon }),
	});

	if (!res.ok) {
		throw new Error("reverse geocoding failed");
	}

	return res.json();
}
