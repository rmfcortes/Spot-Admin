import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { MensajeCliente, MensajeAdmin } from '../interface/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getUnread() {
    return this.db.list(`chat/soporte/unread`).valueChanges()
  }

  getMensajes(idUser: string) {
    return this.db.object(`chat/soporte/todos/${idUser}`).query.ref
  }

  listenStatus(idUser: string) {
    return this.db.object(`chat/soporte/status/${idUser}`).valueChanges()
  }

  setSeen(idUser: string) {
    this.db.object(`chat/soporte/unread/${idUser}/cantidad`).set(0)
  }

  sendMessage(mensaje: MensajeAdmin) {
    this.db.list(`chat/soporte/todos/${mensaje.idCliente}`).push(mensaje)
  }



}
