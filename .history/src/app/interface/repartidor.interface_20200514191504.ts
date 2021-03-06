export interface RepartidorAsociado {
    id: string;
    last_notification: number;
    last_pedido: number;
    lat: number;
    lng: number;
    pedidos_activos: number;
    distancia: number;
    token: string;
    nombre: string;
}

export interface RepartidorPreview {
    calificaciones?: number
    foto: string;
    id: string;
    nombre: string;
    promedio?: number;
    telefono: string;
}

export interface RepartidorDetalles {
    pass: string;
    user: string;
    licencia?: string;
    vehiculo: string;
    habilitado: boolean;
}

export interface RepartidorInfo {
    preview: RepartidorPreview;
    detalles: RepartidorDetalles;
}