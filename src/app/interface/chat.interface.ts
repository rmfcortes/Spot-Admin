export interface Mensaje {
    createdAt: number
    isMe: boolean
    msg: string
    status: string
}

export interface MensajeCliente {
    createdAt: number
    isMe: boolean
    msg: string
}
export interface MensajeAdmin {
    createdAt: number
    isMe: boolean
    msg: string
    idCliente: string
    repartidor: string
}

export interface MessagePreview {
    foto: string;
    last_msg: string;
    nombre: string;
    idUser: string;
    idPedido: string;
    cantidad: number;
}