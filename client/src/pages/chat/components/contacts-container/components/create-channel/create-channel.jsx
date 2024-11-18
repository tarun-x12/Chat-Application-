import React, { Component } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import MultipleSelector from "@/components/ui/multipleselect";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { CREATE_CHANNEL, GET_ALL_CONTACTS } from "@/lib/constants";
import { useSocket } from "@/contexts/SocketContext";
import { useAppStore } from "@/store";
import { Input } from "@/components/ui/input";

class CreateChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newChannelModal: false,
      allContacts: [],
      selectedContacts: [],
      channelName: "",
    };
  }

  async componentDidMount() {
    const response = await apiClient.get(GET_ALL_CONTACTS, {
      withCredentials: true,
    });
    this.setState({ allContacts: response.data.contacts });
  }

  createChannel = async () => {
    const { channelName, selectedContacts } = this.state;
    const response = await apiClient.post(
      CREATE_CHANNEL,
      {
        name: channelName,
        members: selectedContacts.map((contact) => contact.value),
      },
      { withCredentials: true }
    );
    if (response.status === 201) {
      this.setState({
        channelName: "",
        selectedContacts: [],
        newChannelModal: false,
      });
      this.props.addChannel(response.data.channel);
      this.props.socket.emit("add-channel-notify", response.data.channel);
    }
  };

  render() {
    const { newChannelModal, channelName, selectedContacts, allContacts } =
      this.state;
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaPlus
                className=" text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
                onClick={() => this.setState({ newChannelModal: true })}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3">
              Create New Channel
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog open={newChannelModal} onOpenChange={(open) => this.setState({ newChannelModal: open })}>
          <DialogDescription className="hidden">Please insert details</DialogDescription>
          <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-max flex flex-col">
            <DialogHeader>
              <DialogTitle>Create a new Channel</DialogTitle>
            </DialogHeader>
            <div>
              <Input
                placeholder="Channel Name"
                className="rounded-lg py-6 px-4 bg-[#2c2e3b] border-none"
                value={channelName}
                onChange={(e) => this.setState({ channelName: e.target.value })}
              />
            </div>
            <div>
              <MultipleSelector
                className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                defaultOptions={allContacts}
                placeholder="Search Contacts"
                value={selectedContacts}
                onChange={(selectedContacts) => this.setState({ selectedContacts })}
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    No results found.
                  </p>
                }
              />
            </div>
            <div>
              <Button
                onClick={this.createChannel}
                className=" w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              >
                Create Channel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default CreateChannel;
