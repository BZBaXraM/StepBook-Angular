import {Component, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {Member} from "../../models/member.model";
import {AccountService} from "../../services/account.service";
import {MembersService} from "../../services/members.service";
import {GalleryComponent} from "ng-gallery";
import {TabsModule} from "ngx-bootstrap/tabs";
import {FormsModule, NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
	selector: 'app-member-edit',
	standalone: true,
	imports: [
		GalleryComponent,
		TabsModule,
		FormsModule
	],
	templateUrl: './member-edit.component.html',
	styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
	@ViewChild('editForm') editForm?: NgForm;

	@HostListener('window:beforeunload', ['$event']) notify($event: any) {
		if (this.editForm?.dirty) {
			$event.returnValue = true;
		}
	}

	member?: Member;
	private accountService = inject(AccountService);
	private memberService = inject(MembersService);
	private toastr = inject(ToastrService);

	ngOnInit(): void {
		this.getMember();
		this.updateMember();
	}

	getMember() {
		const user = this.accountService.currentUser();
		if (!user) return;
		this.memberService.getMember(user.Username).subscribe({
			next: (member) => this.member = member
		});
	}

	updateMember() {
		this.memberService.updateMember(this.editForm?.value).subscribe({
			next: () => {
				this.toastr.success('Profile updated successfully!');
				this.editForm?.reset(this.member);
			},
			error: (error) => this.toastr.error(error)
		});
	}
}
