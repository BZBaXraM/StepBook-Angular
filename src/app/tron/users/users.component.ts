import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
	selector: 'app-users',
	standalone: true,
	imports: [MatTableModule, MatCardModule, MatPaginatorModule],
	templateUrl: './users.component.html',
	styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
	adminService = inject(AdminService);

	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		this.adminService.getUsers();
	}
}
