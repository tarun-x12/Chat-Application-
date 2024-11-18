import React, { Component } from "react";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/lib/constants";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";

class ChatHeader extends Component {
  constructor(props) {
    super(props);

    // Initialize state using store values
    const { selectedChatData, closeChat, selectedChatType } = useAppStore();
    this.state = {
      selectedChatData,
      selectedChatType,
    };

    this.closeChat = closeChat;
  }

  renderAvatar = () => {
    const { selectedChatData, selectedChatType } = this.state;

    if (selectedChatType === "contact") {
      return (
        <Avatar className="w-12 h-12 rounded-full overflow-hidden">
          {selectedChatData.image ? (
            <AvatarImage
              src={`${HOST}/${selectedChatData.image}`}
              alt="profile"
              className="object-cover w-full h-full bg-black rounded-full"
            />
          ) : (
            <div
              className={`uppercase w-12 h-12 text-lg border-[1px] ${getColor(
                selectedChatData.color
              )} flex items-center justify-center rounded-full`}
            >
              {selectedChatData.firstName
                ? selectedChatData.firstName.charAt(0)
                : selectedChatData.email.charAt(0)}
            </div>
          )}
        </Avatar>
      );
    }

    return (
      <div className="bg-[#ffffff22] py-3 px-5 flex items-center justify-center rounded-full">
        #
      </div>
    );
  };

  render() {
    const { selectedChatData, selectedChatType } = this.state;

    return (
      <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
        <div className="flex gap-5 items-center">
          <div className="flex gap-3 items-center justify-center">
            <div className="w-12 h-12 relative flex items-center justify-center">
              {this.renderAvatar()}
            </div>
            <div>
              {selectedChatType === "channel" && selectedChatData.name}
              {selectedChatType === "contact" &&
              selectedChatData.firstName &&
              selectedChatData.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : ""}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-300 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
            onClick={this.closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    );
  }
}

export default ChatHeader;
