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
    abierto: boolean
    autorizado: boolean
    categoria: string
    cuenta: string
    descripcion: string
    direccion: Direccion
    entrega: string
    id: string
    logo: string
    nombre: string
    portada: string
    productos: number
    region: string
    subCategoria: string[]
    telefono: number
    tipo: string
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
