import React, { useState } from 'react';

import {
  TextInput,
  View
} from 'react-native';
import { api } from '../../services/api';
import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm(){
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  async function handleSendMessage() {
    setSendingMessage(true);
    if(!message.trim()) {
      setSendingMessage(false);
      return;
    }

    await api.post('/messages', {
      message,
    });

    setMessage('');
    setSendingMessage(false);
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        keyboardAppearance="dark"
        placeholder="Qual sua expectativa para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline
        maxLength={140}
        value={message}
        onChangeText={setMessage}
        editable={!sendingMessage}
      />

      <Button 
        title="ENVIAR MENSAGEM"
        backgroundColor={COLORS.PINK}
        color={COLORS.WHITE}
        onPress={handleSendMessage}
        isLoading={sendingMessage}
      />
    </View>
  );
}