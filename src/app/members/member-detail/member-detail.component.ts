import {Component, inject, OnInit} from '@angular/core';
import {MembersService} from "../../services/members.service";
import {ActivatedRoute} from "@angular/router";
import {Member} from "../../models/member.model";
import {TabsModule} from "ngx-bootstrap/tabs";

@Component({
	selector: 'app-member-detail',
	standalone: true,
	imports: [TabsModule],
	templateUrl: './member-detail.component.html',
	styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
	private memberService = inject(MembersService);
	private route = inject(ActivatedRoute);
	member?: Member;

	ngOnInit(): void {
		this.getMember();
	}

	getMember() {
		const userName = this.route.snapshot.paramMap.get('username');
		if (!userName) return;
		this.memberService.getMember(userName).subscribe({
			next: (member) => (this.member = member),
			error: (error) => {
				console.error(error);
			}
		});
	}

}
