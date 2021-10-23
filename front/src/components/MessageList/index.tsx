import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';


type Messages = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}
const socket = io('http://localhost:3131');

const messagesQueue: Messages[] = [];

socket.on('new_message', (newMessage: Messages) => {
  messagesQueue.push(newMessage);
});



export function MessageList(){
  const [messages, setMessages] = useState<Messages[]>([]);
  useEffect(() => {
    api.get<Messages[]>('/messages/lasts').then((response) => {
      setMessages(response.data);
    });
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      if(messagesQueue.length) {
        setMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1]
        ].filter(Boolean));

        messagesQueue.shift();
      }
    }, 3000);

    return () => {
      clearInterval(timer);
    }
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />
      <ul className={styles.messageList}>
        {messages.map(message => (
          <li className={styles.message} key={message.id}>
          <p className={styles.messageContent}>{message.text}</p>
          <div className={styles.messageUser}>
            <div className={styles.userImage}>
              <img src={message.user.avatar_url} alt={message.user.name} />
            </div> 
            <span>{message.user.name}</span>
          </div>
        </li>
        ))}
      </ul>
    </div>
  );
}