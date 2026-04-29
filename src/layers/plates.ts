import L from 'leaflet';
import { LOCATIONS } from "../util/layer-utils.ts";

const PLATES_URL = 'https://cdn.jsdelivr.net/gh/fraxen/tectonicplates@master/GeoJSON/PB2002_boundaries.json';

export async function loadPlates(layer: L.LayerGroup): Promise<void> {
    const res = await fetch(PLATES_URL);
    const data = await res.json();

    LOCATIONS.forEach((offset) => {
        L.geoJSON(data, {
            style: {
                color: '#60a5fa',
                weight: 1.5,
                opacity: 0.65,
                dashArray: '4 3'
            },
            coordsToLatLng: (coords) => {
                return L.latLng(coords[1], coords[0] + offset);
            }
        }).addTo(layer);
    });

}