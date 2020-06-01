export interface Region {
    ciudad: string;
    referencia: string;
    centro: Ubicacion;
    ubicacion: Ubicacion[];
    pedidos?: number;
}

export interface Ubicacion {
    lat: number;
    lng: number;
}