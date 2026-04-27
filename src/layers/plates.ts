import L from 'leaflet';

const PLATES_URL = 'https://cdn.jsdelivr.net/gh/fraxen/tectonicplates@master/GeoJSON/PB2002_boundaries.json';

export async function loadPlates(layer: L.LayerGroup): Promise<void> {
    const res = await fetch(PLATES_URL);
    const data = await res.json();

    L.geoJSON(data, {
        style: {
            color: '#60a5fa',
            weight: 1.5,
            opacity: 0.65,
            dashArray: '4 3',
        },
    }).addTo(layer);
}