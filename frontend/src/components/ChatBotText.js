import React, { useState, useCallback } from 'react';
import './ChatBotText.css';

const ChatBotText = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const [messages, setMessages] = useState([
    { type: 'text', content: 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'text', content: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsTyping(true);

    await generateBotResponse(input);
  };

  const updateMessage = useCallback((responseText) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.sender === 'bot') {
        lastMessage.content = responseText;
      } else {
        newMessages.push({ type: 'text', content: responseText, sender: 'bot' });
      }
      return newMessages;
    });
  }, []);

  const generateBotResponse = async (message) => {
    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok && data.content) {
        setIsTyping(false);

        const cleanText = data.content;
        let responseText = '';

        for (let i = 0; i < cleanText.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          responseText += cleanText[i];
          updateMessage(responseText);
        }
      } else {
        throw new Error('Failed to get a valid response from the API');
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'text', content: 'Sorry, I encountered an error. Please try again later.', sender: 'bot' },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="container">
      <div className="chat-header">Chatbot</div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.sender === 'bot' && (
              <img
                src="https://via.placeholder.com/30/0000FF/808080?text=B"
                alt="Bot Avatar"
                className="avatar"
              />
            )}
            {msg.type === 'text' ? (
              <div className="text">{msg.content}</div>
            ) : (
              <img src={msg.content} alt="generated" className="image" />
            )}
            {msg.sender === 'user' && (
              <img
                src="https://via.placeholder.com/30/FF0000/FFFFFF?text=U"
                alt="User Avatar"
                className="avatar"
              />
            )}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Bot is typing...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input"
          placeholder="Type here..."
        />
        <button onClick={handleSendMessage} className="button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBotText;