import {
	AfterViewChecked,
	Component,
	inject,
	input,
	ViewChild,
} from '@angular/core';
import { MessageService } from '../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-member-messages',
	standalone: true,
	imports: [TimeagoModule, FormsModule, AsyncPipe],
	templateUrl: './member-messages.component.html',
	styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements AfterViewChecked {
	@ViewChild('messageForm') messageForm?: NgForm;
	@ViewChild('scrollMe') scrollMe?: any;
	username = input.required<string>();
	messageService = inject(MessageService);
	content = '';

	sendMessage() {
		this.messageService
			.sendMessage(this.username(), this.content)
			.then(() => {
				this.messageForm?.reset();
				this.scrollToBottom();
			});
	}

	ngAfterViewChecked(): void {
		this.scrollToBottom();
	}

	private scrollToBottom() {
		if (this.scrollMe) {
			this.scrollMe.nativeElement.scrollTop =
				this.scrollMe.nativeElement.scrollHeight;
		}
	}
}
