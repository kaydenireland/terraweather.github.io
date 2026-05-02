export function today(): string {
    return dateToString(new Date());
}

export function dateToString(day: Date): string {
    const month = String(day.getUTCMonth() + 1).padStart(2, '0');
    const date  = String(day.getUTCDate()).padStart(2, '0');
    return `${day.getUTCFullYear()}-${month}-${date}`;
}

export function formatDateString(yyyymmdd: string): string {
    const month = parseInt(yyyymmdd.slice(4, 6));
    const day = parseInt(yyyymmdd.slice(6, 8));
    const year = yyyymmdd.slice(0, 4);
    return `${month}/${day}/${year}`;
}

export function dateStringToInt(date: string): number {
    return parseInt(date.replace(/-/g, ''));
}

export function firstOfMonth(): string {
    let day: Date = new Date();
    day.setUTCDate(1);
    return dateToString(day);
}

export function yesterday(): string {
    let day: Date = new Date();
    day.setUTCDate(day.getUTCDate() - 1);
    return dateToString(day);
}