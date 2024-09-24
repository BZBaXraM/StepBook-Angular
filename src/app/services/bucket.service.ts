import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class BucketService {
	baseUrl = environment.apiUrl;
	private http = inject(HttpClient);

	addFile(file: File) {
		const formData = new FormData();
		formData.append('file', file);

		return this.http.post(this.baseUrl + 'buckets/upload-file', formData, {
			responseType: 'text',
		});
	}

	getFiles() {
		return this.http.get(this.baseUrl + 'buckets/get-files');
	}
}
