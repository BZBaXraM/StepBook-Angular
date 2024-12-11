import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
	const accountService = inject(AccountService);

	if (accountService.roles().includes('Admin')) {
		return true;
	} else {
		window.location.href = state.url =
			'https://youtu.be/6Ep4yYWS5D4?si=0RBnDc_Ve_JVSDnz';
		return false;
	}
};
