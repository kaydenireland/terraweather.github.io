import L from 'leaflet';
import { MIN_VEI, type Volcano} from "../data/volcano.ts";
import { LOCATIONS } from "../util/layer-utils.ts";
import {hideStatus, showError} from "../util/status.ts";
import {dateStringToInt, formatDateString, today, yesterday} from "../data/date.ts";

let cachedEruptions: Volcano[] = [];

export async function getVolcanoEruptions(
    layer: L.LayerGroup,
    minVEI: number = MIN_VEI,
    startDate: string = yesterday(),
    endDate: string = today(),
    showAllHistory: boolean = false
): Promise<number> {
    try {
        if (cachedEruptions.length === 0) {
            // const url = 'https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes&outputFormat=application/json';
            // const url = '/gvp-api/geoserver/GVP-VOTW/ows' +
            //     '?service=WFS&version=1.0.0&request=GetFeature' +
            //     '&typeName=GVP-VOTW:E3WebApp_Eruptions1960' +
            //     '&outputFormat=application/json';

            const GVP_BASE = '/gvp-api/geoserver/GVP-VOTW/ows' +
                '?service=WFS&version=1.0.0&request=GetFeature' +
                '&typeName=GVP-VOTW:E3WebApp_Eruptions1960' +
                '&outputFormat=application/json';

            const url = import.meta.env.DEV
                ? GVP_BASE
                : `https://corsproxy.io/?${encodeURIComponent('https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GVP-VOTW:E3WebApp_Eruptions1960&outputFormat=application/json')}`;

            const result = await fetch(url, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
            if (!result.ok) throw new Error(`GVP API error: ${result.status}`);

            const data = await result.json();
            // console.log('Total features:', data.features.length);
            // console.log('Sample feature:', data.features[0]);
            // console.log('Unique categories:', [...new Set(data.features.map((f: any) => f.properties.Eruption_Category))]);
            cachedEruptions = data.features;
        }

        layer.clearLayers();

        const rangeStart: number = dateStringToInt(startDate);
        const rangeEnd: number = dateStringToInt(endDate);

        let filtered;

        if (showAllHistory) {
            filtered = cachedEruptions.filter(f =>
                (f.properties.ExplosivityIndexMax ?? 0) >= minVEI
            );
        } else {
            filtered = cachedEruptions.filter(f => {
                const p = f.properties;
                const eruptionStart = p.StartDate ? parseInt(p.StartDate) : null;
                const eruptionEnd = p.EndDate ? parseInt(p.EndDate) : null;

                if (!eruptionStart) return false;

                // Eruption started before range ends
                const startedBeforeRangeEnd = eruptionStart <= rangeEnd;

                // Eruption is ongoing (no end date) or ended after range starts
                const stillActiveInRange = eruptionEnd === null || eruptionEnd >= rangeStart;

                return startedBeforeRangeEnd && stillActiveInRange && (p.ExplosivityIndexMax ?? 0) >= minVEI;
            });
        }

        LOCATIONS.forEach(offset => {
            filtered.forEach(feature => {
                const [lng, lat] = feature.geometry.coordinates;
                const { color, size } = getVEIStyle(feature.properties.ExplosivityIndexMax);

                const icon = L.divIcon({
                    className: '',  // clears Leaflet's default white box styling
                    html: `<div class="volcano-marker" style="
                            border-left: ${size / 1.5}px solid transparent;
                            border-right: ${size / 1.5}px solid transparent;
                            border-bottom: ${size}px solid ${color};
                        "></div>`,
                    iconAnchor: [size / 2, size],  // anchor to the tip of the triangle
                });

                let endDate;
                if (feature.properties.EndDate) endDate = formatDateString(feature.properties.EndDate);
                else endDate = ' - ';

                L.marker([lat, lng + offset], { icon }).bindPopup(`
                        <strong>${feature.properties.VolcanoName}</strong><br/>
                        <small>Start Date: ${formatDateString(feature.properties.StartDate)}</small><br/>
                        <small>End Date: ${endDate}</small><br/>
                        <small>VEI: ${feature.properties.ExplosivityIndexMax ?? 'Unknown'}</small>
                    `)
                    .addTo(layer);
            });
        });

        return filtered.length;

    } catch (err) {
        hideStatus();
        showError('Failed to load volcanoes', err instanceof Error ? err.message : 'Please try again');
        return 0;
    }
}

export function getVEIStyle(vei: number | null): { color: string; size: number } {
    const v = vei ?? 0;
    if (v >= 7) return { color: '#7c3aed', size: 30 };
    if (v >= 6) return { color: '#ef4444', size: 28 };
    if (v >= 5) return { color: '#f97316', size: 24 };
    if (v >= 4) return { color: '#fbbf24', size: 20 };
    if (v >= 2) return { color: '#84cc16', size: 15 };
    return { color: '#94a3b8', size: 10 };
}
