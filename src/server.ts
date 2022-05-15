import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import * as config from "./config";
import cors from "cors";
import cookieParser, { signedCookie } from "cookie-parser";
import { getGoogleAuthServices, accessToken } from "./auth/auth";
import { setCookies } from "./utility/setCookies";
import { Server, Socket } from "socket.io";
import { parse } from "cookie";

import {
  JWTRefreshToken,
  JWTToken,
  RefreshJWTToken,
  ValidateJWTRefreshToken,
  ValidateJWTToken,
  googleAuthServer,
} from "./DIContainer";
import { authRoute } from "./routes/auth";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const app = express();

// const server = http.createServer(app);

const PORT = 4000;

declare global {
  namespace Express {
    interface Request {
      user: string;
    }
  }
}

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
  })
);

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const authMidleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("midleware called");
  next();
};

const auth = googleAuthServer;

app.use(express.static("./dist/webpages"));

app.use("/auth", authRoute);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} `);
});

interface CustomSocket extends Socket {
  user: string;
}

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

interface tokenPayLoad {
  name: string;
  email: string;
  picture: string;
}

interface customSocket extends Socket {
  user?: {
    username: string;
    email: string;
    picture: string;
  };
}

io.use((socket: customSocket, next) => {
  const cookies = socket.request.headers.cookie;
  try {
    if (cookies) {
      const payload = ValidateJWTRefreshToken(
        parse(cookies).app_refresh_token
      ) as tokenPayLoad;
      console.log("user is authorized for the socket");
      const { name, email, picture } = payload;
      socket.user = Object.create(null);
      socket.user = {
        username: name,
        email,
        picture,
      };
      next();
    } else {
      next(new Error("Authentication data not found"));
    }
  } catch (error) {
    console.log(error);
    next(new Error("Token Expired"));
  }
});

io.on("connection", (socket: customSocket) => {
  console.log("new socket connection: " + socket.id);

  socket.on("chat message", (msg) => {
    console.log(msg);
    socket.emit("chat message", msg);
  });

  socket.on("broadcast", (msg) => {
    console.log(msg);
    const msgB = {
      sender: {
        username: socket.user?.username,
        email: socket.user?.email,
        picture: socket.user?.picture,
      },
      message: msg,
    };
    console.log(msgB);
    socket.broadcast.emit("broadcast", msgB);
  });

  socket.on("disconnect", (reson) => {
    console.log("user disconected");
  });
});
