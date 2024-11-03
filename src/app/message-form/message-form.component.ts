import { Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { BucketService } from '../services/bucket.service';
import { MessageService } from '../services/message.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-message-form',
	standalone: true,
	imports: [
		FormsModule,
		NgIf,
		PickerComponent,
		NgFor,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
	],
	templateUrl: './message-form.component.html',
	styleUrl: './message-form.component.css',
})
export class MessageFormComponent {
	@ViewChild('messageForm') messageForm?: NgForm;
	@ViewChild('scrollMe') scrollMe?: ElementRef<HTMLElement>;
	messageService = inject(MessageService);
	bucketService = inject(BucketService);
	messageContent = '';
	showEmojiMenu = false;
	username = input.required<string>();

	toggleEmojiMenu() {
		return (this.showEmojiMenu = !this.showEmojiMenu);
	}

	addEmoji(event: EmojiEvent) {
		if (event && event.emoji && event.emoji.native) {
			this.messageContent = this.messageContent || '';
			this.messageContent += event.emoji.native;
		}
	}

	sendMessage() {
		this.messageService
			.sendMessage(this.username(), this.messageContent)
			.then(() => {
				this.messageForm?.reset();
				this.scrollToBottom();
			});
	}

	sendFile(file: File) {
		this.bucketService.addFile(file).subscribe((response: string) => {
			const fileUrl = response;
			this.messageService
				.sendMessage(this.username(), '', fileUrl)
				.then(() => {
					this.scrollToBottom();
				});
		});
	}

	onFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			this.sendFile(file);
		}
	}

	getMessages() {
		this.messageService.getMessageThread(this.username());
	}

	private scrollToBottom() {
		if (this.scrollMe) {
			this.scrollMe.nativeElement.scrollTop =
				this.scrollMe.nativeElement.scrollHeight;
		}
	}
}
