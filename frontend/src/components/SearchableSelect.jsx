import { useState, useRef, useEffect } from 'react'
import { PiMagnifyingGlassBold, PiCaretDownBold } from 'react-icons/pi'

function SearchableSelect({ options, value, onChange, placeholder = 'Search...', label }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(0)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  const filtered = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    setHighlightIndex(0)
  }, [search])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (opt) => {
    onChange(opt.value)
    setIsOpen(false)
    setSearch('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex(prev => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[highlightIndex]) {
        handleSelect(filtered[highlightIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearch('')
    }
  }

  const selectedOption = options.find(o => o.value === value)

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {label && (
        <label style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          display: 'block',
          marginBottom: 4,
        }}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
          setTimeout(() => inputRef.current?.focus(), 50)
        }}
        className="input"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left',
          background: 'var(--color-bg-elevated)',
        }}
      >
        <span style={{ color: selectedOption ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <PiCaretDownBold style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 200ms',
        }} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 50,
            maxHeight: 260,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Search Input */}
          <div style={{
            padding: '8px 12px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <PiMagnifyingGlassBold style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.9rem',
                color: 'var(--color-text)',
                width: '100%',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {/* Options List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
              }}>
                No matches found
              </div>
            ) : (
              filtered.map((opt, idx) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  style={{
                    padding: '10px 16px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: idx === highlightIndex
                      ? 'rgba(16,185,129,0.08)'
                      : opt.value === value
                        ? 'rgba(16,185,129,0.04)'
                        : 'transparent',
                    color: opt.value === value ? 'var(--color-primary-dark)' : 'var(--color-text)',
                    fontWeight: opt.value === value ? 600 : 400,
                    transition: 'background 100ms',
                  }}
                >
                  {opt.icon && <span style={{ fontSize: '1rem', color: 'var(--color-primary)', flexShrink: 0 }}>{opt.icon}</span>}
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchableSelect
