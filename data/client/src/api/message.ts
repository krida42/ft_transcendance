import axios from "axios";

const host = process.env.VUE_APP_API_URL;

console.log("host: ", host);

async function fetchMsgs(
  { channelId, userId }: { channelId?: string; userId?: string },
  beforeMessageId: string | null
) {
  let url: string;
  if (channelId && !userId) url = `${host}/channels/${channelId}/messages`;
  else if (userId && !channelId) url = `${host}/users/${userId}/messages`;
  else throw new Error("channelId or userId must be provided and not both");

  return axios
    .get(url, { params: { beforeMessageId } })
    .then((res) => res.data);
}

export default {
  async fetchChannelMsgs(channelId: string, beforeMessageId: string | null) {
    return fetchMsgs({ channelId: channelId }, beforeMessageId);
  },

  async fetchDirectMsgs(userId: string, beforeMessageId: string | null) {
    return fetchMsgs({ userId: userId }, beforeMessageId);
  },

  async postMessageToChannel(channelId: string, message: string) {
    const res = await axios.post(`${host}/channels/${channelId}/messages`, {
      message,
    });
    return res.data;
  },

  async postMessageToUser(userId: string, message: string) {
    const res = await axios.post(`${host}/users/${userId}/messages`, {
      message,
    });
    return res.data;
  },
};
