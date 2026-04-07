import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { withIronSessionSsr } from 'iron-session/next'
import Navbar from '../components/Navbar'
import Link from 'next/link'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

export default function Messages({ currentUser }) {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
      return
    }
    fetchConversations()
  }, [currentUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      const data = await response.json()
      if (response.ok) {
        setConversations(data.conversations)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Failed to load conversations')
    }
  }

  const fetchMessages = async (conversationId) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      const data = await response.json()
      if (response.ok) {
        setMessages(data.messages)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: newMessage.trim()
        })
      })

      const data = await response.json()
      if (response.ok) {
        setMessages([...messages, data.message])
        setNewMessage('')
        fetchConversations() // Refresh conversation list
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Failed to send message')
    }
  }

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation)
    fetchMessages(conversation.id)
  }

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p.user.id !== currentUser.id)?.user
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">Please log in to access messages.</p>
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />
      
      <main className="page-container">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Connect with employers, mentors, and other users</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Messages Interface */}
          <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '70vh' }}>
            <div className="flex h-full">
              {/* Conversations List */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p>No conversations yet.</p>
                      <p className="text-sm mt-2">Start messaging from job applications or mentor bookings.</p>
                    </div>
                  ) : (
                    conversations.map(conversation => {
                      const otherUser = getOtherParticipant(conversation)
                      const lastMessage = conversation.messages[0]
                      const unreadCount = conversation._count.messages

                      return (
                        <div
                          key={conversation.id}
                          onClick={() => selectConversation(conversation)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                  {(otherUser?.name || otherUser?.email || 'U')[0].toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900">
                                    {otherUser?.name || otherUser?.email || 'Unknown User'}
                                  </h3>
                                  <p className="text-xs text-gray-500 capitalize">
                                    {otherUser?.role?.toLowerCase().replace('_', ' ') || 'User'}
                                  </p>
                                </div>
                              </div>
                              {lastMessage && (
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                  {lastMessage.sender.id === currentUser.id ? 'You: ' : ''}
                                  {lastMessage.content}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {lastMessage && (
                                <p className="text-xs text-gray-500">
                                  {formatTime(lastMessage.createdAt)}
                                </p>
                              )}
                              {unreadCount > 0 && (
                                <span className="inline-block bg-blue-600 text-white text-xs rounded-full px-2 py-1 mt-1">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {(getOtherParticipant(selectedConversation)?.name || getOtherParticipant(selectedConversation)?.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {getOtherParticipant(selectedConversation)?.name || getOtherParticipant(selectedConversation)?.email || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {getOtherParticipant(selectedConversation)?.role?.toLowerCase().replace('_', ' ') || 'User'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((message, index) => {
                          const isOwn = message.sender.id === currentUser.id
                          const showDate = index === 0 || 
                            formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt)

                          return (
                            <div key={message.id}>
                              {showDate && (
                                <div className="text-center text-xs text-gray-500 my-4">
                                  {formatDate(message.createdAt)}
                                </div>
                              )}
                              <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  isOwn 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 text-gray-900'
                                }`}>
                                  <p className="text-sm">{message.content}</p>
                                  <p className={`text-xs mt-1 ${
                                    isOwn ? 'text-blue-200' : 'text-gray-500'
                                  }`}>
                                    {formatTime(message.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <form onSubmit={sendMessage} className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return { props: { currentUser: req.session.user || null } }
}, sessionOptions)