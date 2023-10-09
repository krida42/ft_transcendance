type Id = string;

type User = {
  id: Id;
  email?: string;
  login?: string;
  pseudo: string;
  displayName: string;
  image_link?: string;
  phone?: string | null;
  roles?: string[];
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
  scoreMe: number;
  scoreOp: number;
  nameOp: string;
  duration: number;
  date: Date;
};
