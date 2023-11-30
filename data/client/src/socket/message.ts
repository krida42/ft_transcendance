import { socket } from "./index";
import { useChatStore } from "@/stores/chat";

const chatStore = useChatStore();

socket.on("message", (data: any) => {
  //  A VOIR AVEC LE BACK POUR SAVOIR QUELLE DONNEE ON RECOIT
  console.warn(
    "A VOIR AVEC LE BACK POUR SAVOIR QUELLE DONNEE ON RECOIT",
    "message event: ",
    data
  );
  chatStore.addMessageToStore(data.chatId, data.message);
});
