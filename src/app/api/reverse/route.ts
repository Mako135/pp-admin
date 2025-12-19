import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { lat, lon } = await req.json();

	if (typeof lat !== "number" || typeof lon !== "number") {
		return NextResponse.json(
			{ error: "lat and lon must be numbers" },
			{ status: 400 },
		);
	}

	const url = new URL("https://nominatim.openstreetmap.org/reverse");
	url.searchParams.set("lat", String(lat));
	url.searchParams.set("lon", String(lon));
	url.searchParams.set("format", "json");

	const res = await fetch(url.toString(), {
		headers: {
			// ОБЯЗАТЕЛЬНО по правилам Nominatim
			"User-Agent": "your-app-name/1.0 (email@example.com)",
			Accept: "application/json",
		},
		cache: "no-store",
	});

	if (!res.ok) {
		return NextResponse.json({ error: "nominatim error" }, { status: 502 });
	}

	const data = await res.json();

	return NextResponse.json({
		lat,
		lon,
		address: data.display_name ?? null,
		details: data.address ?? null,
	});
}
