export const MIN_VEI: number = 2;
export interface Volcano {
    properties : {
        VolcanoName: string;
        VolcanoNumber: number;
        ExplosivityIndexMax: number | null;
        StartDate: string;
        StartDateYear: number;
        EndDate: string | null;
        EndDateYear: number | null;
        Elevation: number,
    },

    geometry: {
        coordinates: [number, number], // [long, lat]
    }
}