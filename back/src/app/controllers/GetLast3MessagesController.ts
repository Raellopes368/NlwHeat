import { Request, Response } from 'express';
import  service  from '../../services/GetLast3MessagesService';

class MessageController {
  async handle(req: Request, res: Response) {
    try {
      const data = await service.execute();
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