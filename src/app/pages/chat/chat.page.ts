import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ChatService } from 'src/app/services/chat.service';

import { MessagePreview, Mensaje, MensajeAdmin } from '../../interface/chat.interface';




@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {

  avatar = '../../../assets/img/avatar.png'

  unreadSub: Subscription
  loading_unreads = true
  unreads: MessagePreview[] = []

  mensajes: Mensaje[] = []
  user_anterior: string

  status: string
  statusSub: Subscription

  newMsg: string

  constructor(
    private menu: MenuController,
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.menu.enable(true)
    this.getUnread()
  }

  ngOnDestroy() {
    if (this.statusSub) this.statusSub.unsubscribe()
    if (this.unreadSub) this.unreadSub.unsubscribe()
    if (this.user_anterior) this.chatService.getMensajes(this.user_anterior).off('child_added')
  }

  getUnread() {
    this.unreadSub = this.chatService.getUnread().subscribe((unreads: MessagePreview[]) => {
      this.unreads = unreads
      this.loading_unreads = false
    })
  }

  verMensajes(idUser: string) {
    this.mensajes = []
    if (this.user_anterior) this.chatService.getMensajes(this.user_anterior).off('child_added')
    this.user_anterior = idUser
    const i = this.unreads.findIndex(u => u.idUser === idUser)
    let cuadro
    this.chatService.getMensajes(idUser).on('child_added', snap => {
      const mensaje: Mensaje = snap.val()
      this.mensajes.push(mensaje)
      if (this.unreads[i].cantidad > 0) this.chatService.setSeen(idUser)
      setTimeout(() => {        
        if (!cuadro) cuadro = document.getElementById('cuadro_mensajes')
        if (cuadro) cuadro.scrollTop = cuadro.scrollHeight
      }, 300)
    })
    this.listenStatus(idUser)
  }

  listenStatus(idUser) {
    if (this.statusSub) this.statusSub.unsubscribe()
    this.statusSub = this.chatService.listenStatus(idUser).subscribe((status: string) => {
      this.status = status
    })
  }

  sendMessage() {
    if (!this.newMsg) return
    const newMsg: MensajeAdmin = {
      createdAt: Date.now(),
      idCliente: this.user_anterior,
      isMe: false,
      msg: this.newMsg,
      repartidor: 'soporte'
    }
    this.chatService.sendMessage(newMsg)
    this.newMsg = ''
  }

  // Tracks
  trackUnread(index:number, el: MessagePreview): string {
    return el.idUser
  }  
  
  trackByMensaje(index:number, el: Mensaje): string {
    return el.msg
  }

}
