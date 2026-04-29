import L from 'leaflet'
import type { Earthquake } from "../data/earthquake.ts";
import {LOCATIONS} from "../util/layer-utils.ts";

let cachedEarthquakes: Earthquake[] = [];

export async function getEarthquakes(
    layer: L.LayerGroup,
    minMagnitude: number = 3
): Promise<number> {
    try {
        if (cachedEarthquakes.length === 0) {
            const endTime = new Date().toISOString().split('T')[0];
            const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=0`;
            console.log(url);

            const result = await fetch(url);
            if (!result.ok) throw new Error(`USGS API error: ${result.status}`);

            const data = await result.json();
            cachedEarthquakes = data.features;
        }

        layer.clearLayers();
        let filtered: Earthquake[] = cachedEarthquakes.filter(f => f.properties.mag >= minMagnitude);

        LOCATIONS.forEach(offset => {
            filtered.forEach((feature: Earthquake) => {
                let [long, lat, depth] = feature.geometry.coordinates;
                long += offset;
                const magnitude = feature.properties.mag;
                const {color, radius} = getMagnitudeStyle(magnitude);

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
                            <small>${new Date(feature.properties.time).toLocaleString()}</small></br>
                            <small><a href="${feature.properties.url}">More Data</a></small>
                          `)
                    .addTo(layer)
            });
        });

        return filtered.length;

    } catch (err) {
        console.error('Failed to load earthquakes:', err);
        return 0;
    }
}

export function getMagnitudeStyle(mag: number): { color: string; radius: number } {
    if (mag >= 7) return { color: '#7c3aed', radius: 22 };
    if (mag >= 6) return { color: '#ef4444', radius: 18 };
    if (mag >= 5) return { color: '#f97316', radius: 14 };
    if (mag >= 3.5) return { color: '#fbbf24', radius: 10 };
    if (mag >= 1.5) return { color: '#0f9c0b', radius: 6 };
    return { color: '#4a4a4a', radius: 2 };
}