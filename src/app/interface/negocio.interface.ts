import { Direccion } from './pedido.interface';

export interface NegocioPreview {
    abierto: boolean
    calificaciones: number
    foto: string
    id: string
    nombre: string
    promedio: number
    tipo: string
}

export interface NegocioPerfil {
    autorizado: boolean
    categoria: string
    contacto: string
    correo: string
    plan: string
    descripcion: string
    direccion: Direccion
    entrega: string
    formas_pago: FormaPago
    id: string
    logo: string
    nombre: string
    pass: string
    portada: string
    preparacion?: number
    productos: number
    region: string
    subCategoria: string[]
    telefono: string
    tipo: string
    whats?: string
    repartidores_propios: any
    envio?: number
    envio_gratis_pedMin?: number
    envio_costo_fijo?: boolean
    envio_desp_pedMin?: number
}

export interface NegocioSuspendido {
    ofertas: Oferta[]
    busqueda: Busqueda
    vendidos: MasVendidos[]
    functions: InfoFunction
    preview: NegocioPreview
    perfil: NegocioPerfil
}

export interface Oferta {
    categoria: string
    foto: string
    id: string
    idNegocio: string
}

export interface Busqueda {
    abierto: boolean
    categoria: string
    cuenta: string
    foto: string
    idNegocio: string
    nombre: string
    palabras: string
    tipo: string
}

export interface MasVendidos {
    categoria: string
    descripcion: string
    id: string
    idNegocio: string
    nombre: string
    nombreNegocio: string
    precio: number
    url: string
    ventas: number
}

export interface InfoFunction {
    abierto: boolean
    calificaciones: number
    categoria: string
    cuenta: string
    foto: string
    idNegocio: string
    nombre: string
    promedio: number
    subCategoria: string[]
    tipo: string
}

export interface FormaPago {
    efectivo: boolean;
    tarjeta: boolean;
    terminal: boolean;
}

export interface Categoria {
    categoria: string;
    foto: string;
    cantidad: number;
}

export interface SubCategoria {
    alias: string;
    cantidad: number;
    subCategoria: string;
}
