import {
  CreateChatResponse,
  GetPersonalMessagesResponse,
  GetRoomMessagesResponse,
} from "../../model/chats";

export const createChatResponseExample: CreateChatResponse = {
  message: "Message send successfully",
};

export const getRoomMessagesResponseExample: GetRoomMessagesResponse = {
  title: "Friends",
  description: "Get Together",
  roomAdmin: "Ali",
  roomId: 1,
  messages: [
    {
      body: "Hi!",
      senderName: "Malik",
      createdAt: new Date("12/12/2020"),
    },
  ],
};

export const getPersonalMessagesResponseExample: GetPersonalMessagesResponse[] =
  [
    {
      body: "Hi!",
      senderName: "Malik",
      createdAt: new Date("12/12/2020"),
    },
  ];
