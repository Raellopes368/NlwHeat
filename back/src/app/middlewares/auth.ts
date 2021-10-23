import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
  sub: string
}

export default function auth(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if(!authToken) {
    return res.status(401).json({
      errorCode: 'token.invalid',
    });
  }

  const [, token] = authToken.split(' ');
  if(!token) {
    return res.status(400).json({
      errorCode: 'token'
    });
  }

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;
    req.user_id = sub;

    return next();
  } catch (error) {
    return res.status(401).json({
      errorCode: error,
    });
  }

  

}