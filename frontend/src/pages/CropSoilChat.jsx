import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PiArrowLeftBold,
  PiPaperPlaneRightFill,
  PiPlantFill,
  PiMountainsFill,
  PiDropFill,
  PiChatCircleTextFill,
  PiSparkleFill,
  PiMicrophoneFill,
  PiStopCircleFill,
  PiSpeakerHighFill,
  PiSpeakerSlashFill,
  PiLightbulbFill
} from 'react-icons/pi'

function CropSoilChat() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: {
        type: 'welcome',
        message: 'Welcome to AgriVision Voice & Text Chat Assistant! 🌱 Ask me about any crop or soil type. You can type or use the microphone to speak your query.',
        suggestions: ['Rice (ಭತ್ತ)', 'Wheat (ಗೋಧಿ)', 'Black Cotton Soil', 'Red Soil', 'Karnataka', 'Punjab'],
      },
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize Speech Recognition
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-IN'

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }
        
        setInputValue(finalTranscript || interimTranscript)

        if (finalTranscript) {
          setIsListening(false)
          handleSearch(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
      window.speechSynthesis.cancel()
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setInputValue('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return
    window.speechSynthesis.cancel() // stop current speech
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-IN'
    utterance.rate = 1.05
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  const handleSearch = async (query) => {
    if (!query.trim()) return

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: query }])
    setInputValue('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setMessages(prev => [...prev, { type: 'bot', content: data }])
      
      // Text to Speech response
      if (data.type === 'results') {
        const firstResult = data.results[0]
        speakText(`I found ${data.totalResults} results. Here is information on ${firstResult.name}.`)
      } else if (data.type === 'no_results' || data.type === 'error') {
        speakText(data.message)
      }
      
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: {
          type: 'error',
          message: 'Sorry, something went wrong. Please try again.',
          suggestions: ['Rice', 'Wheat', 'Black Soil'],
        },
      }])
      speakText('Sorry, something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(inputValue)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-bg-elevated)', borderBottom: '1px solid var(--color-border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
            <PiArrowLeftBold /> Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', boxShadow: 'var(--shadow-glow)' }}>
              <PiChatCircleTextFill />
            </div>
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Crop & Soil <span className="gradient-text">Assistant</span>
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                AI Search with Speech Recognition & Voice Output
              </p>
            </div>
          </div>
        </div>
        
        {/* Voice Toggle */}
        <button 
          onClick={() => {
            setVoiceEnabled(!voiceEnabled)
            if (voiceEnabled) window.speechSynthesis.cancel()
          }}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          title={voiceEnabled ? "Mute Voice Output" : "Enable Voice Output"}
        >
          {voiceEnabled ? <><PiSpeakerHighFill style={{color: 'var(--color-primary)'}} /> Voice On</> : <><PiSpeakerSlashFill /> Voice Off</>}
        </button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', maxWidth: 900, width: '100%', margin: '0 auto', scrollBehavior: 'smooth' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className="animate-fade-in-up" style={{ marginBottom: 24 }}>
            {msg.type === 'user' ? (
              <UserMessage content={msg.content} />
            ) : (
              <BotMessage content={msg.content} onSuggestionClick={handleSearch} />
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <PiPlantFill />
            </div>
            <div style={{ display: 'flex', gap: 6, background: 'var(--color-bg-elevated)', padding: '14px 18px', borderRadius: '18px 18px 18px 4px', border: '1px solid var(--color-border)' }}>
              <span className="typing-dot" style={{ animationDelay: '0s' }} />
              <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
              <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} style={{ height: 20 }} />
      </div>

      {/* Input Bar */}
      <div style={{ background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)', padding: '20px 24px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          
          <button
            type="button"
            onClick={toggleListening}
            className={`btn ${isListening ? 'btn-primary pulse-ring' : 'btn-secondary'}`}
            style={{
              borderRadius: 999, width: 56, height: 56, padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', flexShrink: 0,
              background: isListening ? '#ef4444' : '',
              boxShadow: isListening ? '0 0 0 0 rgba(239, 68, 68, 0.7)' : '',
              color: isListening ? 'white' : 'var(--color-text-secondary)',
              border: isListening ? 'none' : ''
            }}
            title={isListening ? "Stop listening" : "Start speaking"}
          >
            {isListening ? <PiStopCircleFill /> : <PiMicrophoneFill />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'Search crops, soils... (e.g. "Rice in Karnataka")'}
            className="input"
            style={{
              flex: 1, padding: '16px 20px', fontSize: '1rem', borderRadius: 999,
              background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-bg)',
              borderColor: isListening ? '#fca5a5' : 'var(--color-border)',
              transition: 'all 0.3s'
            }}
            disabled={loading || isListening}
          />
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !inputValue.trim() || isListening}
            style={{
              borderRadius: 999, width: 56, height: 56, padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', flexShrink: 0,
            }}
          >
            <PiPaperPlaneRightFill />
          </button>
        </form>
      </div>

      <style>{`
        .typing-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-primary); opacity: 0.4; animation: typing 1.4s ease-in-out infinite; }
        @keyframes typing {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  )
}

function UserMessage({ content }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ background: 'var(--gradient-primary)', color: 'white', padding: '14px 20px', borderRadius: '20px 20px 4px 20px', maxWidth: '75%', fontSize: '0.95rem', fontWeight: 500, boxShadow: 'var(--shadow-md)' }}>
        {content}
      </div>
    </div>
  )
}

function BotMessage({ content, onSuggestionClick }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem', flexShrink: 0, marginTop: 4, boxShadow: 'var(--shadow-sm)' }}>
        <PiPlantFill />
      </div>

      <div style={{ flex: 1, maxWidth: '85%' }}>
        {(content.type === 'welcome' || content.type === 'no_results' || content.type === 'error') && (
          <div>
            <div style={{ background: 'var(--color-bg-elevated)', padding: '16px 20px', borderRadius: '20px 20px 20px 4px', border: '1px solid var(--color-border)', fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.6, marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
              {content.message}
            </div>
            {content.suggestions && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {content.suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => onSuggestionClick(s)}
                    className="btn btn-ghost"
                    style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 999, padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}
                  >
                    <PiSparkleFill style={{ marginRight: 6, color: 'var(--color-primary)' }} />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {content.type === 'results' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--color-bg-elevated)', padding: '12px 20px', borderRadius: '20px 20px 20px 4px', border: '1px solid var(--color-border)', fontSize: '0.9rem', color: 'var(--color-text-secondary)', boxShadow: 'var(--shadow-sm)' }}>
              Found <strong style={{ color: 'var(--color-primary)' }}>{content.totalResults} result{content.totalResults !== 1 ? 's' : ''}</strong> for "<em>{content.query}</em>"
            </div>

            {content.results.map((item, idx) => (
              item.type === 'crop' ? <CropCard key={idx} crop={item} /> : <SoilCard key={idx} soil={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CropCard({ crop }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: expanded ? 'rgba(16,185,129,0.08)' : 'var(--color-bg-elevated)', transition: 'background 200ms' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'var(--color-primary)', flexShrink: 0 }}>
          <PiPlantFill />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <PiPlantFill style={{ color: 'var(--color-primary)' }} /> {crop.name}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{crop.seasons.join(', ')}</p>
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>▼</span>
      </div>
      {expanded && (
        <div className="animate-fade-in" style={{ padding: '0 24px 24px', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '20px 0' }}>{crop.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div style={{ background: 'var(--color-bg)', padding: 12, borderRadius: 12, border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><PiMountainsFill/> IDEAL SOIL</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>{crop.idealSoil.join(', ')}</p>
            </div>
            <div style={{ background: 'var(--color-bg)', padding: 12, borderRadius: 12, border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><PiDropFill/> WATER NEEDS</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>{crop.waterNeeds}</p>
            </div>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '16px', borderRadius: 12, border: '1px solid rgba(16,185,129,0.25)', fontSize: '0.9rem', color: 'var(--color-primary)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <PiLightbulbFill style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
            <span><strong style={{ color: 'var(--color-text)' }}>Expert Tip:</strong> {crop.tips}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function SoilCard({ soil }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: expanded ? 'rgba(245,158,11,0.08)' : 'var(--color-bg-elevated)', transition: 'background 200ms' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: soil.color || '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'white', flexShrink: 0 }}>
          <PiMountainsFill />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <PiMountainsFill style={{ color: '#f59e0b' }} /> {soil.name}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>pH: {soil.phRange}</p>
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>▼</span>
      </div>
      {expanded && (
        <div className="animate-fade-in" style={{ padding: '0 24px 24px', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '20px 0' }}>{soil.description}</p>
          <div style={{ background: 'rgba(14,165,233,0.12)', padding: '16px', borderRadius: 12, border: '1px solid rgba(14,165,233,0.25)', fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <PiDropFill style={{ color: '#0ea5e9', marginTop: 2, flexShrink: 0 }} />
            <span><strong style={{ color: 'var(--color-text)' }}>Irrigation Advice:</strong> {soil.irrigationTips}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CropSoilChat
