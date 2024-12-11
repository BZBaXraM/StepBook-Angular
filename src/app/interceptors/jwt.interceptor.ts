import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../services/account.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
	const accountService = inject(AccountService);
	const currentUser = accountService.currentUser();

	if (currentUser) {
		const token =
			currentUser.token || currentUser.Token || currentUser.accessToken;
		if (token) {
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`,
				},
			});
		}
	}

	return next(req);
};
