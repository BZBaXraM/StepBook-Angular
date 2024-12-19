import {
	AfterViewChecked,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	input,
	HostListener,
	viewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MessageService } from '../services/message.service';
import Prism from 'prismjs';
import { CommonModule, NgIf } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
	selector: 'app-chat',
	standalone: true,
	imports: [
		TimeagoModule,
		NgIf,
		MatCardModule,
		MatListModule,
		MatIconModule,
		CommonModule,
		FormsModule,
		MatFormFieldModule,
	],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.css',
})
export class ChatComponent implements AfterViewChecked {
	private scrollMe = viewChild<ElementRef<HTMLElement>>('scrollMe');
	username = input.required<string>();
	messageService = inject(MessageService);
	messageContent = '';
	private cdr = inject(ChangeDetectorRef);
	private sanitizer = inject(DomSanitizer);
	shouldScrollToBottom = true;
	private isUserScrolling = false;

	@HostListener('scroll', ['$event'])
	onScroll(event: Event) {
		const element = event.target as HTMLElement;
		const atBottom =
			element.scrollHeight - element.scrollTop === element.clientHeight;
		this.isUserScrolling = !atBottom;
		if (atBottom) {
			this.shouldScrollToBottom = true;
		}
	}

	formatMessageContent(content: string, senderUsername: string): SafeHtml {
		if (!content) return '';

		const urlRegex = /(https?:\/\/[^\s]+)/g;
		const formattedContent = content.replace(
			urlRegex,
			(url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${
				senderUsername !== this.username()
					? 'text-white underline hover:text-gray-100'
					: 'text-blue-600 underline hover:text-blue-800'
			}">${url}</a>`
		);

		return this.sanitizer.bypassSecurityTrustHtml(formattedContent);
	}

	highlightSyntax() {
		Prism.highlightAll();
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

	deleteMessage(id: number) {
		this.messageService.deleteMessage(id).subscribe(() => {
			this.messageService.removeMessage(id);
			this.cdr.detectChanges();
		});
	}

	isImageFile(url: string): boolean {
		const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
		const extension = url.split('.').pop()?.toLowerCase();
		return imageExtensions.includes(extension || '');
	}

	isAudioFile(url: string): boolean {
		const audioExtensions = ['webm', 'mp3', 'ogg', 'wav'];
		const extension = url.split('.').pop()?.toLowerCase();
		return audioExtensions.includes(extension || '');
	}

	isVideoFile(url: string): boolean {
		const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv'];
		return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
	}

	ngAfterViewChecked(): void {
		if (this.shouldScrollToBottom && !this.isUserScrolling) {
			this.scrollToBottom();
		}
		this.highlightSyntax();
	}

	private scrollToBottom() {
		const scrollMe = this.scrollMe();
		if (scrollMe) {
			const element = scrollMe.nativeElement;
			element.scrollTop = element.scrollHeight;
		}
	}
}
