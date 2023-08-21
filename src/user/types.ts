interface sessionUserInterface {
  id: number;
  username: string;
  email: string;
}

export interface ISession {
  user: sessionUserInterface;
}
