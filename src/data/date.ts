export function today(): string {
    return dateToString(new Date());
}

export function dateToString(day: Date): string {
    const month = String(day.getUTCMonth() + 1).padStart(2, '0');
    const date  = String(day.getUTCDate()).padStart(2, '0');
    return `${day.getUTCFullYear()}-${month}-${date}`;
}

export function firstOfMonth(): string {
    let day: Date = new Date();
    day.setUTCDate(1);
    return dateToString(day);
}