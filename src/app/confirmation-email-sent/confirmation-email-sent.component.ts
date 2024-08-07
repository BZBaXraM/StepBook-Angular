import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-confirmation-email-sent',
	standalone: true,
	imports: [RouterLink],
	templateUrl: './confirmation-email-sent.component.html',
	styleUrl: './confirmation-email-sent.component.css',
})
export class ConfirmationEmailSentComponent {
	private service = inject(AccountService);
}
