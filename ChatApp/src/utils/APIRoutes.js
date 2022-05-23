export const host = 'http://localhost:5000';
// export const host = 'https://quy-node-server.herokuapp.com'; //heroku host
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const deleteMessageRoute = `${host}/api/messages/deleteMsg`;

export const setAvatarRoute = `${host}/api/auth/setavatar`;

export const createRoomRoute = `${host}/api/room/createRoom`;
export const leaveRoute = `${host}/api/room/leaveRoom`;
export const addRoomMessageRoute = `${host}/api/room/addmsg`;
export const deleteRoomMessageRoute = `${host}/api/room/deleteMsg`;

export const getAllRoomMessageRoute = `${host}/api/room/getmsg`;
export const getRoomUsersRoute = `${host}/api/room/getAllUserInRoom`;
export const getRoomHaveUserRoute = `${host}/api/room/getRoomHaveUser`;

export const uploadImageRoute = `${host}/api/image/uploadImage`;
export const uploadMultipeImageRoute = `${host}/api/image/uploadImages`;
export const getImageRoute = `${host}/api/image`;
export const getImagesInChatRoute = `${host}/api/messages/getImages`;
