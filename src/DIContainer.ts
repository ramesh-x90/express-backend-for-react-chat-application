import {
  buildTokenGenerator,
  refreshToken,
  verifyToken,
} from "./utility/TokeUtility";
import * as config from "./config";
import { getGoogleAuthServices } from "./auth/auth";
import { HTTPClientImpl } from "./services/impl/HTTPClientImpl";

export const JWTToken = buildTokenGenerator(config.SERVER_SECRET, 5 * 60);
export const JWTRefreshToken = buildTokenGenerator(
  config.SERVER_REFRESH_SECRET,
  12 * 60 * 60
);

export const ValidateJWTToken = verifyToken(config.SERVER_SECRET);
export const ValidateJWTRefreshToken = verifyToken(
  config.SERVER_REFRESH_SECRET
);

export const RefreshJWTToken = refreshToken(ValidateJWTRefreshToken, JWTToken);

export const googleAuthServer = getGoogleAuthServices({
  auth_uri: config.AUTH_URI,
  client_id: config.CLIENT_ID,
  clinet_secret: config.CLIENT_SECRET,
  id_token_info_uri: config.ID_TOKEN_INFO_URI,
  redirect_uri: config.REDIRECT_URL,
  token_uri: config.TOKEN_URI,
  user_info_uri: config.USER_INFO_URI,
  service: new HTTPClientImpl(),
}).instence;
