type Id = string;

enum Status {
  Online = "online",
  Offline = "offline",
  InGame = "inGame",
}

type User = {
  id: Id;
  email?: string;
  login?: string;
  pseudo: string;
  // displayName: string;
  avatar: string;
  phone?: string | null;
  roles?: string[];
  status?: string;
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
  vueTrackId?: Id;
  solo?: boolean;
};

type Chat = {
  id: Id;
  name: string;
  messages: Map<Id, Message>;
  chatType: ChatType;
};

enum ChatType {
  Channel = "channel",
  Direct = "direct",
}

export type Match = {
  id: Id;
  scoreMe: number;
  scoreOp: number;
  nameOp: string;
  duration: number;
  date: Date;
};

export type Channel = {
  id: Id;
  name: string;
  owner: User;
  admins: User[];
  members: User[];
  privacy: PrivacyType;
  logo: FormData;
  is_owner: boolean;
};

enum PrivacyType {
  Private = "private",
  Public = "public",
  Protected = "protected",
}

export type NavItem = {
  iconName: string;
  category: string;
  route: string;
};
