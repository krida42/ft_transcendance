import { ResponseUserDto } from "./users/dto/responseUser.dto";

export type uuidv4 = string | null;

export type ReqU = Request & {user: ResponseUserDto}

export enum ChanType {
  Direct = 'Direct',
  Public = 'Public',
  Protected = 'Protected',
  Private = 'Private',
}

export enum UserStatus {
  Direct = 'Direct',
  Owner = 'Owner',
  Admin = 'Admin',
  User = 'User',
  Muted = 'Muted',
  Banned = 'Banned',
  Invited = 'Invited',
}

export enum ErrorMsg {
  createChannel = 'cch:',
  updateChannel = 'uch:',
  deleteChannel = 'dch:',
  joinChannel = 'jch:',
  quitChannel = 'qch:',
  addAdminUser = 'aus:',
  delAdminUser = 'dus:',
  banUser = 'bus:',
  unbanUser = 'uus:',
  inviteUser = 'ius:',
  uninviteUser = 'nus:',
  muteUser = 'mus:',
  kickUser = 'kus:',
}
