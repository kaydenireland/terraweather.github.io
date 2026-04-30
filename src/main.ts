import L from 'leaflet';
import { createMap } from './map.ts';
import { loadPlates } from "./layers/plates.ts";
import { getEarthquakes } from "./layers/earthquakes.ts";
import { registerSettingsCallback } from "./util/map-settings.ts";
import {hideStatus, showStatus} from "./util/status.ts";

const map: L.Map = createMap('map')

const earthquakeLayer = L.layerGroup();

let plateLayer = L.layerGroup();

showStatus('Loading earthquakes', 'Fetching from USGS...');
const count = await getEarthquakes(earthquakeLayer, 0);
hideStatus();
console.log(`${count} earthquakes loaded`);

registerSettingsCallback(async (settings) => {
    if (settings.earthquakes.enabled) {
        showStatus('Loading earthquakes', 'Fetching from USGS...');
        const count = await getEarthquakes(earthquakeLayer, settings.earthquakes.minMagnitude, settings.time.start, settings.time.end);
        hideStatus();
        console.log(`${count} earthquakes loaded`);

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