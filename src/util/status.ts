const popup = document.getElementById('status-popup')!;
const title = document.getElementById('status-title')!;
const subtitle = document.getElementById('status-subtitle')!;

export function showStatus(message: string, detail: string = ''): void {
    title.textContent = message;
    subtitle.textContent = detail;
    popup.classList.remove('hidden');
}

export function hideStatus(): void {
    popup.classList.add('hidden');
}

const errorPopup = document.getElementById('error-popup')!;
const errorTitle = document.getElementById('error-title')!;
const errorSubtitle = document.getElementById('error-subtitle')!;

let errorTimer: ReturnType<typeof setTimeout>;

export function showError(message: string, detail: string = ''): void {
    errorTitle.textContent = message;
    errorSubtitle.textContent = detail;
    errorPopup.classList.remove('hidden');

    console.log(message + ": ", detail);

    clearTimeout(errorTimer);
    errorTimer = setTimeout(() => {
        errorPopup.classList.add('hidden');
    }, 4000);
}