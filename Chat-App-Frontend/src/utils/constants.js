export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = `${HOST}/api/auth`;
export const SIGNUP = `${AUTH_ROUTES}/signup`;
export const LOGIN = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_USER_INFO = `${AUTH_ROUTES}/update-user-info`;
export const PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/profile-image`;
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT = `${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTES = 'api/contacts';
export const SEARCH_CONTACTS_ROUTE = `${CONTACT_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES= `${CONTACT_ROUTES}/get-contacts-for-dm-list`;
export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;