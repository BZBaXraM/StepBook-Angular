import { HttpParams, HttpResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { PaginatedResult } from '../src/app/models/pagination.model';

export function setPaginatedResponse<T>(
	response: HttpResponse<T>,
	paginatedResult: ReturnType<typeof signal<PaginatedResult<T> | null>>
) {
	paginatedResult.set({
		items: response.body as T,
		pagination: JSON.parse(response.headers.get('Pagination')!),
	});
}

export function setPaginationHeaders(pageNumber: number, pageSize: number) {
	let params = new HttpParams();

	if (pageNumber && pageSize) {
		params = params.append('pageNumber', pageNumber);
		params = params.append('pageSize', pageSize);
	}

	return params;
}
