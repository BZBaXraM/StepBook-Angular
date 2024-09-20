import {
	AfterViewChecked,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	input,
	ViewChild,
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
	shouldScrollToBottom = false;

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

	isImageFile(url: string): boolean {
		const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
		const extension = url.split('.').pop()?.toLowerCase();
		return imageExtensions.includes(extension || '');
	}

	ngAfterViewChecked(): void {
		this.scrollToBottom();
		this.highlightSyntax();
	}

	private scrollToBottom() {
		if (this.scrollMe) {
			const element = this.scrollMe.nativeElement;
			element.scrollTop = element.scrollHeight;
		}
	}
}
