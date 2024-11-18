import React, { Component } from "react";
import ChatContainer from "./components/chat-container";
import ContactsContainer from "./components/contacts-container";
import { useAppStore } from "@/store";
import { withRouter } from "react-router-dom";
import { toast } from "sonner";
import EmptyChatContainer from "./components/empty-chat-container";

class Chat extends Component {
  constructor(props) {
    super(props);

    // Accessing the store's properties via a hook and converting it into state
    const {
      userInfo,
      selectedChatType,
      isUploading,
      fileUploadProgress,
      isDownloading,
      downloadProgress,
    } = useAppStore();

    this.state = {
      userInfo,
      selectedChatType,
      isUploading,
      fileUploadProgress,
      isDownloading,
      downloadProgress,
    };
  }

  componentDidMount() {
    const { userInfo } = this.state;
    const { navigate } = this.props;

    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }

  render() {
    const {
      isUploading,
      fileUploadProgress,
      isDownloading,
      downloadProgress,
      selectedChatType,
    } = this.state;

    return (
      <div className="flex h-[100vh] text-white overflow-hidden">
        {isUploading && (
          <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5">
            <h5 className="text-5xl animate-pulse">Uploading File</h5>
            {fileUploadProgress}%
          </div>
        )}
        {isDownloading && (
          <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5">
            <h5 className="text-5xl animate-pulse">Downloading File</h5>
            {downloadProgress}%
          </div>
        )}
        <ContactsContainer />
        {selectedChatType === undefined ? (
          <EmptyChatContainer />
        ) : (
          <ChatContainer />
        )}
      </div>
    );
  }
}

export default withRouter(Chat);
