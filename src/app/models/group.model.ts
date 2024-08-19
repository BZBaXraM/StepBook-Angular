export interface Group {
	Name: string;
	Connections: Connection[];
}

export interface Connection {
	ConnectionId: string;
	Username: string;
}
