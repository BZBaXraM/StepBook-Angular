import {
	AfterViewChecked,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	input,
	ViewChild,
	HostListener,
} from '@angular/core';
import { MessageService } from '../services/message.service';
import Prism from 'prismjs';
import { NgFor, NgIf } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';

@Component({
	selector: 'app-chat',
	standalone: true,
	imports: [TimeagoModule, NgIf, NgFor],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.css',
})
export class ChatComponent implements AfterViewChecked {
	@ViewChild('scrollMe') scrollMe?: ElementRef<HTMLElement>;
	username = input.required<string>();
	messageService = inject(MessageService);
	messageContent = '';
	private cdr = inject(ChangeDetectorRef);
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

	ngAfterViewChecked(): void {
		if (this.shouldScrollToBottom && !this.isUserScrolling) {
			this.scrollToBottom();
		}
		this.highlightSyntax();
	}

	private scrollToBottom() {
		if (this.scrollMe) {
			const element = this.scrollMe.nativeElement;
			element.scrollTop = element.scrollHeight;
		}
	}
}
