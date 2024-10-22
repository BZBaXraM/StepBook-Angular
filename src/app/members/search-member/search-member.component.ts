import { Component, inject, signal } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { Member } from '../../models/member.model';
import { MemberCardComponent } from '../member-card/member-card.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
	selector: 'app-search-member',
	standalone: true,
	imports: [MemberCardComponent, FormsModule, NgFor],
	templateUrl: './search-member.component.html',
	styleUrl: './search-member.component.css',
})
export class SearchMemberComponent {
	private memberService = inject(MembersService);
	userName = signal<string>('');
	public members = signal<Member[]>([]);
	private router = inject(Router);

	search() {
		this.memberService.getMember(this.userName()).subscribe((member) => {
			this.members.set([member]);
		});
	}

	reset() {
		this.userName.set('');
		this.members.set([]);
	}

	getMember(username: string) {
		this.router.navigate(['/members', username]);
	}
}
