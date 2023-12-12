import { socket } from "./index";
import { useChatStore } from "@/stores/chat";
import { MessageResponseSchema } from "@/types";

const chatStore = useChatStore();

socket.on("messageDirect", (data: any) => {
  //  A VOIR AVEC LE BACK POUR SAVOIR QUELLE DONNEE ON RECOIT
  console.warn(
    "A VOIR AVEC LE BACK POUR SAVOIR QUELLE DONNEE ON RECOIT",
    "message event: ",
    data
  );
  // const msg = {};
  data.createdAt = new Date(data.createdAt);
  chatStore.addMessageToStore(data.userId, data);
});
