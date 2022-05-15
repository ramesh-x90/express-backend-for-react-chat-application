import jwt from "jsonwebtoken";

export function buildTokenGenerator(secret: string, timeOut: number) {
  return function getAtoken(data: object): string {
    const key = jwt.sign(data, secret, {
      expiresIn: timeOut,
    });
    return key;
  };
}

export function verifyToken(secret: string) {
  // can throw
  return (token: string): object => {
    const decode = jwt.verify(token, secret, {});
    let data: { [key: string]: any } = {};
    Object.entries(decode).forEach((value) => {
      const [key, val] = value;
      if (key != "iat" && key != "exp") {
        data[key] = val;
      }
    });
    return data;
  };
}

export function refreshToken(
  validateRefreshToken: (refresh_token: string) => jwt.JwtPayload | string,
  getToken: (data: object) => string
) {
  // can throw
  return (refresh_token: string) => {
    try {
      const payload = validateRefreshToken(refresh_token) as jwt.JwtPayload;

      return getToken(payload as object);
    } catch (error) {
      const e = error as Error;
      throw Error(e.message);
    }
  };
}
