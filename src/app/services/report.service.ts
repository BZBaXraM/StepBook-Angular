import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Report } from '../models/report.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class ReportService {
	private baseUrl = environment.apiUrl;
	private http = inject(HttpClient);

	addReportToUser(username: string, model: Report) {
		return this.http.post(
			`${this.baseUrl}report/add-report-to-user/${username}`,
			model
		);
	}
}
