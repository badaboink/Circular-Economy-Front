import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect  } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
// import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';

import { getUsername } from "../../utils/logic";

const ChatComponent = () => {
  const { receiver } = useParams();
  const [stompClient, setStompClient] = useState(null);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState('CHATROOM');
  const [error, setError] = useState('');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stompClient]);

  const connect = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stomp = over(socket);
  
    stomp.connect({}, () => {
      console.log('Connected!');
      
      setStompClient((prevStompClient) => {
        if (prevStompClient) {
          userJoin();
        }
        return stomp;
      });
      setUserData({ ...userData, connected: true });
  
      stomp.subscribe('/chatroom/public', onMessageReceived);
      stomp.subscribe(`/user/${userData.username}/private`, onPrivateMessage);

    }, onError);
  };

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
        if (!privateChats.has(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        setPublicChats(payloadData.connectedUsers || []);
        break;
      case 'MESSAGE':
        if (payloadData.receiverName) {
          const privateChat = privateChats.get(payloadData.senderName) || [];
          privateChat.push(payloadData);
          privateChats.set(payloadData.senderName, privateChat);
          setPrivateChats(new Map(privateChats));
        }  else {
          setPublicChats((prevPublicChats) => [
            ...prevPublicChats,
            {
              messageId: payloadData.messageId,
              senderName: payloadData.senderName,
              message: payloadData.message,
            },
          ]);
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
    setError('');
  };

  const sendValue = () => {
    if (stompClient && userData.message.trim() !== '') {
      const chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: 'MESSAGE',
      };
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: '' });
    }else {
      setError('Message cannot be empty');
    }
  };

  const sendPrivateValue = () => {
    if (stompClient && userData.message.trim() !== '') {
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
    }else {
      setError('Message cannot be empty');
    }
  };
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Messages</Typography>
      </Stack>
      {userData.connected ? (
        <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: '100rem',
        }}
        >
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Stack>
                <Button
                  type="button"
                  onClick={() => setTab('CHATROOM')}
                  className={`member ${tab === 'CHATROOM' && 'active'}`}
                  variant={tab === 'CHATROOM' ? 'contained' : 'outlined'}
                >
                  Chat room
                </Button>
                </Stack>
              </Grid>
              {[...privateChats.keys()].map((name, index) => (
                <Grid item key={index}>
                  {name !== getUsername() && (
                    <Stack>
                      
                    <Button
                      type="button"
                      onClick={() => setTab(name)}
                      variant={tab === name ? 'contained' : 'outlined'}
                      className={`member ${tab === name && 'active'}`}
                    >
                      {name}
                    </Button>
                    </Stack>
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={10}>
            <div className="chat-box" >
            {tab === 'CHATROOM' && (
              <div className="chat-content">
                <div style={{ overflowY: 'auto', maxHeight: '400px', maxWidth: '890px', height: '400px', paddingTop: '10px', paddingRight: '10px', paddingLeft: '10px', backgroundColor: '#f9fafb' }}>
                  <Grid container direction="column" spacing={0} >
                    {Object.values(publicChats).map((chat, index) => (
                        
                      <Grid key={index} item className={`message ${chat.senderName === userData.username && 'self'}`}>
                        
                        <div style={{ textAlign: chat.senderName === userData.username ? 'right' : 'left' }}>
                          {chat.senderName !== userData.username && (
                            <Typography variant="body2" className="avatar">
                              @{chat.senderName}
                            </Typography>
                          )}
                          {chat.senderName === userData.username && (
                            <Typography variant="body2" className="avatar self">
                              @{chat.senderName}
                            </Typography>
                          )}
                          <Typography variant="body1" className="message-data">
                            {chat.message}
                          </Typography>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Enter a message"
                      variant="outlined"
                      value={userData.message}
                      onChange={handleMessage}
                      error={!!error}
                      helperText={error}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      fullWidth
                      type="button"
                      color="inherit"
                      variant="contained"
                      onClick={sendValue}
                      style={{ height: '100%' }}
                    >
                      Send
                    </Button>
                  </Grid>
                </Grid>
              </div>
            )}
              {tab !== 'CHATROOM' && (
                <div className="chat-content">
                  <div style={{ overflowY: 'auto', maxHeight: '400px', maxWidth: '890px', height: '400px', paddingTop: '10px', paddingRight: '10px', paddingLeft: '10px', paddingBottom: '10px', backgroundColor: '#f9fafb' }}>
                    <Grid container direction="column" spacing={0}>
                      {[...privateChats.get(tab)].map((chat, index) => (
                        <Grid item key={index} className={`message ${chat.senderName === userData.username && 'self'}`}>
                        <div style={{ textAlign: chat.senderName === userData.username ? 'right' : 'left' }}>
                          {chat.message!=='' &&(
                            <>
                            {chat.senderName !== userData.username && (
                              <Typography variant="body2" className="avatar">
                                @{chat.senderName}
                              </Typography>
                            )}
                            {chat.senderName === userData.username && (
                              <Typography variant="body2" className="avatar self">
                                @{chat.senderName}
                              </Typography>
                            )}
                            <Typography variant="body1" className="message-data">
                              {chat.message}
                            </Typography>
                            </>
                            )}
                          </div>
                        </Grid>
                      ))}
                    </Grid>
                  </div>

                  <Grid container spacing={2}>
                    <Grid item xs={11}>
                      <TextField
                        fullWidth
                        type="text"
                        label="Enter a message"
                        variant="outlined"
                        value={userData.message}
                        onChange={handleMessage}
                        error={!!error}
                        helperText={error}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Button
                        fullWidth
                        type="button"
                        color="inherit"
                        variant="contained"
                        onClick={sendPrivateValue}
                        style={{ height: '100%' }}
                      >
                        Send
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
        </Card>
      ) : (
        <Stack className="register">
          <Button type="button" color='inherit' variant='contained' onClick={connect}>
            Connect
          </Button>
        </Stack>
      )}
    </Container>
  );
};

export default ChatComponent;
