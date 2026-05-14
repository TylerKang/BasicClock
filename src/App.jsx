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

/** Common timezone abbreviation overrides for well-known zones. */
const TZ_ABBR_MAP = {
  'Asia/Seoul': 'KST', 'Asia/Tokyo': 'JST', 'Asia/Shanghai': 'CST',
  'Asia/Hong_Kong': 'HKT', 'Asia/Taipei': 'CST', 'Asia/Singapore': 'SGT',
  'Asia/Kolkata': 'IST', 'Asia/Calcutta': 'IST', 'Asia/Dubai': 'GST',
  'Asia/Bangkok': 'ICT', 'Asia/Ho_Chi_Minh': 'ICT', 'Asia/Jakarta': 'WIB',
  'Asia/Manila': 'PHT', 'Asia/Karachi': 'PKT', 'Asia/Dhaka': 'BST',
  'Asia/Kathmandu': 'NPT', 'Asia/Colombo': 'IST', 'Asia/Riyadh': 'AST',
  'Asia/Tehran': 'IRST', 'Asia/Kabul': 'AFT', 'Asia/Vladivostok': 'VLAT',
  'Europe/London': 'GMT', 'Europe/Dublin': 'IST', 'Europe/Lisbon': 'WET',
  'Europe/Paris': 'CET', 'Europe/Berlin': 'CET', 'Europe/Rome': 'CET',
  'Europe/Madrid': 'CET', 'Europe/Amsterdam': 'CET', 'Europe/Brussels': 'CET',
  'Europe/Vienna': 'CET', 'Europe/Zurich': 'CET', 'Europe/Stockholm': 'CET',
  'Europe/Oslo': 'CET', 'Europe/Copenhagen': 'CET', 'Europe/Warsaw': 'CET',
  'Europe/Prague': 'CET', 'Europe/Budapest': 'CET',
  'Europe/Helsinki': 'EET', 'Europe/Athens': 'EET', 'Europe/Bucharest': 'EET',
  'Europe/Istanbul': 'TRT', 'Europe/Moscow': 'MSK', 'Europe/Kiev': 'EET',
  'Australia/Sydney': 'AEST', 'Australia/Melbourne': 'AEST',
  'Australia/Brisbane': 'AEST', 'Australia/Perth': 'AWST',
  'Australia/Adelaide': 'ACST', 'Australia/Darwin': 'ACST',
  'Pacific/Auckland': 'NZST', 'Pacific/Fiji': 'FJT',
  'Pacific/Honolulu': 'HST', 'Pacific/Guam': 'ChST',
  'America/New_York': 'EST', 'America/Chicago': 'CST',
  'America/Denver': 'MST', 'America/Los_Angeles': 'PST',
  'America/Phoenix': 'MST', 'America/Anchorage': 'AKST',
  'America/Detroit': 'EST', 'America/Indianapolis': 'EST',
  'America/Toronto': 'EST', 'America/Vancouver': 'PST',
  'America/Winnipeg': 'CST', 'America/Edmonton': 'MST',
  'America/Halifax': 'AST', 'America/St_Johns': 'NST',
  'America/Sao_Paulo': 'BRT',
  'America/Argentina/Buenos_Aires': 'ART', 'America/Bogota': 'COT',
  'America/Lima': 'PET', 'America/Santiago': 'CLT',
  'America/Mexico_City': 'CST', 'America/Havana': 'CST',
  'Africa/Cairo': 'EET', 'Africa/Lagos': 'WAT', 'Africa/Nairobi': 'EAT',
  'Africa/Johannesburg': 'SAST', 'Africa/Casablanca': 'WET',
}

/** Get timezone abbreviation — uses known map first, falls back to Intl API. */
const tzAbbr = (tz) => {
  if (TZ_ABBR_MAP[tz]) return TZ_ABBR_MAP[tz]
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short',
    }).formatToParts(new Date())
    const tzPart = parts.find(p => p.type === 'timeZoneName')
    return tzPart ? tzPart.value : ''
  } catch {
    return ''
  }
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
    ? allZones.filter(tz => {
        const q = search.toLowerCase().replace(/ /g, '_')
        return tz.toLowerCase().includes(q) || tzAbbr(tz).toLowerCase().includes(search.toLowerCase())
      })
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
            <span className="zone-meta">
              <span className="zone-abbr">{tzAbbr(tz)}</span>
              <span className="zone-region">{tz.split('/')[0]}</span>
            </span>
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
    <>
    <div className="drag-bar" />
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
    </>
  )
}

export default BasicClockApp