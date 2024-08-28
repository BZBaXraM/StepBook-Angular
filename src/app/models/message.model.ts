export interface Message {
	id: number;
	Id: number;
	senderId: number;
	senderUsername: string;
	SenderUsername: string;
	senderPhotoUrl: string;
	recipientId: number;
	recipientUsername: string;
	RecipientUsername: string;
	recipientPhotoUrl: string;
	content: string;
	Content: string;
	dateRead?: Date;
	messageSent: Date;
	MessageSent: Date;
}
