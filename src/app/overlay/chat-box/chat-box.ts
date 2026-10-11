import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  styleUrl: './chat-box.scss',
  templateUrl: './chat-box.html',
})
export class ChatBox {
  readonly label = input('CHAT EN DIRECTO');
}
