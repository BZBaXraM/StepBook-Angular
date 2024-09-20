import { Component, input } from '@angular/core';
import { ChatComponent } from '../../chat/chat.component';
import { MessageFormComponent } from '../../message-form/message-form.component';

@Component({
	selector: 'app-member-messages',
	standalone: true,
	imports: [ChatComponent, MessageFormComponent],
	templateUrl: './member-messages.component.html',
	styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent {
	username = input.required<string>();
}
