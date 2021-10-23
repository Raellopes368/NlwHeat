import { Request, Response } from 'express';
import  service  from '../../services/AuthenticateUserService';

class AuthController {
  async handle(req: Request, res: Response) {
    const { code } = req.body;
    try {
      const result = await service.execute(code);
      return res.json(result);
    } catch (error) {
      return res.status(401).json({
        error: {
          message: error.message
        }
      });
    }
  }
}

export default new AuthController();