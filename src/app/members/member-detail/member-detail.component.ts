import {Component, inject, OnInit} from '@angular/core';
import {MembersService} from "../../services/members.service";
import {ActivatedRoute} from "@angular/router";
import {Member} from "../../models/member.model";
import {TabsModule} from "ngx-bootstrap/tabs";
import {GalleryItem, GalleryModule, ImageItem} from "ng-gallery";

@Component({
	selector: 'app-member-detail',
	standalone: true,
	imports: [TabsModule, GalleryModule],
	templateUrl: './member-detail.component.html',
	styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
	private memberService = inject(MembersService);
	private route = inject(ActivatedRoute);
	member?: Member;
	images: GalleryItem[] = [];

	ngOnInit(): void {
		this.getMember();
	}

	getMember() {
		const userName = this.route.snapshot.paramMap.get('Username');
		if (!userName) return;
		this.memberService.getMember(userName).subscribe({
			next: (member) => {
				this.member = member;
				member.Photos?.map(photo => {
					this.images.push(new ImageItem({
						src: photo.Url,
						thumb: photo.Url
					}));
				});
				console.log(this.member.Username);
			},
			error: (error) => {
				console.error(error);
			}
		});
	}

}
