export interface GoogleAuthProps {
  service: HTTPclient;

  client_id: string;
  clinet_secret: string;
  redirect_uri: string;

  auth_uri: string;
  token_uri: string;
  id_token_info_uri: string;
  user_info_uri: string;
}

export interface AuthServer {
  CLIENT_ID: String;
  CLIENT_SECRET: String;

  REDIRECT_URL: string;

  AUTH_URI: string;
  TOKEN_URI: string;
  ID_TOKEN_INFOR_URI: string;
  USER_INFO_URI: string;

  getAuthUrl: () => string;
  getToken: (code: string) => Promise<accessToken | undefined>;
  getIdTokeInfo: (idToken: string) => Promise<IdTokenInfo | undefined>;
  refreshToken: (refreshToken: string) => Promise<BaseTokenData | undefined>;
  getUserData: (access_token: string) => Promise<object | undefined>;
}

export interface BaseTokenData {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export interface accessToken extends BaseTokenData {
  refresh_token: string;
  id_token: string;
}

export interface IdTokenInfo {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
}

export function getGoogleAuthServices(params: GoogleAuthProps) {
  return class GoogleAuth implements AuthServer {
    CLIENT_ID: string = params.client_id;
    CLIENT_SECRET: string = params.clinet_secret;

    REDIRECT_URL: string = params.redirect_uri;

    AUTH_URI: string = params.auth_uri;
    TOKEN_URI: string = params.token_uri;
    ID_TOKEN_INFOR_URI: string = params.id_token_info_uri;
    USER_INFO_URI: string = params.user_info_uri;

    HTTP: HTTPclient = params.service;

    static instence = new GoogleAuth();

    private constructor() {}

    getAuthUrl = () => {
      const options = {
        redirect_uri: `${this.REDIRECT_URL}`,
        client_id: this.CLIENT_ID,
        access_type: "offline", // need refresh-token too
        response_type: "code",
        prompt: "consent",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
      };

      const qsp = new URLSearchParams(options);

      let url = `${this.AUTH_URI}?${qsp}`;
      return url;
    };

    getToken = async (code: string) => {
      var data = {
        code: code,
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        redirect_uri: this.REDIRECT_URL,
        grant_type: "authorization_code",
      };

      const res = await this.HTTP.post<accessToken>(this.TOKEN_URI, data);

      if (res.result == "Success") {
        let data = res.data as accessToken;
        const re: accessToken = {
          access_token: data.access_token,
          expires_in: data.expires_in,
          id_token: data.id_token,
          refresh_token: data.refresh_token,
          scope: data.scope,
          token_type: data.token_type,
        };

        return re;
      }
      return undefined;
    };

    getIdTokeInfo = async (idToken: string) => {
      const response = await this.HTTP.get<IdTokenInfo>(
        `${this.ID_TOKEN_INFOR_URI}`,
        {
          query: { id_token: idToken },
        }
      );
      if (response.result == "Success") return response.data as IdTokenInfo;
      return undefined;
    };

    refreshToken = async (refreshToken: string) => {
      const data = {
        refresh_token: refreshToken,
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        grant_type: "refresh-token",
      };
      const response = await this.HTTP.post<BaseTokenData>(
        this.TOKEN_URI,
        data
      );

      if (response.result == "Success") return response.data as BaseTokenData;
      return undefined;
    };

    getUserData = async (access_token: string) => {
      const response = await this.HTTP.get<any>(this.USER_INFO_URI, {
        authentication: access_token,
      });

      if (response.result == "Success") return response.data as object;
      return undefined;
    };
  };
}
