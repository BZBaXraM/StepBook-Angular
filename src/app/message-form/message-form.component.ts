import {
	Component,
	ElementRef,
	inject,
	input,
	viewChild,
	OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { BucketService } from '../services/bucket.service';
import { MessageService } from '../services/message.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: 'app-message-form',
	standalone: true,
	imports: [
		FormsModule,
		NgClass,
		PickerComponent,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		MatTooltipModule,
	],
	templateUrl: './message-form.component.html',
	styleUrl: './message-form.component.css',
})
export class MessageFormComponent implements OnInit {
	readonly messageForm = viewChild<NgForm>('messageForm');
	readonly scrollMe = viewChild<ElementRef<HTMLElement>>('scrollMe');
	messageService = inject(MessageService);
	bucketService = inject(BucketService);
	messageContent = '';
	showEmojiMenu = false;
	username = input.required<string>();
	private mediaRecorder: MediaRecorder | null = null;
	isRecording = false;
	audioChunks: Blob[] = [];

	ngOnInit() {
		// Retrieve saved message content on component initialization
		this.restoreDraftMessage();
	}

	private restoreDraftMessage() {
		// Check if there's a saved draft message for the current username
		const savedDraftKey = `draftMessage_${this.username()}`;
		const savedMessage = localStorage.getItem(savedDraftKey);
		if (savedMessage) {
			this.messageContent = savedMessage;
		}
	}

	toggleEmojiMenu() {
		return (this.showEmojiMenu = !this.showEmojiMenu);
	}

	addEmoji(event: EmojiEvent) {
		if (event && event.emoji && event.emoji.native) {
			this.messageContent = this.messageContent || '';
			this.messageContent += event.emoji.native;
			this.saveDraftMessage();
		}
	}

	// Save draft message to localStorage
	saveDraftMessage() {
		if (this.username()) {
			const savedDraftKey = `draftMessage_${this.username()}`;
			if (this.messageContent.trim()) {
				localStorage.setItem(savedDraftKey, this.messageContent);
			} else {
				localStorage.removeItem(savedDraftKey);
			}
		}
	}

	sendMessage() {
		this.messageService
			.sendMessage(this.username(), this.messageContent)
			.then(() => {
				// Remove draft message from localStorage after sending
				const savedDraftKey = `draftMessage_${this.username()}`;
				localStorage.removeItem(savedDraftKey);

				this.messageForm()?.reset();
				this.messageContent = '';
				this.scrollToBottom();
			});
	}

	// Call this method whenever the message content changes
	onMessageContentChange() {
		this.saveDraftMessage();
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
		const scrollMe = this.scrollMe();
		if (scrollMe) {
			scrollMe.nativeElement.scrollTop =
				scrollMe.nativeElement.scrollHeight;
		}
	}

	async startRecording() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			this.mediaRecorder = new MediaRecorder(stream);

			this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
				if (event.data.size > 0) {
					this.audioChunks.push(event.data);
				}
			};

			this.mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(this.audioChunks, {
					type: 'audio/webm',
				});
				const file = new File([audioBlob], 'audio-message.webm', {
					type: 'audio/webm',
				});
				await this.sendAudioMessage(file);
				this.audioChunks = [];
			};

			this.mediaRecorder.start();
			this.isRecording = true;
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	}

	stopRecording() {
		if (this.mediaRecorder && this.isRecording) {
			this.mediaRecorder.stop();
			this.isRecording = false;
			const tracks = this.mediaRecorder.stream.getTracks();
			tracks.forEach((track: MediaStreamTrack) => track.stop());
		}
	}

	async sendAudioMessage(file: File) {
		this.bucketService.addFile(file).subscribe({
			next: (fileUrl) => {
				if (typeof fileUrl === 'string') {
					this.messageService
						.sendMessage(this.username(), '', fileUrl)
						.then(() => {
							this.messageContent = '';
						});
				}
			},
			error: (error) => console.error('Error uploading audio:', error),
		});
	}
}
