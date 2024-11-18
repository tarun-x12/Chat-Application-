// chat-store.js
class ChatStore {
  constructor(set, get) {
    this.set = set;
    this.get = get;
    this.selectedChatType = undefined;
    this.selectedChatData = undefined;
    this.selectedChatMessages = [];
    this.directMessagesContacts = [];
    this.channels = [];
    this.isUploading = false;
    this.fileUploadProgress = 0;
    this.isDownloading = false;
    this.downloadProgress = 0;
  }

  setIsUploading(isUploading) {
    this.set({ isUploading });
  }

  setFileUploadProgress(fileUploadProgress) {
    this.set({ fileUploadProgress });
  }

  setIsDownloading(isDownloading) {
    this.set({ isDownloading });
  }

  setDownloadProgress(downloadProgress) {
    this.set({ downloadProgress });
  }

  setSelectedChatType(selectedChatType) {
    this.set({ selectedChatType });
  }

  setSelectedChatData(selectedChatData) {
    this.set({ selectedChatData });
  }

  setChannels(channels) {
    this.set({ channels });
  }

  setSelectedChatMessages(selectedChatMessages) {
    this.set({ selectedChatMessages });
  }

  setDirectMessagesContacts(directMessagesContacts) {
    this.set({ directMessagesContacts });
  }

  closeChat() {
    this.set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    });
  }

  addMessage(message) {
    const selectedChatMessages = this.get().selectedChatMessages;
    const selectedChatType = this.get().selectedChatType;
    this.set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  }

  addChannel(channel) {
    const channels = this.get().channels;
    this.set({ channels: [channel, ...channels] });
  }

  addContactInDMContacts(message) {
    const userId = this.get().userInfo.id;
    const fromId =
      message.sender._id === userId
        ? message.recipient._id
        : message.sender._id;
    const fromData =
      message.sender._id === userId ? message.recipient : message.sender;
    const dmContacts = this.get().directMessagesContacts;
    const data = dmContacts.find((contact) => contact._id === fromId);
    const index = dmContacts.findIndex((contact) => contact._id === fromId);

    if (index !== -1 && index !== undefined) {
      dmContacts.splice(index, 1);
      dmContacts.unshift(data);
    } else {
      dmContacts.unshift(fromData);
    }

    this.set({ directMessagesContacts: dmContacts });
  }

  addChannelInChannelLists(message) {
    const channels = this.get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  }
}

export default ChatStore;
