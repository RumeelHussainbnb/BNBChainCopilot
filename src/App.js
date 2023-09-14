import React, { useState } from 'react';
import './App.css';
import bnbLogo from './assets/bnb-logo.png';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import bnbImgLog from './assets/bnb-logo.png';
import { sendMsgToOpenAI } from './openai';
import { useEffect, useRef } from 'react';
import { Web3Button } from '@web3modal/react';
import { BiTrash } from "react-icons/bi";
import { useAccount } from 'wagmi';
import axios from 'axios';
import Spinner from './spinner';
import Toast from './common/toaster';

function App() {
  const msgEnd = useRef(null);
  const {address, isDisconnected,isConnected } = useAccount()
  const [input, setInput] = useState('');
  const [roomID, setRoomID] = useState('0');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [msg, updateMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };
  
  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if(isConnected){
      getUserRooms(0);
    }
  }, [isConnected]);

  
  useEffect(() => {
    if(isDisconnected){
      setRooms([]);
      setMessages([]);
    }
    
    
  }, [isDisconnected]);

  

  const getUserRooms = async (getAll = 1) => {
    try {
      setLoading(true);
      setRooms([]);
      const response = await axios.get(`http://localhost:5000/api/rooms?userID=${address}&getAll=${getAll}`);

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      const data = response.data;
      setRooms(data);
      
      if(data !== undefined && data.length > 0){
        handleRoomClick(data[0]._id)
      }
      if(response.data.length === 0){
        //setRooms([])
        handleNewDefaultRoomCreate();
      }
      setLoading(false);
    } catch (error) {
      console.error('There was a problem with the request:', error);
    }
  };

  useEffect(() => {
    if(msg === ''){
      return;
    }
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(message => {
        if (message._id === "0") {
          return { ...message, Answer: [msg] };
        }
        return message;
      });
      return updatedMessages;
    });
  }, [msg]);

  const handleSend = async () => {
    if(input.trim() === ""){
      return;
    }
    //setLoading(true);
    if(address === undefined){
      handleShowToast();
      return;
    }
    setInput('');
    setMessages([...messages, {
      _id:"0",
      Question: input,
      Answer: "",
      roomID: roomID
    }])
    
    const response = await sendMsgToOpenAI(input,updateMsg,msg,roomID);
    updateMsg('');
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(message => {
        if (message._id === "0") {
          return { ...message, _id: response.insertedId};
        }
        return message;
      });
      return updatedMessages;
    });
    
   
  };

  const handleEnter = async (e) => {
    //e.preventDefault();
    if (e.key === 'Enter') {
      await handleSend();
    }
  };

  const handleRoomClick = async (e) => {
    
    setRoomID(e);
    setLoading(true);
    setMessages([]);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chats?roomID=${e}`
      );

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      const data = response.data;
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('There was a problem with the request:', error);
    }
  };

  const handleNewDefaultRoomCreate = async ( ) => {
    
    if(address === undefined){
      handleShowToast();
      return;
    }

    const data ={
      roomName:"Room 1" ,
      userID: address,
    }
    await axios
    .post('http://localhost:5000/api/rooms', data)
    .then((savedResponse) => {
      console.log('Inserted room:', savedResponse.data);
      data._id = savedResponse.data._id;
    })
    .catch((error) => {
      console.error('Axios error:', error);
    });
    getUserRooms();
  };

  // Function to handle creating a new chat
  const handleNewChatClick = async ( ) => {
    
    if(address === undefined){
      handleShowToast();
      return;
    }

    const data ={
      roomName:"Room " + (rooms.length + 1) ,
      userID: address,
    }
    await axios
    .post('http://localhost:5000/api/rooms', data)
    .then((savedResponse) => {
      console.log('Inserted room:', savedResponse.data);
      data._id = savedResponse.data._id;
    })
    .catch((error) => {
      console.error('Axios error:', error);
    });
    getUserRooms();
  };

  const handleDeleteRoomClick= async (roomID) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/rooms?roomId=${roomID}`
      );

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      const data = response.data;
      setLoading(false);
    } catch (error) {
      console.error('There was a problem with the request:', error);
    }
    getUserRooms();
  }
  
  return (
    <>
    <div className="App">
    {showToast && (
        <div className="toast-container">
        <Toast message="Connect Your Wallet" onClose={handleCloseToast} />
      </div>
      )}
      <div className="sidebar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={bnbLogo} alt="Logo" className="logo" />
            <span className="brand">BNB Chain Copilot</span>
          </div>
          <button
            className="midBtn"
            style={{ cursor: 'pointer' }}
            onClick={handleNewChatClick}
          >
            <img src={addBtn} alt="new chat" className="addBtn" />
            New Chat
          </button>
          <div className="upperSideBottom">
            
            {rooms?.map((value, index) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                key={index}
                className="query"
                style={{ cursor: 'pointer', marginRight: '10px' }}
                onClick={() => handleRoomClick(value._id)}
              >
                <img src={msgIcon} alt="Query" />
                {value.roomName}
              </button>
              <button className="delete-button" onClick={() => handleDeleteRoomClick(value._id)}>
                <BiTrash />
              </button>
            </div>
              
            ))}
          </div>
        </div>

          <div className="lowerSide">
            <div className="listItems">
              <Web3Button />
            </div>
          </div>
    </div>
    <div className="main">
        {loading ? <Spinner /> : null}
        <div className="chats">
          {messages.length === 0 && !loading && (
            <>
            <div className={"chat bot"}>
                <img src={bnbImgLog} className="chatimg" alt="gptIcon" />
                <p className="txt">Hi, I am BNB Co-pilot. Ask me anything about BNB Chain!</p>
              </div>
            </>
          )}
          {messages?.map(message => (
            <>
            {message.Question !== undefined && (
              <div className={"chat"}>
                <img src={userIcon} className="chatimg" alt="gptIcon" />
                <p className="txt">{message.Question}</p>
              </div>
            )}
              <div className={"chat bot"}>
                <img src={bnbImgLog} className="chatimg" alt="gptIcon" />
                <p className="txt">{message.Answer}</p>
              </div>
            </>
          ))}
          <div ref={msgEnd} />
        </div>
        
        <div className="chatFooter">
          <div className="inp">
            
            <input
              type="text"
              placeholder="Ask Me Anything!"
              required= "true"
              value={input}
              onKeyDown={handleEnter}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <button className="send" type="button" disabled={!input.trim()}  onClick={handleSend}>
              <img src={sendBtn} alt="send"  />
            </button>
            
            
          </div>
          {/* <p>ChatGPT may produce inaccurate information about people, places, or facts.</p> */}
        </div>
      </div>
    </div>
    
    </>
    
    
  );
  
}

export default App;
