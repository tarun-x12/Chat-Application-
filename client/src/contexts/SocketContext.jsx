import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_HOST } from "@/lib/constants";
import { useAppStore } from "@/store";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

// Class to manage socket connection and events
class SocketManager {
  constructor(userInfo) {
    if (!userInfo) {
      this.socket = null;
      return;
    }

    this.socket = io(SOCKET_HOST, {
      withCredentials: true,
      query: { userId: userInfo.id },
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Set up event listeners
    this.socket.on("receiveMessage", this.handleReceiveMessage.bind(this));
    this.socket.on("recieve-channel-message", this.handleReceiveChannelMessage.bind(this));
    this.socket.on("new-channel-added", this.addNewChannel.bind(this));
  }

  handleReceiveMessage(message) {
    const {
      selectedChatData: currentChatData,
      selectedChatType: currentChatType,
      addMessage,
      addContactInDMContacts,
    } = useAppStore.getState();

    if (
      currentChatType !== undefined &&
      (currentChatData._id === message.sender._id ||
        currentChatData._id === message.recipient._id)
    ) {
      addMessage(message);
    }
    addContactInDMContacts(message);
  }

  handleReceiveChannelMessage(message) {
    const {
      selectedChatData,
      selectedChatType,
      addMessage,
      addChannelInChannelLists,
    } = useAppStore.getState();

    if (
      selectedChatType !== undefined &&
      selectedChatData._id === message.channelId
    ) {
      addMessage(message);
    }
    addChannelInChannelLists(message);
  }

  addNewChannel(channel) {
    const { addChannel } = useAppStore.getState();
    addChannel(channel);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// SocketProvider using the class-based manager
export const SocketProvider = ({ children }) => {
  const { userInfo } = useAppStore();
  const [socketManager, setSocketManager] = useState(null);

  useEffect(() => {
    if (userInfo) {
      const manager = new SocketManager(userInfo);
      setSocketManager(manager);

      return () => {
        manager.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socketManager?.socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
