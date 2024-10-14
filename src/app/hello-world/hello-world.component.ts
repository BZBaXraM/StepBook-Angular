import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
	selector: 'app-hello-world',
	standalone: true,
	imports: [NgIf, AsyncPipe],
	templateUrl: './hello-world.component.html',
	styleUrl: './hello-world.component.css',
})
export class HelloWorldComponent {
	accountService = inject(AccountService);
}
