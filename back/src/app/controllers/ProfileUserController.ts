import { Request, Response } from 'express';
import  service  from '../../services/ProfileUserService';

class MessageController {
  async handle(req: Request, res: Response) {
    try {
      const { user_id } = req;
      const data = await service.execute(user_id);
      return res.json(data);
    } catch (error) {
      return res.status(400).json({
        error: {
          message: error.message,
        }
      });
    }
    
  }
}

export default new MessageController();