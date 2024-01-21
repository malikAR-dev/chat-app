import {
  LoginUserResponse,
  PostUserResponse,
  JoinRoomResponse,
  GetJoinedRoomsResponse,
  LeaveRoomResponse,
} from "../../model/users";

export const postUserResponseExample: PostUserResponse = {
  message: "User Registered Successfully",
};

export const loginUserResponseExample: LoginUserResponse = {
  message: "User LoggedIn Successfully",
  accessToken: "efen2uh78yggbshgw87t88g",
};

export const joinRoomResponseExample: JoinRoomResponse = {
  message: "Room joined Successfully",
  messages: [
    {
      body: "Hi",
      createdAt: new Date("12/12/2020"),
      sender: {
        name: "Ali",
        id: 1,
      },
    },
  ],
};

export const getJoinedRoomsResponseExample: GetJoinedRoomsResponse[] = [
  {
    title: "Friends",
    description: "Get Together",
    adminName: "Ali",
    roomId: 1,
  },
];

export const leaveRoomResponseExample: LeaveRoomResponse = {
  message: "Room leaved Successfully",
};
