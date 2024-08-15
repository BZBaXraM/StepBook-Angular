export interface Message {
	Id: number;
	SenderId: number;
	SenderUsername: string;
	SenderPhotoUrl?: string;
	RecipientId: number;
	RecipientUsername: string;
	RecipientPhotoUrl?: string;
	Content: string;
	DateRead?: Date;
	MessageSent: Date;
}
