import { useState } from 'react'

const mockMessages = [
  { id: 1, user: 'Mike', text: 'Anyone selling a MacBook Pro?', time: '10:22 AM', self: false },
  { id: 2, user: 'You', text: 'I have one listed, check my profile!', time: '10:23 AM', self: true },
  { id: 3, user: 'Sarah', text: 'Just added new shoes to the marketplace 👟', time: '10:25 AM', self: false },
  { id: 4, user: 'John', text: 'Price drop on wireless headphones!', time: '10:28 AM', self: false },
]

const onlineUsers = ['Mike', 'Sarah', 'John', 'Alex', 'Emma']

export default function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(mockMessages)

  function sendMessage(e) {
    e.preventDefault()
    if (!message.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), user: 'You', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), self: true }])
    setMessage('')
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Community</p>
        <h1 style={{ margin: 0, color: '#fff8ef', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>Live Chat</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px', height: '600px' }}>
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: 'rgba(255,250,242,0.06)', backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.self ? 'flex-end' : 'flex-start' }}>
                {!msg.self && <span style={{ color: '#d95f39', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>{msg.user}</span>}
                <div style={{
                  maxWidth: '70%', padding: '10px 16px', borderRadius: msg.self ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.self ? 'linear-gradient(135deg, #d95f39, #9f3518)' : 'rgba(255,255,255,0.09)',
                  color: '#fff8ef', fontSize: '0.92rem', lineHeight: 1.5,
                }}>{msg.text}</div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '4px' }}>{msg.time}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1, padding: '12px 18px', borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)',
                color: '#fff8ef', outline: 'none', fontSize: '0.92rem',
              }}
            />
            <button type="submit" style={{
              padding: '12px 20px', borderRadius: '999px', border: 'none',
              background: 'linear-gradient(135deg, #d95f39, #9f3518)',
              color: '#fff8ef', cursor: 'pointer', fontWeight: 600,
            }}>Send</button>
          </form>
        </div>

        <div style={{
          background: 'rgba(255,250,242,0.06)', backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px',
        }}>
          <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#fff8ef', fontSize: '0.92rem' }}>Online — {onlineUsers.length}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {onlineUsers.map(user => (
              <div key={user} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d95f39, #9f3518)',
                  display: 'grid', placeItems: 'center', color: '#fff8ef', fontSize: '0.78rem', fontWeight: 700,
                }}>{user[0]}</div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem' }}>{user}</span>
                <span style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
