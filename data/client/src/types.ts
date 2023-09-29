type Id = string;

type User = {
  id: Id;
  pseudo: string;
  displayName: string;
};

type Friend = User;

type Message = {
  msgId: Id;
  content: string;
  createdAt: Date;
  userId: Id;
  userPseudo?: string;
  userDisplayName?: string;
  direction: "in" | "out";
};

type Chat = {
  id: Id;
  name: string;
  messages: Message[];
};

type Match = {
  id: Id;
  opponent: User;
  scoreMe: number;
  scoreOp: number;
  duration: number;
  date: Date;
};
