import React, { useState, useEffect } from 'react'
import ClockCard from './ClockCard'
import TimezoneList from './TimezoneList'
import { TIMEZONE_LIST } from './TimezoneList.js'
import './App.css'

const ZoneSelector = ({ onConfirm, initialSelection = [] }) => {
  const [selectedZones, setSelectedZones] = useState(initialSelection)

  const defaultZones = [
    { tz: 'America/Los_Angeles', label: 'LA' },
    { tz: 'America/New_York', label: 'NYC' },
    { tz: 'America/Chicago', label: 'Chicago' },
    { tz: 'Europe/London', label: 'London' },
    { tz: 'Europe/Paris', label: 'Paris' },
    { tz: 'Asia/Tokyo', label: 'Tokyo' },
    { tz: 'Asia/Seoul', label: 'Seoul' },
    { tz: 'Asia/Shanghai', label: 'Shanghai' },
    { tz: 'Asia/Kolkata', label: 'Mumbai' },
    { tz: 'Australia/Sydney', label: 'Sydney' },
  ]

  const handleZoneToggle = (zone) => {
    setSelectedZones(prev => {
      // Check if zone is already selected
      const isSelected = prev.some(z => z.tz === zone.tz)
      
      // If already selected, remove it
      if (isSelected) {
        return prev.filter(z => z.tz !== zone.tz)
      } 
      // If not selected and we have less than 3, add it
      else if (prev.length < 3) {
        return [...prev, zone]
      }
      // If already have 3 zones, don't add more
      else {
        return prev
      }
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
      <p>Choose up to 3 timezones to display</p>
      <div className="zone-grid">
        {defaultZones.map((zone, index) => (
          <div
            key={zone.tz}
            className={`zone-item ${selectedZones.some(z => z.tz === zone.tz) ? 'selected' : ''}`}
            onClick={() => handleZoneToggle(zone)}
          >
            <span className="zone-label">{zone.label}</span>
            <span className="zone-tz">{zone.tz.split('/').pop().replace(/_/g, ' ')}</span>
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

  // Load saved zones from localStorage on initial load
  useEffect(() => {
    const savedZones = localStorage.getItem('basicClockZones')
    if (savedZones) {
      setSelectedZones(JSON.parse(savedZones))
    } else {
      setShowZoneSelector(true)
    }
  }, [])

  const handleZoneSelection = (zones) => {
    setSelectedZones(zones)
    localStorage.setItem('basicClockZones', JSON.stringify(zones))
    setShowZoneSelector(false)
  }

  const handleEdit = () => {
    setShowZoneSelector(true)
  }

  return (
    <div className="app">
      {showZoneSelector ? (
        <ZoneSelector
          onConfirm={handleZoneSelection}
          initialSelection={selectedZones}
        />
      ) : (
        <>
          <button className="edit-button" onClick={handleEdit} aria-label="Change timezones">
            ✏️
          </button>
          <div className="mainLayout">
            <div className="leftCol">
              {selectedZones.map((zone, index) => (
                <ClockCard
                  key={zone.tz}
                  timezone={zone.tz}
                  label={zone.label}
                  index={index}
                />
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