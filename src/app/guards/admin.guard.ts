import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
	const accountService = inject(AccountService);
	const toastr = inject(ToastrService);

	if (accountService.roles().includes('Admin')) {
		return true;
	} else {
		toastr.error('You shall not pass!');
		console.log('You shall not pass!', accountService.roles());

		return false;
	}
};
