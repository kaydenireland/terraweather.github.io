import { today, yesterday } from "../data/date.ts";

export interface MapSettings {
    time: {
        start: string;
        end: string;
    }
    earthquakes: {
        enabled: boolean;
        minMagnitude: number;
    };
    tectonicPlates: boolean;
}

export const settings: MapSettings = {
    time: {
        start: yesterday(),
        end: today(),
    },
    earthquakes: {
        enabled: false,
        minMagnitude: 2.5
    },
    tectonicPlates: false,
};

type ChangeCallback = (settings: MapSettings) => void;
let onSettingsChange: ChangeCallback = () => {};

export function registerSettingsCallback(cb: ChangeCallback): void {
    onSettingsChange = cb;
}

function notifyChange(): void {
    onSettingsChange({ ...settings, earthquakes: { ...settings.earthquakes } });
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

const platesInput = document.getElementById('plates-enabled') as HTMLInputElement;
platesInput.addEventListener('change', () => {
    settings.tectonicPlates = platesInput.checked;
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