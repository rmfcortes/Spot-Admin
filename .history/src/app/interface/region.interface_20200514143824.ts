export interface Region {
    ciudad: string;
    referencia: string;
    centro: Ubicacion;
    ubicacion: Ubicacion[];
}

export interface Ubicacion {
    lat: number;
    lng: number;
}