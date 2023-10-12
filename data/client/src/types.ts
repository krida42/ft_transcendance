type Id = string;

type User = {
  id: Id;
  email?: string;
  login?: string;
  pseudo: string;
  displayName: string;
  avatar: string;
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
  userAvatar?: string;
  ack?: boolean;
};

type Chat = {
  id: Id;
  name: string;
  messages: Map<Id, Message>;
};

enum ChatType {
  Channel = "channel",
  Direct = "direct",
}

type Match = {
  id: Id;
  scoreMe: number;
  scoreOp: number;
  nameOp: string;
  duration: number;
  date: Date;
};
