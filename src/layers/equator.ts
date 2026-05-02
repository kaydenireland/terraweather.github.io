import L from 'leaflet';
import { LOCATIONS } from "../util/layer-utils.ts";

export async function loadEquator(layer: L.LayerGroup): Promise<void> {

    LOCATIONS.forEach((offset) => {
        L.polyline(
            [
                [0, -180 + offset], [0, 180 + offset]
            ],
            {
                color: 'red',
                weight: 1,
                opacity: 0.75,
                dashArray: [7]
            }
        ).addTo(layer);
    });

}