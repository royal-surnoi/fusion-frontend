// import { Injectable } from '@angular/core';
// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
// import { environment } from '../environments/environment';
// import { Message } from './chat/chat.models';
 
// @Injectable({
//   providedIn: 'root'
// })
// export class WebSocketService {
//   private socket$: WebSocketSubject<any>;
 
//   constructor() {
//     this.socket$ = webSocket(environment.webSocketUrl);
//   }
 
//   public connect() {
//     return this.socket$;
//   }
 
//   public sendMessage(message: Message) {
//     this.socket$.next(message);
//   }
// }
