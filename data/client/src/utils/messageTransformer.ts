export class MessageTransformer {
  static toArray(messages: Map<Id, Message>): Message[] {
    return Array.from(messages.values());
  }

  static substituteUsersInfo(
    messages: Message[],
    users: Map<Id, User>
  ): Message[] {
    return messages.map((message) => {
      const user = users.get(message.userId);
      return {
        ...message,
        userPseudo: user?.pseudo,
        userAvatar: user?.avatar,
      };
    });
  }

  static sortByDate(messages: Message[]): Message[] {
    return [...messages].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  static beautify(messages: Message[]) {
    const beautyfiedArr = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const nextMsg = messages[i + 1];

      if (nextMsg && msg.userId === nextMsg.userId) {
        beautyfiedArr.push({
          ...msg,
          // userAvatar: undefined,
          // userPseudo: undefined,
          // createdAt: undefined,
          solo: true,
        });
      } else {
        beautyfiedArr.push({
          ...msg,
        });
      }
    }
    return beautyfiedArr;
  }

  static treatMessages(
    messages: Map<Id, Message> | undefined,
    users: Map<Id, User>
  ) {
    if (!messages) return [];
    const messagesArray = this.toArray(messages);
    const substitutedMessages = this.substituteUsersInfo(messagesArray, users);
    const sortedMessages = this.sortByDate(substitutedMessages);
    const beautyfiedMessages = this.beautify(sortedMessages);
    return beautyfiedMessages;
  }
}
