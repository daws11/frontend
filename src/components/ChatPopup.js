import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import authService from '../services/authService';
import { Send, X, MoreVertical, Image, Video, Trash2 } from 'lucide-react';

const ChatPopup = ({ projectId, projectName, teamMembers, projectLeaderName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000'); // Pastikan URL ini benar

    // Load messages from database
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chats/${projectId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    socketRef.current.emit('joinProject', projectId);

    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [projectId]);

  const handleSendMessage = async () => {
    const user = authService.getCurrentUser();
    if (user) {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('userId', user.id);
      formData.append('userName', user.name);
      formData.append('message', newMessage);
      if (media) {
        formData.append('media', media);
      }

      try {
        await axios.post('http://localhost:5000/api/chats', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setNewMessage('');
        setMedia(null);
        setMediaPreview(null);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#f0f2f5] rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-[#008069] text-white p-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {projectId}
            </div>
            <div>
              <h2 className="font-semibold">{projectName}</h2>
              <p className="text-xs opacity-80">
                {teamMembers?.length || 0} participants
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <MoreVertical className="w-5 h-5 cursor-pointer" />
            <X onClick={onClose} className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#efeae2]">
          <div className="space-y-2">
            {messages.map((msg, index) => {
              const isCurrentUser = msg?.user_id === authService.getCurrentUser()?.id;
              return (
                <div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    isCurrentUser ? 'bg-[#d9fdd3]' : 'bg-white'
                  }`}>
                    {!isCurrentUser && (
                      <span className="text-sm font-medium text-[#008069] block">
                        {msg?.userName || 'Unknown User'}
                      </span>
                    )}
                    {msg?.media_url && msg?.media_type === 'image' && (
                      <img src={msg.media_url} alt="media" className="mb-2 rounded-lg" />
                    )}
                    {msg?.media_url && msg?.media_type === 'video' && (
                      <video controls src={msg.media_url} className="mb-2 rounded-lg" />
                    )}
                    <p className="text-[#111b21] break-words">{msg?.message || ''}</p>
                    <span className="text-[#667781] text-xs block text-right">
                      {msg?.created_at 
                        ? new Date(msg.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#f0f2f5] rounded-b-lg">
          {mediaPreview && (
            <div className="mb-2 relative">
              {media.type.startsWith('image') && (
                <img src={mediaPreview} alt="preview" className="rounded-lg" />
              )}
              {media.type.startsWith('video') && (
                <video controls src={mediaPreview} className="rounded-lg" />
              )}
              <button
                onClick={removeMedia}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="hidden"
              id="media-upload"
            />
            <label htmlFor="media-upload" className="cursor-pointer">
              <Image className="w-6 h-6 text-[#008069]" />
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-3 rounded-lg border-none focus:ring-0 bg-white"
              placeholder="Type a message"
            />
            <button
              onClick={handleSendMessage}
              className="p-3 bg-[#008069] text-white rounded-full hover:bg-[#006d59] transition-colors"
              disabled={!newMessage.trim() && !media}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;