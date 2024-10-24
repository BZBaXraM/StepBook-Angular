import {Photo} from './photo.model';

export interface Member {
	Id: number;
	id: number;
	Username: string;
	username: string;
	PhotoUrl: string;
	photoUrl: string;
	Age: number;
	age: number;
	KnownAs: string;
	knownAs: string;
	Created: Date;
	created: Date;
	LastActive: Date;
	lastActive: Date;
	Gender: string;
	gender: string;
	Introduction?: string;
	introduction?: string;
	LookingFor?: string;
	lookingFor?: string;
	Interests?: string;
	interests?: string;
	City?: string;
	city?: string;
	Country?: string;
	country?: string;
	Photos: Photo[];
	photos: Photo[];
}
