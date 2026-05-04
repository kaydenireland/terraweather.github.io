import L from 'leaflet';

export function createMap(containerId: string): L.Map {
    const map: L.Map = L.map(containerId, {
        worldCopyJump: true,
        maxBounds: new L.LatLngBounds([-180, -180], [180, 180]),
        minZoom: 2,
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
    }).addTo(map);

    return map;
}