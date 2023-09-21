import axios from "axios";

const host = process.env.VUE_APP_API_URL;

function fetchMsgs(
  { channelId, userId }: { channelId?: string; userId?: string },
  beforeMessageId: string
) {
  let url: string;
  if (channelId && !userId) url = `${host}/channels/${channelId}/messages`;
  else if (userId && !channelId) url = `${host}/users/${userId}/messages`;
  else throw new Error("channelId or userId must be provided and not both");

  return axios
    .get(url, { params: { beforeMessageId } })
    .then((res) => res.data);
}

function fetchChannelMsgs(channelId: string, beforeMessageId: string) {
  return fetchMsgs({ channelId: channelId }, beforeMessageId);
}

function fetchDirectMsgs(userId: string, beforeMessageId: string) {
  return fetchMsgs({ userId: userId }, beforeMessageId);
}

function postMessageToChannel(channelId: string, message: string) {
  return axios
    .post(`${host}/channels/${channelId}/messages`, { message })
    .then((res) => res.data);
}

function postMessageToUser(userId: string, message: string) {
  return axios
    .post(`${host}/users/${userId}/messages`, { message })
    .then((res) => res.data);
}
