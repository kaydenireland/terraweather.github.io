import L from 'leaflet';
import { createMap } from './map.ts';
import { loadPlates } from "./layers/plates.ts";
import { getEarthquakes } from "./layers/earthquakes.ts";

const map: L.Map = createMap('map')

const earthquakeLayer = L.layerGroup().addTo(map);

let plateLayer = L.layerGroup();
let showPlates: boolean = true;


if (showPlates) {
    await loadPlates(plateLayer);
    plateLayer.addTo(map);
}

getEarthquakes(earthquakeLayer, 0);