import { Request, Response } from 'express';
import  service  from '../../services/CreateMessageService';

class MessageController {
  async handle(req: Request, res: Response) {
    const { message } = req.body;
    try {
      const data = await service.execute(message, req.user_id);
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