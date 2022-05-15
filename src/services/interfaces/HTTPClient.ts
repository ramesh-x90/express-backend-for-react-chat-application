interface ApiResponse<T> {
  result: "Success" | "Error";
  data: T;
}
interface options {
  query?: object;
  authentication?: string;
}
interface HTTPclient {
  get: <T>(url: string, options?: options) => Promise<ApiResponse<T | string>>;
  post: <T>(
    url: string,
    data: object,
    options?: options
  ) => Promise<ApiResponse<T | string>>;
}
