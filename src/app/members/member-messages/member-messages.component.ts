import {
	AfterViewChecked,
	ChangeDetectorRef,
	Component,
	inject,
	input,
	ViewChild,
} from '@angular/core';
import { MessageService } from '../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
	selector: 'app-member-messages',
	standalone: true,
	imports: [TimeagoModule, FormsModule],
	templateUrl: './member-messages.component.html',
	styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements AfterViewChecked {
	@ViewChild('messageForm') messageForm?: NgForm;
	@ViewChild('scrollMe') scrollMe?: any;
	username = input.required<string>();
	messageService = inject(MessageService);
	messageContent = '';
	private cdr = inject(ChangeDetectorRef);

	sendMessage() {
		this.messageService
			.sendMessage(this.username(), this.messageContent)
			.then(() => {
				this.messageForm?.reset();
				this.scrollToBottom();
			});
	}

	getMessages() {
		this.messageService.getMessageThread(this.username());
	}

	deleteMessage(id: number) {
		this.messageService.deleteMessage(id).subscribe({
			next: () => {
				this.messageService.paginatedResult.update((prev) => {
					if (prev && prev.items) {
						prev.items.splice(
							prev.items.findIndex((m) => m.id === id),
							1
						);
						return prev;
					}
					return prev;
				});

				this.updateComponentState();
				this.getMessages();
			},
		});
	}

	// Метод для обновления состояния компонента
	updateComponentState() {
		// Логика обновления состояния компонента
		this.cdr.detectChanges();
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
