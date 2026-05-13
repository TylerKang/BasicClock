import React, { useState, useEffect, useRef, useCallback } from 'react'
import ClockCard from './ClockCard'
import TimezoneList from './TimezoneList.jsx'
import { TIMEZONE_LIST } from './TimezoneList.js'
import './App.css'

/** Derive a short display label from an IANA timezone string. */
const tzLabel = (tz) => {
  const parts = tz.split('/')
  return parts[parts.length - 1].replace(/_/g, ' ')
}

const FEATURED = ['Asia/Seoul', 'Asia/Tokyo', 'America/Los_Angeles']
const DEFAULT_SELECTION = FEATURED.map(tz => ({ tz, label: tzLabel(tz) }))

const ZoneSelector = ({ onConfirm, initialSelection = [], allZones = [] }) => {
  const [selectedZones, setSelectedZones] = useState(
    initialSelection.length > 0 ? initialSelection : DEFAULT_SELECTION
  )
  const [search, setSearch] = useState('')

  const selectedTzSet = new Set(selectedZones.map(z => z.tz))
  const base = search
    ? allZones.filter(tz => tz.toLowerCase().includes(search.toLowerCase()))
    : [
        ...FEATURED.filter(tz => allZones.includes(tz)),
        ...allZones.filter(tz => !FEATURED.includes(tz)),
      ]
  // Selected zones always float to top
  const sorted = [
    ...base.filter(tz => selectedTzSet.has(tz)),
    ...base.filter(tz => !selectedTzSet.has(tz)),
  ]

  const handleZoneToggle = (tz) => {
    setSelectedZones(prev => {
      const isSelected = prev.some(z => z.tz === tz)
      if (isSelected) return prev.filter(z => z.tz !== tz)
      return [...prev, { tz, label: tzLabel(tz) }]
    })
  }

  const handleConfirm = () => {
    if (selectedZones.length > 0) {
      onConfirm(selectedZones)
    }
  }

  return (
    <div className="zone-selector">
      <h2>Select Timezones</h2>
      <p>Choose at least 1 timezone to display ({selectedZones.length} selected)</p>
      <input
        className="zone-search"
        type="text"
        placeholder="Search timezones..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="zone-grid">
        {sorted.map((tz) => (
          <div
            key={tz}
            className={`zone-item ${selectedZones.some(z => z.tz === tz) ? 'selected' : ''}`}
            onClick={() => handleZoneToggle(tz)}
          >
            <span className="zone-label">{tzLabel(tz)}</span>
            <span className="zone-region">{tz.split('/')[0]}</span>
          </div>
        ))}
      </div>
      <button
        className="confirm-button"
        onClick={handleConfirm}
        disabled={selectedZones.length === 0}
      >
        Confirm Selection
      </button>
    </div>
  )
}

const BasicClockApp = () => {
  const [selectedZones, setSelectedZones] = useState([])
  const [showZoneSelector, setShowZoneSelector] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)

  // Load saved zones from localStorage on initial load
  useEffect(() => {
    const savedZones = localStorage.getItem('basicClockZones')
    if (savedZones) {
      setSelectedZones(JSON.parse(savedZones))
    } else {
      setShowZoneSelector(true)
    }
  }, [])

  const saveZones = useCallback((zones) => {
    setSelectedZones(zones)
    localStorage.setItem('basicClockZones', JSON.stringify(zones))
  }, [])

  const handleZoneSelection = (zones) => {
    saveZones(zones)
    setShowZoneSelector(false)
  }

  const handleEdit = () => {
    setShowZoneSelector(true)
  }

  // --- drag-and-drop handlers ---
  const handleDragStart = (e, index) => {
    setDragIdx(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    // Save final order to localStorage on drop
    if (dragIdx !== null) {
      localStorage.setItem('basicClockZones', JSON.stringify(selectedZones))
    }
    setDragIdx(null)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragIdx === null || dragIdx === index) return
    // Live reorder as you drag
    setSelectedZones(prev => {
      const reordered = [...prev]
      const [moved] = reordered.splice(dragIdx, 1)
      reordered.splice(index, 0, moved)
      return reordered
    })
    setDragIdx(index)
  }

  return (
    <div className="app">
      {showZoneSelector ? (
        <ZoneSelector
          onConfirm={handleZoneSelection}
          initialSelection={selectedZones}
          allZones={TIMEZONE_LIST}
        />
      ) : (
        <>
          <button className="edit-button" onClick={handleEdit} aria-label="Change timezones">
            ✏️
          </button>
          <div className="mainLayout">
            <div className="leftCol">
              {selectedZones.map((zone, index) => (
                <div
                  key={zone.tz}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  className={`drag-wrapper${dragIdx === index ? ' dragging' : ''}`}
                >
                  <ClockCard
                    timezone={zone.tz}
                    label={zone.label}
                    index={index}
                  />
                </div>
              ))}
            </div>
            <TimezoneList timezones={TIMEZONE_LIST} />
          </div>
        </>
      )}
    </div>
  )
}

export default BasicClockApp