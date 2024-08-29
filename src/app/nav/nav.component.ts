import {
	AfterViewChecked,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
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

	// constructor(private eventService: PresenceService) {} // B

	// sendNotification() {
	// 	this.eventService.triggerEvent({ message: 'Hello from Component A!' });
	// }

	// ngOnInit(): void {
	// 	this.getNewMessagesCount();
	// 	this.cdr.detectChanges();
	// }

	notificationMessage: string = '';
	private eventSubscription!: Subscription;

	constructor(private eventService: PresenceService) {}

	ngOnInit() {
		this.eventSubscription = this.eventService.eventObservable$.subscribe(
			(data) => {
				console.log(data.message);

				this.getNewMessagesCount();
			}
		);
	}

	ngOnDestroy() {
		if (this.eventSubscription) {
			this.eventSubscription.unsubscribe();
		}
	}

	getNewMessagesCount(): void {
		this.messageService.getNewMessagesCount().subscribe((count) => {
			this.newMessagesCount = count;
			this.haveMessages = count > 0;
		});
	}

	async logout() {
		this.accountService.logout();
		await this.router.navigateByUrl('/');
	}
}
