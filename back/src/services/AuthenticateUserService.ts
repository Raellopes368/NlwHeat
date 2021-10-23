import axios from 'axios';
import { sign } from 'jsonwebtoken';
import prismaClient from '../prisma';
import api from './api';

interface IAccessTokenResponse {
  access_token: string
}

interface IUserResponse {
  avatar_url: string,
  login: string,
  id: number,
  name: string,
}

class AuthenticateUserService {
  async execute(code: string) {
    const { data } = await api.post<IAccessTokenResponse>('/login/oauth/access_token', {}, {
      params: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      },
      headers: {
        Accept: 'application/json'
      }
    });
    
    const response = await axios.get<IUserResponse>('https://api.github.com/user', {
      headers: {
        authorization: `Bearer ${data.access_token}`,
      }
    });

    const { login, avatar_url, id: github_id, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id,
      }
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: { avatar_url, login, github_id , name: login }
      });
    }

    const token = sign({
      user: {
        name,
        avatar_url,
        id: user.id
      }
    }, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: '1d',
    });
    
    return {
      user, token
    };
  }
}

export default new AuthenticateUserService();