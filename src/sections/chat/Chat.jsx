import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect  } from 'react';

import { getUsername } from "../../utils/logic";

const ChatComponent = () => {
  const { receiver } = useParams();
  const [stompClient, setStompClient] = useState(null);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState('CHATROOM');
  const [userData, setUserData] = useState({
    username: getUsername(),
    receivername: receiver,
    connected: false,
    message: '',
  });

  useEffect(() => {
    if (stompClient) {
      userJoin();
    }
  });

  const connect = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stomp = over(socket);
  
    stomp.connect({}, () => {
      console.log('Connected!');
      
      
      setStompClient((prevStompClient) => {
        console.log(stompClient);
        // Use the previous state to ensure the latest stompClient
        if (prevStompClient) {
          console.log(prevStompClient);
          userJoin();
        }
        return stomp;
      });
      setUserData({ ...userData, connected: true });
  
      stomp.subscribe('/chatroom/public', onMessageReceived);
      stomp.subscribe(`/user/${userData.username}/private`, onPrivateMessage);
    }, onError);
  };
  // const onConnected = () => {
  //   setUserData({ ...userData, connected: true });
  //   stompClient.subscribe('/chatroom/public', onMessageReceived);
  //   stompClient.subscribe(`/user/${userData.username}/private`, onPrivateMessage);
  //   userJoin();
  // };

  const userJoin = () => {
    const chatMessage = {
      senderName: userData.username,
      status: 'JOIN',
    };
    stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case 'JOIN':
        // Check if the sender is already in privateChats
        if (!privateChats.has(payloadData.senderName)) {
          // Add a new entry with an empty array
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats)); // Update privateChats state
        }
        break;
      case 'MESSAGE':
        // Check if it's a private message
        if (payloadData.receiverName) {
          // Update private chat for the specific user
          const privateChat = privateChats.get(payloadData.senderName) || [];
          privateChat.push(payloadData);
          privateChats.set(payloadData.senderName, privateChat);
          setPrivateChats(new Map(privateChats));
        } else {
          // It's a public message
          setPublicChats([...publicChats, payloadData]);
        }
        break;
      default:
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    const payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      const list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendValue = () => {
    if (stompClient) {
      const chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: 'MESSAGE',
      };
      console.log(chatMessage);
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: '' });
    }
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      const chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: 'MESSAGE',
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: '' });
    }
  };

  // const handleUsername = (event) => {
  //   const { value } = event.target;
  //   setUserData({ ...userData, username: value });
  // };

  const registerUser = () => {
    setUserData({ ...userData, username: getUsername() });
    connect();
  };

  return (
    <div className="container">
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
                <li>
                <button
                    type="button"
                    onClick={() => setTab('CHATROOM')}
                    className={`member ${tab === 'CHATROOM' && 'active'}`}
                >
                    Chatroom
                </button>
                </li>
                {[...privateChats.keys()].map((name, index) => (
                <li key={index}>
                    <button
                    type="button"
                    onClick={() => setTab(name)}
                    className={`member ${tab === name && 'active'}`}
                    >
                    {name}
                    </button>
                </li>
                ))}
            </ul>
            </div>
          {tab === 'CHATROOM' && (
            <div className="chat-content">
              <ul className="chat-messages">
                {publicChats.map((chat, index) => (
                  <li className={`message ${chat.senderName === userData.username && 'self'}`} key={index}>
                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                <button type="button" className="send-button" onClick={sendValue}>
                  send
                </button>
              </div>
            </div>
          )}
          {tab !== 'CHATROOM' && (
            <div className="chat-content">
              <ul className="chat-messages">
                {[...privateChats.get(tab)].map((chat, index) => (
                  <li className={`message ${chat.senderName === userData.username && 'self'}`} key={index}>
                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                <button type="button" className="send-button" onClick={sendPrivateValue}>
                  send
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <button type="button" onClick={registerUser}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
