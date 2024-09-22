import React, { useState } from "react";
import ChatBotText from "./components/ChatBotText";
import ImageBot from "./components/ImageBot";
import './App.css';

function App() {
  const [isChatBotTextVisible, setIsChatBotTextVisible] = useState(true);

  const toggleComponent = () => {
    setIsChatBotTextVisible(!isChatBotTextVisible);
  };




  return (
    <div className="app-container">
      <div className="description">
        <h1>Welcome to My AI Suite</h1>
        <p>
          This AI suite offers two powerful tools:
          <ul>
            <li><strong>DSA Question Solver:</strong> Ask any data structures and algorithms questions, and my AI will provide solutions.</li>
            <li><strong>AI Image Generator:</strong> Describe any scene or concept, and my AI will generate a high-resolution image based on your description.</li>
          </ul>
        </p>
      </div>

      <div className="switch-container">
        <button onClick={toggleComponent} className="switch-button">
          Switch to {isChatBotTextVisible ? "Image Generator" : "DSA Solver"}
        </button>
      </div>

      <div className="component-container">
        {isChatBotTextVisible ? <ChatBotText /> : <ImageBot />}
      </div>
    </div>
  );
}

export default App;
