export interface User {
    username: string;
    knownAs: string;
    gender: string;
    token: string;
	refreshToken: string;
    photoUrl?: string;
}
