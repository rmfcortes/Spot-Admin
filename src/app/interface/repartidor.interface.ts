export interface RepartidorPreview {
    activo: boolean;
    calificaciones: number;
    foto: string;
    id: string;
    lat: number;
    lng: number;
    maneja_efectivo: boolean;
    nombre: string;
    promedio: number;
    telefono: string;
    last_notification: number;
    last_pedido: number;
    pedidos_activos: number;
    distancia: number;
    token?: string;
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