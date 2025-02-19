import {Component, inject, input, OnInit, output} from '@angular/core';
import {Member} from "../../models/member.model";
import {DecimalPipe, NgClass, NgFor, NgIf, NgStyle} from "@angular/common";
import {FileUploader, FileUploadModule} from "ng2-file-upload";
import {AccountService} from "../../services/account.service";
import {environment} from "../../../environments/environment";
import {MembersService} from "../../services/members.service";
import {Photo} from "../../models/photo.model";

@Component({
	selector: 'app-photo-editor',
	standalone: true,
	imports: [NgIf, NgFor, NgStyle, NgClass, FileUploadModule, DecimalPipe],
	templateUrl: './photo-editor.component.html',
	styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
	SIZE = 10 * 1024 * 1024
	private accountService = inject(AccountService);
	private memberService = inject(MembersService);
	member = input.required<Member>();
	uploader?: FileUploader;
	hasBaseDropZoneOver = false;
	baseUrl = environment.apiUrl;
	memberChange = output<Member>();

	ngOnInit(): void {
		this.initializeUploader();
	}

	fileOverBase(e: any) {
		this.hasBaseDropZoneOver = e;
	}

	setMainPhoto(photo: Photo) {
		this.memberService.setMainPhoto(photo).subscribe({
			next: _ => {
				const user = this.accountService.currentUser();
				if (user) {
					user.PhotoUrl = photo.Url;
					this.accountService.setCurrentUser(user);
				}
				const updatedMember = {...this.member()};
				updatedMember.PhotoUrl = photo.Url;
				updatedMember.Photos.forEach(p => {
					if (p.IsMain) p.IsMain = false;
					if (p.Id === photo.Id) p.IsMain = true;
				});
				this.memberChange.emit(updatedMember);
			}
		});
	}

	deletePhoto(photo: Photo) {
		this.memberService.deletePhoto(photo).subscribe({
			next: _ => {
				const updatedMember = {...this.member()};
				updatedMember.Photos = updatedMember.Photos.filter(p => p.Id !== photo.Id);
				this.memberChange.emit(updatedMember);
			}
		});
	}

	initializeUploader() {
		this.uploader = new FileUploader({
			url: this.baseUrl + 'Users/add-photo',
			authToken: 'Bearer ' + this.accountService.currentUser()?.Token,
			isHTML5: true,
			allowedFileType: ['image'],
			removeAfterUpload: true,
			autoUpload: false,
			maxFileSize: this.SIZE,
		});

		this.uploader.onAfterAddingFile = (file) => {
			file.withCredentials = false;
		};

		this.uploader.onSuccessItem = (item, response, status, headers) => {
			const photo = JSON.parse(response);
			const updatedMember = {...this.member()};
			updatedMember.Photos.push(photo);
			this.memberChange.emit(updatedMember);

		};
	}
}
