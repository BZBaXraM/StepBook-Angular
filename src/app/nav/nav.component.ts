import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MessageService } from '../services/message.service';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-nav',
	standalone: true,
	imports: [
		FormsModule,
		BsDropdownModule,
		MatButtonModule,
		RouterLink,
		RouterLinkActive,
		MatIcon,
	],
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
	title = 'StepBook';
	accountService = inject(AccountService);
	private router = inject(Router);
	private cdr = inject(ChangeDetectorRef);
	messageService = inject(MessageService);
	haveMessages = false;
	newMessagesCount = 0;

	ngOnInit(): void {
		this.getNewMessagesCount();
		this.cdr.detectChanges();
	}

	getNewMessagesCount(): void {
		this.messageService.getNewMessagesCount().subscribe((count) => {
			this.newMessagesCount = count;
			this.haveMessages = count > 0;
		});
	}

	logout() {
		this.accountService.logout();
		this.router.navigateByUrl('/');
	}
}
