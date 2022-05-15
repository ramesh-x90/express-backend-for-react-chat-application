import express from "express";
import {
  googleAuthServer,
  JWTToken,
  JWTRefreshToken,
  RefreshJWTToken,
} from "../DIContainer";
import { setCookies } from "../utility/setCookies";
import { accessToken } from "../auth/auth";
import * as config from "../config";

export const authRoute = express.Router();

interface token {
  app_token: string;
  app_refresh_token: string;
}

const auth = googleAuthServer;

authRoute.get("/getAuthLink", (req, res) => {
  res.redirect(301, auth.getAuthUrl());
});

authRoute.get("/google/", async (req, res) => {
  const authCode: string = req.query.code as string;

  try {
    if (!authCode) {
      res.status(400);
      throw new Error("Error in auth code ");
    }
    const data = await auth.getToken(authCode);

    const {
      access_token,
      refresh_token,
      id_token,
      expires_in,
    } = data as accessToken;

    if (
      access_token == undefined ||
      refresh_token == undefined ||
      id_token == undefined
    ) {
      throw new Error("auth google auth Error");
    }

    const accData = await auth.getUserData(access_token);

    const { name, email, picture, verified_email } = accData as any;

    if (!verified_email) {
      throw Error(`${email} is not verified by google`);
    }

    const server_auth_tokens: token = {
      app_token: JWTToken({ name, email, picture }),
      app_refresh_token: JWTRefreshToken({ name, email, picture }),
    };

    const cookies = {
      ...data,
      ...accData,
      ...server_auth_tokens,
    };

    setCookies(cookies, (key, value) => {
      res.cookie(key, value, {
        expires: new Date(Date.now() + 10 * 24 * 3600 * 1000),
        httpOnly: key.toLowerCase().includes("token"),
      });
    });

    res.redirect(301, config.UI_SERVER_URI);
  } catch (error) {
    res.send({ error: (error as Error).message });
  }
});

authRoute.get("/refreshToken", async (req, res) => {
  const refresh_token = req.cookies.app_refresh_token;
  if (refresh_token == undefined) {
    res.redirect(301, `${config.UI_SERVER_URI}Sign-In`);
    return;
  }
  try {
    setCookies({ app_token: RefreshJWTToken(refresh_token) }, (key, value) => {
      res.cookie(key, value, {
        expires: new Date(Date.now() + 10 * 24 * 3600 * 1000),
        httpOnly: key.toLowerCase().includes("token"),
      });
    });
    res.redirect(301, config.UI_SERVER_URI);
  } catch (error) {
    res.send((error as Error).message);
  }
});
