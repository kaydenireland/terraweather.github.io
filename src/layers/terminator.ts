import type { Terminator } from "@joergdietrich/leaflet.terminator";

let terminatorInterval: number | null = null;

export function startTerminatorAnimation(terminatorLayer: Terminator) {
    if (terminatorInterval !== null) return;

    terminatorInterval = window.setInterval(() => {
        terminatorLayer.setTime(new Date());
    }, 5 * 60 * 1000); // update every five minutes
}

export function stopTerminatorAnimation() {
    if (terminatorInterval !== null) {
        clearInterval(terminatorInterval);
        terminatorInterval = null;
    }
}