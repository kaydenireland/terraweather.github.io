import { today, yesterday } from "../data/date.ts";
import { MIN_MAG } from "../data/earthquake.ts";
import { MIN_VEI } from "../data/volcano.ts";

export interface MapSettings {
    time: {
        start: string;
        end: string;
    };
    earthquakes: {
        enabled: boolean;
        minMagnitude: number;
    };
    volcanoes: {
        enabled: boolean;
        minVEI: number;
    };
    tectonicPlates: boolean;
    terminator: boolean;
    equator: boolean;
}

export const settings: MapSettings = {
    time: {
        start: yesterday(),
        end: today(),
    },
    earthquakes: {
        enabled: false,
        minMagnitude: MIN_MAG,
    },
    volcanoes: {
        enabled: false,
        minVEI: MIN_VEI,
    },
    tectonicPlates: false,
    terminator: false,
    equator: false,
};

type ChangeCallback = (settings: MapSettings) => void;
let onSettingsChange: ChangeCallback = () => {};

export function registerSettingsCallback(cb: ChangeCallback): void {
    onSettingsChange = cb;
}

function notifyChange(): void {
    onSettingsChange({ ...settings, earthquakes: { ...settings.earthquakes }, volcanoes: { ...settings.volcanoes } });
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timer: ReturnType<typeof setTimeout>;
    return ((...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    }) as T;
}

const debouncedNotify = debounce(notifyChange, 500);

let collapsed: boolean = false;

const header: HTMLElement = document.querySelector('#settings-header')!;
const body: HTMLElement = document.querySelector('#settings-body') as HTMLElement;
const chevron: HTMLElement = document.querySelector('#settings-chevron') as HTMLElement;

header.addEventListener('click', () => {
    collapsed = !collapsed;
    body.style.display = collapsed ? 'none' : 'flex';
    chevron.style.transform = collapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
});

let earthquakeInput: HTMLInputElement = document.getElementById('eq-enabled') as HTMLInputElement;
const eqSub: HTMLElement = document.querySelector('#eq-sub-settings') as HTMLElement;
earthquakeInput.addEventListener('change', () => {
    settings.earthquakes.enabled = earthquakeInput.checked;
    eqSub.style.opacity = earthquakeInput.checked ? '1' : '0.4';
    eqSub.style.pointerEvents = earthquakeInput.checked ? 'auto' : 'none';
    notifyChange();
});

const magSlider = document.getElementById('mag-slider') as HTMLInputElement;
const magDisplay = document.getElementById('mag-display') as HTMLElement;
magSlider.addEventListener('input', () => {
    settings.earthquakes.minMagnitude = parseFloat(magSlider.value);
    magDisplay.textContent = `M ${settings.earthquakes.minMagnitude.toFixed(1)}`;
    debouncedNotify();
});

let volcanoInput: HTMLInputElement = document.getElementById('volc-enabled') as HTMLInputElement;
const volcanoSub: HTMLElement = document.querySelector('#volc-sub-settings') as HTMLElement;
volcanoInput.addEventListener('change', () => {
    settings.volcanoes.enabled = volcanoInput.checked;
    volcanoSub.style.opacity = volcanoInput.checked ? '1' : '0.4';
    volcanoSub.style.pointerEvents = volcanoInput.checked ? 'auto' : 'none';
    notifyChange();
});


const veiSlider = document.getElementById('vei-slider') as HTMLInputElement;
const veiDisplay = document.getElementById('vei-display') as HTMLElement;
veiSlider.addEventListener('input', () => {
    settings.volcanoes.minVEI = parseFloat(veiSlider.value);
    veiDisplay.textContent = `VEI ${settings.volcanoes.minVEI.toFixed(1)}`;
    debouncedNotify();
});

const platesInput = document.getElementById('plates-enabled') as HTMLInputElement;
platesInput.addEventListener('change', () => {
    settings.tectonicPlates = platesInput.checked;
    notifyChange();
});

const equatorInput = document.getElementById('equator-enabled') as HTMLInputElement;
equatorInput.addEventListener('change', () => {
    settings.equator = equatorInput.checked;
    notifyChange();
});

const terminatorInput = document.getElementById('terminator-enabled') as HTMLInputElement;
terminatorInput.addEventListener('change', () => {
    settings.terminator = terminatorInput.checked;
    notifyChange();
});

const startSelect = document.getElementById('start-date') as HTMLInputElement;
startSelect.value = yesterday();
const endSelect = document.getElementById('end-date') as HTMLInputElement;
endSelect.value = today();

const dateButton = document.getElementById('apply-dates') as HTMLButtonElement;
dateButton.addEventListener('click', () => {
    settings.time.start = startSelect.value;
    settings.time.end = endSelect.value;
    notifyChange();
});