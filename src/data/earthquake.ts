
export interface Earthquake {
    properties: {
        mag: number,
        place: string,
        time: number,
        url: string,
    };

    geometry: {
        type: string,
        coordinates: [number, number, number], // long, lat, depth
    };
}


export interface EarthquakeList {
    features: Earthquake[];
    metadata: {
        count: number,
        title: string
    }
}