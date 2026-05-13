import React, { useState, useEffect, useRef } from 'react'

const TimezoneList = ({ timezones }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const innerRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Seamless infinite scroll: when the first copy scrolls out of view,
  // snap back to the start — the duplicate ensures no visual gap.
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    let rafId
    let pos = 0
    const speed = 0.6 // px per frame (~36px/s at 60fps)

    const step = () => {
      pos += speed
      // Once we've scrolled past the first copy, reset
      const halfHeight = el.scrollHeight / 2
      if (halfHeight > 0 && pos >= halfHeight) {
        pos -= halfHeight
      }
      el.style.transform = `translateY(-${pos}px)`
      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [timezones])

  if (!timezones || timezones.length === 0) return null

  // Duplicate the list for seamless wrap-around
  const doubled = [...timezones, ...timezones]

  return (
    <aside className="rightCol">
      <div className="tzViewport">
        <div className="tzListInner" ref={innerRef}>
          {doubled.map((tz, index) => (
            <div key={`${tz}-${index}`} className="tzItem">
              {tz.split('/').pop().replace(/_/g, ' ')} &bull; {currentTime.toLocaleTimeString('en-US', {
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
