import _Request from 'express'; // eslint-disable-line no-unused-vars

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        [key: string]: any;
      };
    }
  }
}
