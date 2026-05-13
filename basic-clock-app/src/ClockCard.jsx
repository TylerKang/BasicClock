import React, { useState, useEffect } from 'react'

const ClockCard = ({ timezone, label, index }) => {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date()
        const dayAndTime = now.toLocaleTimeString('en-US', { 
          weekday: 'short', 
          timeZone: timezone 
        })
        const dateStr = now.toLocaleString('en-US', { 
          timeZone: timezone 
        }).split(',')[0]
        
        setTime(dayAndTime)
        setDate(dateStr)
      } catch (error) {
        console.error(`Error updating timezone ${timezone}:`, error)
        setTime('Error')
        setDate('Error')
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => {
      clearInterval(interval)
    }
  }, [timezone])

  return (
    <div className="contentContainer">
      <div className={`timeBox timeBox-${index}`}>
        <p className="boxContent" aria-live="polite">{time}</p>
        <p className="boxContent-sub">{date}</p>
        <p className="label info">{label}</p>
      </div>
    </div>
  )
}

export default ClockCard