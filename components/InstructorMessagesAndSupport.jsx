import React, { useState, useEffect } from "react";
import "../styles/InstructorMessagesAndSupport.css";

const InstructorMessagesAndSupport = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    
  }, []);

  return (
    <div className="messages-container">
      <h2>📩 Messages & Support</h2>

      {messages.length > 0 ? (
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className="message-card">
              <h4>{msg.title}</h4>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no new messages at the moment.</p>
      )}

      <div className="support-section">
        <h3>Need help?</h3>
        <p>If you're facing any issues, feel free to contact our support team.</p>
        <button
          onClick={() =>
            window.location.href = "/contact" 
          }
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default InstructorMessagesAndSupport;
