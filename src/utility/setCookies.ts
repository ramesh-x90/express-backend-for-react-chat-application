export function setCookies(
  data: {},
  callBack: (key: string, value: string) => void
) {
  Object.keys(data).forEach((key) => {
    const value: string = (data as any)[key];
    callBack(key, value);
  });
}
