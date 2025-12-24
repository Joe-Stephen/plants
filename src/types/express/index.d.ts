import { User } from '../../models/User'; // Assuming User model is exported as User type as well or we verify this

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
