import React, { useState } from 'react';
import './ImageBot.css';

const ImageGenerator = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;


  const [messages, setMessages] = useState([
    { type: 'text', content: 'Hello! I can generate AI-based images with high resolution. Just describe the image you want!', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'text', content: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      const response = await fetch(`${BASE_URL}/api/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (response.ok && data.imageUrl) {
        const botMessage = {
          type: 'image',
          content: data.imageUrl,
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'text', content: 'Sorry, I encountered an error generating the image. Please try again.', sender: 'bot' },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGenerateImage();
    }
  };

  return (
    <div className="container">
      <div className="chat-header">Image Generator</div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message1 ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
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
              <img src={msg.content} alt="generated" className="generated-image" />
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
        {isGenerating && <div className="generating-indicator">Generating image...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input"
          placeholder="Describe the image you want..."
        />
        <button onClick={handleGenerateImage} className="button">
          Generate
        </button>
      </div>
    </div>
  );
};

export default ImageGenerator;
