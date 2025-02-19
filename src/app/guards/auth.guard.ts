import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AccountService} from '../services/account.service';
import {ToastrService} from 'ngx-toastr';

export const authGuard: CanActivateFn = async (route, state) => {
	const accountService = inject(AccountService);
	const router = inject(Router);
	const toastr = inject(ToastrService);
	if (accountService.currentUser()) {
		return true;
	} else {
		toastr.error('You shall not pass!');
		await router.navigate(['/login']);
		return false;
	}
};
