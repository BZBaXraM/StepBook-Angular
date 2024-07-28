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
	protected memberService = inject(MembersService);

	ngOnInit(): void {
		if (this.memberService.members().length === 0) {
			this.getMembers()
		}
	}

	getMembers() {
		this.memberService.getMembers();
	}
}
