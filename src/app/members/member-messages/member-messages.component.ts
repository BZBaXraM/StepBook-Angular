import {
	AfterViewChecked,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	input,
	ViewChild,
} from '@angular/core';
import { MessageService } from '../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';
import Prism from 'prismjs';
import { NgFor, NgIf } from '@angular/common';
import { BucketService } from '../../bucket.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
	selector: 'app-member-messages',
	standalone: true,
	imports: [TimeagoModule, FormsModule, NgIf, PickerComponent, NgFor],
	templateUrl: './member-messages.component.html',
	styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements AfterViewChecked {
	@ViewChild('messageForm') messageForm?: NgForm;
	@ViewChild('scrollMe') scrollMe?: ElementRef<HTMLElement>;
	username = input.required<string>();
	messageService = inject(MessageService);
	bucketService = inject(BucketService);
	messageContent = '';
	private cdr = inject(ChangeDetectorRef);
	showEmojiMenu = false;
	shouldScrollToBottom = true;

	highlightSyntax() {
		Prism.highlightAll();
	}

	toggleEmojiMenu() {
		return (this.showEmojiMenu = !this.showEmojiMenu);
	}

	isCodeMessage(content: string): boolean {
		const codeRegex = /[{}();<>]/;
		return codeRegex.test(content);
	}

	highlightedCode(content: string): string {
		return Prism.highlight(
			content,
			Prism.languages['javascript'],
			'javascript'
		);
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
					this.cdr.detectChanges();
				});
		});
	}

	onFileChange(event: any) {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			this.sendFile(file);
		}
	}

	isImageFile(url: string): boolean {
		const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
		const extension = url.split('.').pop()?.toLowerCase();
		return imageExtensions.includes(extension || '');
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

				this.cdr.detectChanges();
				this.getMessages();
			},
		});
	}

	ngAfterViewChecked(): void {
		this.scrollToBottom();
		// if (this.shouldScrollToBottom) {
		// 	this.scrollToBottom();
		// 	this.shouldScrollToBottom = false;
		// }
		this.highlightSyntax();
	}

	private scrollToBottom() {
		if (this.scrollMe) {
			this.scrollMe.nativeElement.scrollTop =
				this.scrollMe.nativeElement.scrollHeight;
		}
	}
}
