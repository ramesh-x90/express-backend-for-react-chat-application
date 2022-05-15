import axios from "axios";
import querystring from "querystring";
import { accessToken } from "../../auth/auth";

export class HTTPClientImpl implements HTTPclient {
  get = async <T>(url: string, options?: options) => {
    console.log(url);
    const nUrl = url;

    let query = "";

    if (options) {
      if (options.query) {
        query = querystring.stringify({ ...options.query });
        query = "?" + query;
      }
    }

    try {
      const response = await axios.get(
        url + query,
        options?.authentication
          ? {
              headers: {
                Authorization: `Bearer ${options.authentication}`,
              },
            }
          : undefined
      );

      const res: ApiResponse<T> = {
        result: "Success",
        data: response.data,
      };

      return res;
    } catch (error) {
      const res: ApiResponse<string> = {
        result: "Error",
        data: (error as Error).message,
      };
      console.log("HTTP get ERROR" + error);
      return res;
    }
  };
  post = async <T>(url: string, data: object, options?: options) => {
    console.log(url);
    try {
      const response = await axios.post(
        url,
        data,
        options?.authentication
          ? {
              headers: {
                Authorization: `Bearer ${options.authentication}`,
              },
            }
          : undefined
      );
      // console.log(response.data);

      const res: ApiResponse<T> = {
        result: "Success",
        data: response.data,
      };
      return res;
    } catch (error) {
      const res: ApiResponse<string> = {
        result: "Error",
        data: (error as Error).message,
      };
      console.log("HTTP ERROR " + error);
      return res;
    }
  };
}
