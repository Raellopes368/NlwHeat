import { Router } from "express";
import AuthController from "./app/controllers/AuthController";
import GetLast3MessagesController from "./app/controllers/GetLast3MessagesController";
import MessageController from "./app/controllers/MessageController";
import ProfileUserController from "./app/controllers/ProfileUserController";
import auth from "./app/middlewares/auth";

const routes = Router();


routes.post('/authenticate', AuthController.handle);

routes.post('/messages', auth, MessageController.handle);
routes.get('/messages/lasts',  GetLast3MessagesController.handle);
routes.get('/profile',auth, ProfileUserController.handle);

export default routes;