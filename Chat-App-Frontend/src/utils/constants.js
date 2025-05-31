export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "api/auth";
export const SIGNUP = `${AUTH_ROUTES}/signup`;
export const LOGIN = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_USER_INFO = `${AUTH_ROUTES}/update-user-info`;
export const PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/profile-image`;
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`;