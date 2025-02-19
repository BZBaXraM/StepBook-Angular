import {
	ChangeDetectorRef,
	Component,
	inject,
	OnDestroy,
	OnInit,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MessageService } from '../services/message.service';
import { MatIcon } from '@angular/material/icon';
import { PresenceService } from '../services/presence.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { Token } from '../models/token.model';

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
		NgIf,
	],
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
	title = 'StepBook';
	accountService = inject(AccountService);
	private router = inject(Router);
	private cdr = inject(ChangeDetectorRef);
	messageService = inject(MessageService);
	haveMessages = false;
	newMessagesCount = 0;
	notificationMessage: string = '';
	private eventSubscription!: Subscription;
	presenceService = inject(PresenceService);
	isDropdownOpen = false;

	ngOnInit() {
		this.eventSubscription =
			this.presenceService.eventObservable$.subscribe(() => {
				this.getNewMessagesCount();
			});
		this.getNewMessagesCount();
		this.cdr.detectChanges();
	}

	ngOnDestroy() {
		if (this.eventSubscription) {
			this.eventSubscription.unsubscribe();
		}
	}

	getNewMessagesCount() {
		if (this.accountService.currentUser()) {
			this.messageService.getNewMessagesCount().subscribe((count) => {
				this.newMessagesCount = count;
				this.haveMessages = count > 0;
			});
		}
	}

	async logout() {
		this.messageService.stopHubConnection();
		this.accountService.logout();
		await this.router.navigateByUrl('/');
	}

	toggleDropdown() {
		this.isDropdownOpen = !this.isDropdownOpen;
	}
}
