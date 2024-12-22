<<<<<<< Updated upstream
import _Request from 'express'; // eslint-disable-line no-unused-vars
=======
import _Request from 'express';
>>>>>>> Stashed changes

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
