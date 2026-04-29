import L from 'leaflet';
import { createMap } from './map.ts';
import { loadPlates } from "./layers/plates.ts";
import { getEarthquakes } from "./layers/earthquakes.ts";
import { registerSettingsCallback } from "./util/map-settings.ts";

const map: L.Map = createMap('map')

const earthquakeLayer = L.layerGroup();

let plateLayer = L.layerGroup();

getEarthquakes(earthquakeLayer, 0).then(count => {
    console.log(`${count} earthquakes loaded`);
});

registerSettingsCallback(async (settings) => {
    if (settings.earthquakes.enabled) {
        await getEarthquakes(earthquakeLayer, settings.earthquakes.minMagnitude);
        earthquakeLayer.addTo(map);
    } else {
        earthquakeLayer.remove();
    }

    if (settings.tectonicPlates) {
        await loadPlates(plateLayer);
        plateLayer.addTo(map);
    } else {
        plateLayer.remove();
    }
});