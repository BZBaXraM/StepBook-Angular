import { Component, inject, OnInit, signal } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../services/account.service';
import { UserParams } from '../../models/userParams';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
	selector: 'app-member-list',
	standalone: true,
	imports: [
		MemberCardComponent,
		PaginationModule,
		FormsModule,
		ButtonsModule,
	],
	templateUrl: './member-list.component.html',
	styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
	protected memberService = inject(MembersService);
	private accountService = inject(AccountService);
	genderList = [
		{ value: 'Male', display: 'Males' },
		{ value: 'Female', display: 'Females' },
	];

	ngOnInit(): void {
		if (!this.memberService.paginatedResult()) {
			this.getMembers();
		}
	}

	getMembers() {
		this.memberService.getMembers(this.memberService.userParams);
	}

	resetFilters() {
		this.memberService.userParams;
		this.getMembers();
	}

	pageChanged(event: any) {
		if (this.memberService.userParams.PageNumber !== event.page) {
			this.memberService.userParams.PageNumber = event.page;
			this.getMembers();
		}
	}
}
