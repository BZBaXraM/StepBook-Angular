import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../services/account.service';
import { AdminService } from '../services/admin.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-tron',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
	],
	templateUrl: './tron.component.html',
	styleUrl: './tron.component.css',
})
export class TronComponent {
	private accountService = inject(AccountService);
	private adminService = inject(AdminService);
	username = signal<string>('');
	private toastr = inject(ToastrService);

	addToBlackList(username: string) {
		this.adminService.addToBlackList(username).subscribe();
	}

	removeFromBlackList(username: string) {
		this.adminService.removeFromBlackList(username).subscribe();
	}

	getBlackList() {
		this.adminService.getBlackList().subscribe();
	}

	getReports() {
		this.adminService.getReports().subscribe();
	}

	deleteUserAccount(username: string) {
		this.adminService.deleteUserAccount(username).subscribe();
	}

	getUsers() {
		this.adminService.getUsers().subscribe();
	}
}
