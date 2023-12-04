import { z } from "zod";

export type Id = string;

export enum Status {
  Online = "online",
  Offline = "offline",
  InGame = "inGame",
}

export const StatusSchema = z.nativeEnum(Status);

export const UserResponseSchema = z.object({
  id: z.string(),
  login: z.string(),
  pseudo: z.string(),
  avatar: z.string(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

export type User = {
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

export type Friend = User;

export type Message = {
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

export type Chat = {
  id: Id;
  name: string;
  messages: Map<Id, Message>;
  chatType: ChatType;
};

export enum ChatType {
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

export enum PrivacyType {
  Private = "private",
  Public = "public",
  Protected = "protected",
}

export type NavItem = {
  iconName: string;
  category: string;
  route: string;
};
