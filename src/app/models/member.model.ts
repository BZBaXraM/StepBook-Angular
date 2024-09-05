import {Photo} from './photo.model';

export interface Member {
	Id: number;
	Username: string;
	PhotoUrl: string;
	Age: number;
	KnownAs: string;
	Created: Date;
	LastActive: Date;
	Gender: string;
	Introduction?: string;
	LookingFor?: string;
	Interests?: string;
	City?: string;
	Country?: string;
	Photos: Photo[];
}
