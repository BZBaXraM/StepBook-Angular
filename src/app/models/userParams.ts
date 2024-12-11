import { User } from './user.model';

export class UserParams {
	Gender: string;
	MinAge = 18;
	MaxAge = 65;
	PageNumber = 1;
	PageSize = 5;
	OrderBy = 'LastActive';


	constructor(user: User | null) {
		this.Gender = user?.Gender === 'Female' ? 'Male' : 'Male';
	}
}
