import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Login } from '../../types/login.model';
import { Register } from '../../types/register.model';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	baseUrl = 'https://localhost:7035/api/account/';
	private http = inject(HttpClient);

	login(model: Login) {
		return this.http.post(this.baseUrl + 'login', {
			UsernameOrEmail: model.UsernameOrEmail,
			Password: model.Password,
		});
	}

	register(model: Register) {
		return this.http.post(this.baseUrl + 'register', {
			Email: model.Email,
			Username: model.Username,
			KnownAs: model.KnownAs,
			Gender: model.Gender,
			DateOfBirth: model.DateOfBirth,
			City: model.City,
			Country: model.Country,
			Password: model.Password,
		});
	}
}

export { Login, Register };
