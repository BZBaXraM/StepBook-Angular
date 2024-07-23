import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {AccountService} from "../services/account.service";
import {ToastrService} from "ngx-toastr";

@Component({
	selector: 'app-confirm-email',
	standalone: true,
	imports: [
		RouterLinkActive,
		RouterLink
	],
	templateUrl: './confirm-email.component.html',
	styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private accountService = inject(AccountService);
	private toastrService = inject(ToastrService);
	emailConfirmed: boolean = false;
	urlParams: any = {};

	constructor() {
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.urlParams = params;
			this.confirmEmail();
		});
	}

	confirmEmail() {
		this.accountService.confirmEmail(this.urlParams.token, this.urlParams.email).subscribe({
			next: (response) => {
				this.emailConfirmed = true;
				this.toastrService.success('Email confirmed successfully');
			},
			error: (error) => {
				this.toastrService.error('Email confirmation failed');
			}
		});
	}


}
