import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';

function Chat() {
    const [token, setToken] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [conversationMessages, setConversationMessages] = useState([]);

    const { isConnected, activeUsers, messages, sendMessage, sendTyping, clearMessages } = useSocket(token);

    useEffect(() => {
        // Get token from cookie
        const getToken = () => {
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
            if (tokenCookie) {
                return tokenCookie.split('=')[1];
            }
            return null;
        };

        const authToken = getToken();
        if (!authToken) {
            window.location.href = '/login';
            return;
        }
        setToken(authToken);

        // Fetch current user info and all users
        fetchUsers(authToken);
    }, []);

    const fetchUsers = async (authToken) => {
        try {
            const response = await fetch('http://localhost:8000/chat/users', {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        clearMessages();
        
        // Fetch conversation history
        try {
            const response = await fetch(`http://localhost:8000/chat/messages/${user._id}`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.messages) {
                setConversationMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }

        // Mark messages as read
        try {
            await fetch(`http://localhost:8000/chat/messages/read/${user._id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const handleSendMessage = (message) => {
        if (selectedUser && message.trim()) {
            sendMessage(selectedUser._id, message);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - User List */}
            <div className="w-1/4 bg-white border-r border-gray-200">
                <div className="p-4 bg-blue-600 text-white">
                    <h1 className="text-xl font-bold">Chat App</h1>
                    <p className="text-sm">{isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
                </div>
                <UserList
                    users={users}
                    activeUsers={activeUsers}
                    selectedUser={selectedUser}
                    onUserSelect={handleUserSelect}
                />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <ChatBox
                        selectedUser={selectedUser}
                        messages={[...conversationMessages, ...messages.filter(m => 
                            (m.sender._id === selectedUser._id || m.receiver._id === selectedUser._id)
                        )]}
                        onSendMessage={handleSendMessage}
                        onTyping={(isTyping) => sendTyping(selectedUser._id, isTyping)}
                        isActive={activeUsers.includes(selectedUser._id)}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                            <p className="mt-1 text-sm text-gray-500">Choose a user from the list to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
