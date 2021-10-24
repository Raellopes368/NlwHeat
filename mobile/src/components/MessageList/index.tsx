import React, { useEffect, useState } from 'react';
import {
  ScrollView
} from 'react-native';
import io from 'socket.io-client';

import { styles } from './styles';
import { Message } from '../Message';
import { MessageProps } from '../Message/index';
import { api } from '../../services/api';
import { MESSAGES_EXAMPLE } from '../../utils/messages';

const  socket = io(String(api.defaults.baseURL));


const MessagesQueue: MessageProps[]  = MESSAGES_EXAMPLE;

socket.on('new_message', newMessage => {
  MessagesQueue.push(newMessage);
});

export function MessageList(){
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    const time = setInterval(() => {
      if(MessagesQueue.length) {
        setMessages(prevMessage => [
          MessagesQueue[0],
          prevMessage[0],
          prevMessage[1],
        ].filter(Boolean));
        MessagesQueue.shift();
      }
    }, 3000);

    return () => clearInterval(time);
  });

  useEffect(() => {
    async function getMessagesData() {
      const { data } = await api.get<MessageProps[]>('/messages/lasts');
      setMessages(data);
    }

    getMessagesData();
  }, []);
  return (
    <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="never"
      >
      {messages.map(message => (
        <Message data={message} key={message.id}/>
      ))}
    </ScrollView>
  );
}