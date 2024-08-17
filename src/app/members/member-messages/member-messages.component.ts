import { Component, inject, input, ViewChild } from '@angular/core';
import { MessageService } from '../../message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
	selector: 'app-member-messages',
	standalone: true,
	imports: [TimeagoModule, FormsModule],
	templateUrl: './member-messages.component.html',
	styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent {
	@ViewChild('messageForm') messageForm?: NgForm;
	username = input.required<string>();
	messageService = inject(MessageService);
	content = '';

	sendMessage() {
		this.messageService
			.sendMessage(this.username(), this.content)
			.then(() => {
				this.messageForm?.reset();
			});
	}
}
