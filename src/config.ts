import * as dotenv from "dotenv";

const a = dotenv.config();

export const CLIENT_ID = process.env.CLIENT_ID as string;
export const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
export const PROJETC_ID = process.env.PROJETC_ID as string;

export const AUTH_URI = process.env.AUTH_URI as string;
export const TOKEN_URI = process.env.TOKEN_URI as string;
export const ID_TOKEN_INFO_URI = process.env.ID_TOKEN_INFO_URI as string;
export const USER_INFO_URI = process.env.USER_INFO_URI as string;

export const REDIRECT_URL = process.env.REDIRECT_URL as string;
export const UI_SERVER_URI = process.env.UI_SERVER_URI as string;
export const API_SERVER_URI = process.env.API_SERVER_URI as string;
export const ACCESS_TOKEN_COOKE = "access_token";
export const REFRESH_TOKEN_COOKE = "refresh_token";
export const ID_TOKEN_COOKE = "id_token";

export const SERVER_SECRET = process.env.SERVER_SECRET as string;
export const SERVER_REFRESH_SECRET = process.env
  .SERVER_REFRESH_SECRET as string;
