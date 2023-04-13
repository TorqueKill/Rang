// @ts-nocheck
import React from 'react'
import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { useState, useEffect } from 'react';

export default function Messages({ socket }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    socket.on('message', ({ message }) => {
      //set message on top of the array
      setMessages(prev=>[message, ...prev]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  const handleSubmit = e => {
    e.preventDefault();
    if (messageInput) {
      socket.emit('message', { message: messageInput });
      setMessageInput('');
    }
  };

  return (
    <div className="right-side-container messages-container">
      <h1>Messages</h1>
      <div className="message-box">
        {messages.map((message, index) => (
          <div key={index} className="message-content-container">
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
