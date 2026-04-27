import L from 'leaflet'
import type { Earthquake } from "../data/earthquake.ts";

export async function getEarthquakes(
    layer: L.LayerGroup,
    minMagnitude: number = 3
): Promise<number> {
    try {
        const endTime = new Date().toISOString().split('T')[0];
        const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=${minMagnitude}`;
        console.log(url);

        const result = await fetch(url);
        if (!result.ok) throw new Error(`USGS API error: ${result.status}`);

        const data = await result.json();

        data.features.forEach((feature: Earthquake) => {
            const [long, lat, depth] = feature.geometry.coordinates;
            const magnitude = feature.properties.mag;
            const { color, radius } = getMagnitudeStyle(magnitude);

            L.circleMarker([lat, long], {
                radius,
                fillColor: color,
                color: color,
                weight: 1,
                opacity: 0.75,
                fillOpacity: 0.5,
            })
                .bindPopup(`
                            <strong>Mag ${magnitude.toFixed(1)}</strong><br/>
                            ${feature.properties.place}<br/>
                            <small>Depth: ${depth.toFixed(0)} km</small><br/>
                            <small>${new Date(feature.properties.time).toLocaleString()}</small>
                          `)
                .addTo(layer)
        });

        return data.length;
    } catch (err) {
        console.error('Failed to load earthquakes:', err);
        return 0;
    }
}

export function getMagnitudeStyle(mag: number): { color: string; radius: number } {
    if (mag >= 7) return { color: '#7c3aed', radius: 22 };
    if (mag >= 6) return { color: '#ef4444', radius: 18 };
    if (mag >= 4) return { color: '#f97316', radius: 14 };
    if (mag >= 2) return { color: '#fbbf24', radius: 10 };
    return { color: '#0f9c0b', radius: 6 };
}