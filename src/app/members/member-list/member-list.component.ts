import {Component, inject, OnInit, signal} from '@angular/core';
import {MembersService} from '../../services/members.service';
import {Member} from '../../models/member.model';
import {ToastrService} from 'ngx-toastr';
import {MemberCardComponent} from "../member-card/member-card.component";

@Component({
	selector: 'app-member-list',
	standalone: true,
	imports: [
		MemberCardComponent
	],
	templateUrl: './member-list.component.html',
	styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
	private memberService = inject(MembersService);
	members = signal<Member[]>([]);
	private toastr = inject(ToastrService);

	ngOnInit(): void {
		this.getMembers()
	}

	getMembers() {
		this.memberService.getMembers().subscribe({
			next: (members) => (this.members.set(members)),
			error: (error) => {
				this.toastr.error(error);
			},
		});
	}
}
