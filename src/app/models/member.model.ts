import {Photo} from './photo.model';

export interface Member {
	Id: number;
	Username: string;
	Age: number;
	KnownAs: string;
	Created: Date;
	LastActive: Date;
	Gender: string;
	City: string;
	Country: string;
	Photos: Photo[];
}
