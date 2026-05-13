import React, { useState, useEffect } from 'react'

const TimezoneList = ({ timezones }) => {
  const [displayTimezones, setDisplayTimezones] = useState([])
  const [animationSpeed, setAnimationSpeed] = useState(30)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (timezones && timezones.length > 0) {
      // Create duplicate content for seamless loop
      const duplicated = [...timezones, ...timezones];
      setDisplayTimezones(duplicated)

      // Set animation speed based on number of items, with a reasonable cap
      const speed = Math.min(60, Math.max(30, timezones.length * 0.15));
      setAnimationSpeed(speed);
    }
  }, [timezones])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <aside className="rightCol">
      <div className="tzViewport">
        <div className="tzListInner" style={{
          animation: `scrollUp ${animationSpeed}s linear infinite`
        }}>
          {displayTimezones.map((tz, index) => (
            <div key={index} className="tzItem" data-tz={tz}>
              {tz} • {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: tz
              })}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default TimezoneList
