type Id = string;

type User = {
  id: Id;
  pseudo: string;
  displayName: string;
  avatar: string;
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
