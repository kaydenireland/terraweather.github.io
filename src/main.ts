import L from 'leaflet';
import { createMap } from './map.ts';
import { loadPlates } from "./layers/plates.ts";
import { getEarthquakes } from "./layers/earthquakes.ts";
import { registerSettingsCallback } from "./util/map-settings.ts";
import { hideStatus, showStatus } from "./util/status.ts";
import terminator, { type Terminator } from '@joergdietrich/leaflet.terminator';
import { startTerminatorAnimation, stopTerminatorAnimation } from "./layers/terminator.ts";
import { loadEquator } from "./layers/equator.ts";
import { getVolcanoEruptions } from "./layers/volcanoes.ts";

const map: L.Map = createMap('map')

const earthquakeLayer: L.LayerGroup = L.layerGroup();
const volcanoLayer: L.LayerGroup = L.layerGroup()
const plateLayer: L.LayerGroup = L.layerGroup();
const equatorLayer: L.LayerGroup = L.layerGroup();
const terminatorLayer: Terminator = terminator();

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

    if (settings.volcanoes.enabled) {
        showStatus('Loading volcanoes', 'Fetching from GVP...');
        const count = await getVolcanoEruptions(volcanoLayer, settings.volcanoes.minVEI, settings.time.start, settings.time.end);
        hideStatus();
        console.log(`${count} volcanic eruptions loaded`);

        volcanoLayer.addTo(map);
    } else {
        volcanoLayer.remove();
    }

    if (settings.tectonicPlates) {
        await loadPlates(plateLayer);
        plateLayer.addTo(map);
    } else {
        plateLayer.remove();
    }

    if (settings.equator) {
        await loadEquator(equatorLayer);
        equatorLayer.addTo(map);
    } else {
        equatorLayer.remove();
    }

    if (settings.terminator) {
        terminatorLayer.addTo(map);
        startTerminatorAnimation(terminatorLayer);
    } else {
        map.removeLayer(terminatorLayer);
        stopTerminatorAnimation();
    }
});