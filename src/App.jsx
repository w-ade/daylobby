import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getPeriods } from './data'
import { ChevronLeftIcon, CloseIcon } from './icons'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

function AboutColumn() {
  return (
    <section className="column intro-column" aria-labelledby="about-title">
      <div className="intro-copy">
        <h1 id="about-title">What should we do today?</h1>
        <p>
          Daylobby is a small calendar for curious days: exhibitions, markets,
          matinees, long walks, and whatever catches your eye along the way.
        </p>
        <p>
          It keeps the next good idea close without turning free time into a
          project. Pick a window, choose one thing, and leave some room for the
          day to surprise you.
        </p>
        <p>
          Everything here is intentionally simple, affordable, and easy to
          begin.
        </p>
        <p className="credit">A small tool for making a day of it.</p>
      </div>
    </section>
  )
}

function EventCard({ event, onOpen }) {
  return (
    <button
      className={`event-card event-card--${event.color}`}
      type="button"
      onClick={() => onOpen(event)}
      aria-haspopup="dialog"
    >
      <span className="event-title">{event.title}</span>
      <span className="event-date">{event.date}</span>
    </button>
  )
}

function EventDialog({ event, onClose }) {
  const closeRef = useRef(null)
  const closeTimerRef = useRef(null)
  const [closing, setClosing] = useState(false)

  const requestClose = useCallback(() => {
    setClosing(true)
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(onClose, 150)
  }, [onClose])

  useEffect(() => {
    if (!event) return undefined
    setClosing(false)
    const previousFocus = document.activeElement
    closeRef.current?.focus()
    const onKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(closeTimerRef.current)
      previousFocus?.focus?.()
    }
  }, [event, requestClose])

  if (!event) return null

  return (
    <div className={`dialog-layer${closing ? ' is-closing' : ''}`} role="presentation" onMouseDown={requestClose}>
      <section
        className={`event-dialog${closing ? ' is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-dialog-title"
        onMouseDown={(mouseEvent) => mouseEvent.stopPropagation()}
      >
        <button
          ref={closeRef}
          className="icon-button dialog-close"
          type="button"
          onClick={requestClose}
          aria-label="Close event"
        >
          <CloseIcon />
        </button>
        <h2 id="event-dialog-title">{event.title}</h2>
        <p className="dialog-date">{event.date}</p>
        <p className="dialog-description">{event.note}</p>
        <dl>
          <div>
            <dt>Where</dt>
            <dd>{event.place}</dd>
          </div>
          <div>
            <dt>Entry</dt>
            <dd>{event.price}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export default function App() {
  const periods = useMemo(() => getPeriods(), [])
  const scrollerRef = useRef(null)
  const dragRef = useRef(null)
  const settleTimerRef = useRef(null)
  const [selectedPeriod, setSelectedPeriod] = useState(0)
  const [activeEvent, setActiveEvent] = useState(null)
  const [showBack, setShowBack] = useState(false)
  const [dragging, setDragging] = useState(false)
  const closeEvent = useCallback(() => setActiveEvent(null), [])

  const measure = () => {
    const scroller = scrollerRef.current
    if (!scroller) return { introWidth: 0, columnWidth: 0, maxScroll: 0 }
    const intro = scroller.querySelector('.intro-column')
    const period = scroller.querySelector('.period-column')
    return {
      introWidth: intro?.getBoundingClientRect().width ?? 0,
      columnWidth: period?.getBoundingClientRect().width ?? 0,
      maxScroll: Math.max(0, scroller.scrollWidth - scroller.clientWidth),
    }
  }

  const scrollToPeriod = (index, behavior = 'smooth') => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const { introWidth, columnWidth, maxScroll } = measure()
    const nextIndex = clamp(index, 0, periods.length - 1)
    const left = Math.min(introWidth + nextIndex * columnWidth + (nextIndex === 0 ? 1 : 0), maxScroll)
    setSelectedPeriod(nextIndex)
    setShowBack(true)
    const resolvedBehavior = window.matchMedia('(max-width: 599px)').matches && behavior === 'smooth'
      ? 'auto'
      : behavior
    scroller.scrollTo({ left, behavior: resolvedBehavior })
  }

  const goHome = () => {
    const scroller = scrollerRef.current
    setSelectedPeriod(0)
    setShowBack(false)
    scroller?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
  }

  const syncSelectionToScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const { introWidth, columnWidth, maxScroll } = measure()
    setShowBack(scroller.scrollLeft > Math.min(64, introWidth * 0.15))
    if (scroller.scrollLeft < introWidth * 0.55 || !columnWidth) return
    const index = scroller.scrollLeft >= maxScroll - 1
      ? periods.length - 1
      : clamp(Math.round((scroller.scrollLeft - introWidth) / columnWidth), 0, periods.length - 1)
    setSelectedPeriod(index)
  }

  const settleScroll = () => {
    window.clearTimeout(settleTimerRef.current)
    settleTimerRef.current = window.setTimeout(syncSelectionToScroll, 120)
  }

  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || activeEvent) return
    const scroller = scrollerRef.current
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: scroller.scrollLeft,
      top: scroller.scrollTop,
      active: false,
    }
  }

  const onPointerMove = (event) => {
    const drag = dragRef.current
    const scroller = scrollerRef.current
    if (!drag || drag.id !== event.pointerId || !scroller) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!drag.active && Math.hypot(dx, dy) > 6) {
      drag.active = true
      setDragging(true)
      scroller.setPointerCapture(event.pointerId)
    }
    if (!drag.active) return
    event.preventDefault()
    scroller.scrollLeft = drag.left - dx
    scroller.scrollTop = drag.top - dy
  }

  const endDrag = (event) => {
    const drag = dragRef.current
    const scroller = scrollerRef.current
    if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.id) || !scroller) return
    dragRef.current = null
    setDragging(false)
    if (scroller.hasPointerCapture(drag.id)) scroller.releasePointerCapture(drag.id)
    if (!drag.active) return
    const { introWidth, columnWidth, maxScroll } = measure()
    let left = scroller.scrollLeft < introWidth * 0.5
      ? 0
      : introWidth + Math.round((scroller.scrollLeft - introWidth) / columnWidth) * columnWidth
    left = clamp(left, 0, maxScroll)
    scroller.scrollTo({ left, behavior: 'auto' })
    syncSelectionToScroll()
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (activeEvent || event.altKey || event.metaKey || event.ctrlKey) return
      const destination = {
        ArrowRight: selectedPeriod + 1,
        ArrowLeft: selectedPeriod - 1,
        Home: 0,
        End: periods.length - 1,
      }[event.key]
      if (destination === undefined) return
      event.preventDefault()
      scrollToPeriod(destination)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeEvent, selectedPeriod, periods.length])

  useEffect(() => () => window.clearTimeout(settleTimerRef.current), [])

  return (
    <>
      <main
        ref={scrollerRef}
        className={`calendar-scroller${dragging ? ' is-dragging' : ''}`}
        aria-label="About, today, this week, this month, and this year. Drag or swipe to explore."
        tabIndex="0"
        onScroll={settleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <header className="calendar-heading" aria-hidden="true">
          <div className="track">
            <div className="column intro-heading">daylobby</div>
            {periods.map((period, index) => (
              <div
                className={`column period-heading${index === selectedPeriod ? ' is-selected' : ''}`}
                key={period.id}
              >
                <span>{period.title}</span>
                <span className="period-date">{period.date}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="track calendar-track">
          <AboutColumn />
          {periods.map((period, index) => (
            <section
              className="column period-column"
              aria-labelledby={`period-${period.id}`}
              aria-current={index === selectedPeriod ? 'true' : undefined}
              key={period.id}
            >
              <h2 className="sr-only" id={`period-${period.id}`}>
                {period.title}, {period.date}
              </h2>
              {period.events.map((event) => (
                <EventCard event={event} key={event.id} onOpen={setActiveEvent} />
              ))}
            </section>
          ))}
        </div>
      </main>

      <div className={`back-control${showBack ? ' is-visible' : ''}`} aria-hidden={!showBack}>
        <button className="icon-button" type="button" onClick={goHome} aria-label="Back to About" tabIndex={showBack ? 0 : -1}>
          <ChevronLeftIcon />
        </button>
      </div>

      <EventDialog event={activeEvent} onClose={closeEvent} />
    </>
  )
}
