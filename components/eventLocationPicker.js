"use client";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
} from "react-leaflet";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Search, Loader2 } from "lucide-react";

import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const DEFAULT_POSITION = [
    -6.4025,
    106.7942,
];

function MapController({ position }) {
    const map = useMap();

    useEffect(() => {
        if (!position) return;

        map.flyTo(
            [
                position.latitude,
                position.longitude,
            ],
            17,
            {
                duration: 1.5,
            }
        );
    }, [position, map]);

    return null;
}

export default function EventLocationPicker({
    latitude,
    longitude,
    location,
    onChange,
}) {
    const [search, setSearch] = useState(
        location || ""
    );

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(false);

    const [position, setPosition] =
        useState(
            latitude && longitude
                ? {
                      latitude: Number(latitude),
                      longitude: Number(longitude),
                  }
                : null
        );

    const [showResults, setShowResults] =
        useState(false);

    const searchTimeout = useRef(null);

    useEffect(() => {
        setSearch(location || "");
    }, [location]);

    const searchLocation = (value) => {
        setSearch(value);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (value.trim().length < 3) {
            setResults([]);
            setShowResults(false);
            return;
        }

        searchTimeout.current = setTimeout(
            async () => {
                try {
                    setLoading(true);

                    const response =
                        await fetch(
                            `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=id&q=${encodeURIComponent(
                                value
                            )}`
                        );

                    if (!response.ok) {
                        throw new Error(
                            "Gagal mencari lokasi"
                        );
                    }

                    const data =
                        await response.json();

                    setResults(data);
                    setShowResults(true);
                } catch (error) {
                    console.error(
                        "Location search error:",
                        error
                    );

                    setResults([]);
                } finally {
                    setLoading(false);
                }
            },
            500
        );
    };

    const selectLocation = (item) => {
        const newPosition = {
            latitude: Number(item.lat),
            longitude: Number(item.lon),
        };

        setPosition(newPosition);

        setSearch(item.display_name);

        setResults([]);
        setShowResults(false);

        onChange({
            location: item.display_name,
            latitude: Number(item.lat),
            longitude: Number(item.lon),
        });
    };

    const handleMapClick = async (e) => {
        const latitude = e.latlng.lat;
        const longitude = e.latlng.lng;

        setPosition({
            latitude,
            longitude,
        });

        try {
            const response =
                await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                );

            const data =
                await response.json();

            const address =
                data.display_name || "";

            setSearch(address);

            onChange({
                location: address,
                latitude,
                longitude,
            });
        } catch (error) {
            console.error(
                "Reverse geocoding error:",
                error
            );

            onChange({
                location: search,
                latitude,
                longitude,
            });
        }
    };

    function MapClickHandler() {
        const map = useMap();

        useEffect(() => {
            map.on("click", handleMapClick);

            return () => {
                map.off(
                    "click",
                    handleMapClick
                );
            };
        });

        return null;
    }

    return (
        <div className="space-y-3">
            {/* SEARCH LOCATION */}
            <div className="relative">
                <label className="text-sm font-semibold text-[#1E1E1E]">
                    Location Name
                </label>

                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7777]" />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            searchLocation(
                                e.target.value
                            )
                        }
                        onFocus={() => {
                            if (
                                results.length > 0
                            ) {
                                setShowResults(
                                    true
                                );
                            }
                        }}
                        placeholder="Cari alamat atau nama tempat..."
                        className="w-full rounded-xl border border-[#E5D6D0] py-3 pl-10 pr-10 outline-none focus:border-[#7A1F2B]"
                    />

                    {loading && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A1F2B] animate-spin" />
                    )}
                </div>

                {/* SEARCH RESULTS */}
                {showResults &&
                    results.length > 0 && (
                        <div className="absolute z-[1000] left-0 right-0 mt-2 bg-white border border-[#E5D6D0] rounded-xl shadow-lg overflow-hidden">
                            {results.map(
                                (item, index) => (
                                    <button
                                        key={`${item.place_id}-${index}`}
                                        type="button"
                                        onClick={() =>
                                            selectLocation(
                                                item
                                            )
                                        }
                                        className="w-full text-left px-4 py-3 hover:bg-[#F8F1E7] transition border-b border-[#F0E5E0] last:border-b-0"
                                    >
                                        <p className="text-sm font-semibold text-[#1E1E1E]">
                                            {item.name ||
                                                item.display_name.split(
                                                    ","
                                                )[0]}
                                        </p>

                                        <p className="text-xs text-[#8C7777] mt-1 line-clamp-2">
                                            {
                                                item.display_name
                                            }
                                        </p>
                                    </button>
                                )
                            )}
                        </div>
                    )}

                {showResults &&
                    !loading &&
                    search.length >= 3 &&
                    results.length === 0 && (
                        <div className="absolute z-[1000] left-0 right-0 mt-2 bg-white border border-[#E5D6D0] rounded-xl shadow-lg px-4 py-3">
                            <p className="text-sm text-[#8C7777]">
                                Lokasi tidak ditemukan.
                            </p>
                        </div>
                    )}
            </div>

            {/* MAP */}
            <div>
                <label className="text-sm font-semibold text-[#1E1E1E]">
                    Event Location
                </label>

                <p className="text-xs text-[#8C7777] mt-1 mb-3">
                    Cari alamat di atas atau klik
                    langsung pada peta.
                </p>

                <div className="h-[350px] w-full overflow-hidden rounded-2xl border border-[#E5D6D0]">
                    <MapContainer
                        center={
                            position
                                ? [
                                      position.latitude,
                                      position.longitude,
                                  ]
                                : DEFAULT_POSITION
                        }
                        zoom={13}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {position && (
                            <Marker
                                position={[
                                    position.latitude,
                                    position.longitude,
                                ]}
                                icon={
                                    markerIcon
                                }
                            />
                        )}

                        <MapController
                            position={
                                position
                            }
                        />

                        <MapClickHandler />
                    </MapContainer>
                </div>
            </div>

            {/* SELECTED LOCATION */}
            {position && (
                <div className="rounded-xl bg-[#F8F1E7] px-4 py-3">
                    <p className="text-[11px] text-[#8C7777]">
                        Lokasi terpilih
                    </p>

                    <p className="text-sm font-semibold text-[#1E1E1E] mt-1">
                        {search ||
                            "Lokasi berhasil dipilih"}
                    </p>
                </div>
            )}
        </div>
    );
}