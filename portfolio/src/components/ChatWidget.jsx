import { useEffect, useRef, useState } from 'react'
import './ChatWidget.css'

const suggestedQuestions = [
  "What's Subodh's DevOps experience?",
  'Tell me about FarmDirect',
  'What are his skills?'
]

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      className="chat-widget__icon"
    >
      <circle cx="32" cy="32" r="30" fill="currentColor" />
      <circle cx="22" cy="26" r="4" fill="#ffffff" />
      <circle cx="42" cy="26" r="4" fill="#ffffff" />
      <path
        d="M22 40c3 4 7 6 10 6s7-2 10-6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M32 10v8"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="32" cy="10" r="3" fill="#ffffff" />
    </svg>
  )
}

function TypingIndicator({ showColdStartText }) {
  return (
    <div className="chat-widget__message-row chat-widget__message-row--bot">
      <div className="chat-widget__bubble chat-widget__bubble--bot chat-widget__typing">
        <span>
          {showColdStartText
            ? 'Waking up the server, this can take up to a minute on first load...'
            : 'typing'}
        </span>
        <span className="chat-widget__dots" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
    </div>
  )
}

function renderTextWithLinks(text) {
  if (!text) {
    return null
  }

  const pattern = /(https?:\/\/[^\s]+|www\.[^\s]+|mailto:[^\s]+|tel:[^\s]+|linkedin\.com\/[^\s]+|github\.com\/[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi
  const parts = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    const token = match[0]

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const cleanedToken = token.replace(/[.,;:!?)]$/, '')
    let href = cleanedToken

    if (/^www\./i.test(href)) {
      href = `https://${href}`
    } else if (/^(linkedin\.com|github\.com)\//i.test(href)) {
      href = `https://${href}`
    } else if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(href)) {
      href = `mailto:${href}`
    }

    parts.push(
      <a
        key={`${href}-${match.index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'underline' }}
      >
        {cleanedToken}
      </a>
    )

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

function ChatWidget({ defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showColdStartText, setShowColdStartText] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipDismissed, setTooltipDismissed] = useState(false)
  const messageListRef = useRef(null)
  const inputRef = useRef(null)
  const launcherRef = useRef(null)
  const tooltipTimerRef = useRef(null)

  // Close on Escape and clear errors when closing
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && isOpen) {
        launcherRef.current?.focus()
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  // Keep the newest user or bot message visible as the conversation grows.
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages, isLoading, showColdStartText])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setShowTooltip(false)
      setTooltipDismissed(true)
    }
  }, [isOpen])

  async function sendMessage(messageText = inputValue) {
    const trimmedMessage = messageText.trim()

    if (!trimmedMessage || isLoading) {
      return
    }

    const ts = new Date().toISOString()

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: trimmedMessage,
      ts
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setInputValue('')
    setIsLoading(true)
    setShowColdStartText(false)
    setErrorMessage('')
    console.log('[ChatWidget] Sending message:', trimmedMessage)

    const coldStartTimer = window.setTimeout(() => {
      setShowColdStartText(true)
    }, 5000)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: trimmedMessage
        })
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Chat request failed ${response.status}: ${text}`)
      }

      const data = await response.json()
      console.log('[ChatWidget] response:', data)

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text:
            data.answer ||
            "I couldn't find an answer in the current portfolio context.",
          followUps: Array.isArray(data.followUps) ? data.followUps : [],
          ts: new Date().toISOString()
        }
      ])
    } catch (err) {
      console.error('[ChatWidget] send error', err)
      const msg = err?.message || 'Unknown error'
      setErrorMessage(msg)
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text: `Error: ${msg}`,
          ts: new Date().toISOString()
        }
      ])
    } finally {
      window.clearTimeout(coldStartTimer)
      setIsLoading(false)
      setShowColdStartText(false)
    }
  }

  useEffect(() => {
    if (tooltipDismissed || isOpen) {
      return undefined
    }

    tooltipTimerRef.current = window.setTimeout(() => {
      setShowTooltip(true)
    }, 2000)

    return () => {
      window.clearTimeout(tooltipTimerRef.current)
    }
  }, [tooltipDismissed, isOpen])

  function handleSubmit(event) {
    event.preventDefault()
    sendMessage()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  function formatTime(iso) {
    try {
      const d = new Date(iso)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className="chat-widget" aria-live="polite">
      <button
        type="button"
        className="chat-widget__launcher"
        aria-label="Open chat with Subodh's AI"
        aria-expanded={isOpen}
        ref={launcherRef}
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon />
      </button>

      {showTooltip && !isOpen && (
        <div className="chat-widget__tooltip" role="dialog" aria-label="Chat suggestion">
          <button
            type="button"
            className="chat-widget__tooltip-close"
            aria-label="Dismiss chat hint"
            onClick={() => {
              setShowTooltip(false)
              setTooltipDismissed(true)
            }}
          >
            ×
          </button>
          <button
            type="button"
            className="chat-widget__tooltip-content"
            onClick={() => setIsOpen(true)}
          >
            <strong>Have questions about me?</strong>
            <span>Ask away!</span>
          </button>
        </div>
      )}

      <section
        className={`chat-widget__panel ${
          isOpen ? 'chat-widget__panel--open' : ''
        }`}
        aria-hidden={!isOpen}
      >
        <header className="chat-widget__header">
          <div>
            <p className="chat-widget__eyebrow">Portfolio assistant</p>
            <h2>Chat with Subodh's AI</h2>
          </div>
          <button
            type="button"
            className="chat-widget__close"
            aria-label="Close chat"
            onClick={() => {
              launcherRef.current?.focus()
              setIsOpen(false)
              setMessages([])
              setInputValue('')
              setErrorMessage('')
              setShowColdStartText(false)
              setIsLoading(false)
            }}
          >
            X
          </button>
        </header>

        <div className="chat-widget__messages" ref={messageListRef}>
          {messages.length === 0 && (
            <div className="chat-widget__welcome">
              <div className="chat-widget__message-row chat-widget__message-row--bot">
                <div className="chat-widget__bubble chat-widget__bubble--bot">
                  Hi, I can answer questions about Subodh's projects, skills,
                  experience, and contact details.
                </div>
              </div>

              <div className="chat-widget__suggestions" aria-label="Suggested questions">
                {suggestedQuestions.map((question) => (
                  <button
                    type="button"
                    key={question}
                    onClick={() => sendMessage(question)}
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              className={`chat-widget__message-row chat-widget__message-row--${message.role}`}
              key={message.id}
            >
              <div className="chat-widget__message-content">
                {message.role === 'bot' && (
                  <div className="chat-widget__avatar" aria-hidden>
                    S
                  </div>
                )}

                <div className="chat-widget__message-bubble-wrapper">
                  <div className={`chat-widget__bubble chat-widget__bubble--${message.role}`}>
                    <div className="chat-widget__bubble-text">
                      {renderTextWithLinks(message.text)}
                    </div>
                  </div>

                  <div className="chat-widget__message-timestamp">
                    {message.ts ? formatTime(message.ts) : ''}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="chat-widget__avatar chat-widget__avatar--user" aria-hidden>
                    U
                  </div>
                )}
              </div>

              {message.followUps?.length > 0 && (
                <div className="chat-widget__followups" aria-label="Follow-up questions">
                  {message.followUps.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendMessage(question)}
                      disabled={isLoading}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <TypingIndicator showColdStartText={showColdStartText} />
          )}
        </div>

        <form className="chat-widget__form" onSubmit={handleSubmit}>
          <textarea             id="chat-widget-message"
             name="message"            ref={inputRef}
            value={inputValue}
            placeholder="Ask about Subodh..."
            aria-label="Message"
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()}>
            Send
          </button>
        </form>
      </section>
    </div>
  )
}

export default ChatWidget
