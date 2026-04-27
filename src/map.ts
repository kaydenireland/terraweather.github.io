import L from 'leaflet';

export function createMap(containerId: string): L.Map {
    const map = L.map(containerId, {
        worldCopyJump: true,
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    return map;
}