export interface Mensaje {
    msg: string;
    createdAt: number;
    status: string;
    isMe: boolean;
}

export interface MensajeCliente {
    isMe: boolean;
    createdAt: number;
    idPedido: string;
    msg: string;
    idRepartidor: string;
}
export interface MensajeAdmin {
    isMe: boolean;
    createdAt: number;
    msg: string;
    idCliente: string;
    repartidor: string;
}

export interface MessagePreview {
    foto: string;
    last_msg: string;
    nombre: string;
    idUser: string;
    idPedido: string;
    cantidad: number;
}