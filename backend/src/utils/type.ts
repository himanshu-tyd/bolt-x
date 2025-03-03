enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_AUTHENTICATE = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  NOT_CREATED = 422,
  ALREADY_EXISTS = 409,
  NOT_VALID_DATA = 406,
  INTERNAL_SERVER_ERROR = 500,
}

export default StatusCode;

type Roles =
  | "user"
  | "assistant"
  | "developer"
  | "function"
  | "tool"
  | "system";

export type MessageType = {
  message: [
    {
      role: Roles;
      content: string;
    },
    {
      role: Roles;
      content: string;
    },
    {
      role: Roles;
      content: string;
    }
  ];
};
