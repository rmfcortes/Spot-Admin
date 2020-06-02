export interface Pedido {
    cliente: Cliente;
    createdAt: number;
    comision: number;
    id: string;
    formaPago: FormaPago;
    productos: Producto[];
    total: number;
    region: string;
    negocio: Negocio;
    last_notification: number;
    last_notificado: string;
    last_solicitud: number;
    repartidor?: Repartidor;
    pendiente_repartidor: boolean;
    entregado?: number;
}

export interface HistorialPedido {
    fecha: string
    pedidos: Pedido[];
    completados: Pedido[];
    cancelados_user: Pedido[];
    cancelados_driver: Pedido[];
    ver_detalles: boolean;
}

export interface PedidoPendiente {
    region: string;
    pedidos: Pedido[]
}

export interface Negocio {
    categoria: string;
    direccion: Direccion;
    envio: number;
    idNegocio: string;
    logo: string;
    nombreNegocio: string;
    telefono: string;
}

export interface Repartidor {
    nombre: string;
    telefono: string;
    foto: string;
    lat: number;
    lng: number;
    id: string;
    ganancia: number;
}


export interface Cliente {
    direccion: Direccion;
    nombre: string;
    telefono: string;
    uid: string;
}

export interface FormaPago {
    forma: string;
    tipo: string;
    id: string;
}

export interface Direccion {
    direccion: string;
    lat: number;
    lng: number;
}

export interface Producto {
    codigo: string;
    descripcion: string;
    id: string;
    nombre: string;
    pasillo: string;
    precio: number;
    unidad: string;
    url: string;
    variables: boolean;
    cantidad?: number;
    complementos?: ListaComplementosElegidos[];
    observaciones?: string;
    total: number;
}

export interface ListaComplementosElegidos {
    titulo: string;
    complementos: Complemento[];
}

export interface Complemento {
    nombre: string;
    precio: number;
    isChecked?: boolean;
    deshabilitado?: boolean;
}