const addDays = (date, amount) => {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

const startOfDay = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const endOfWeek = (date) => {
  const remaining = (7 - date.getDay()) % 7
  return addDays(date, remaining)
}

const endOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0)

const endOfYear = (date) => new Date(date.getFullYear(), 11, 31)

const longDate = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const shortDate = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

const formatRange = (start, end) => {
  if (start.getTime() === end.getTime()) return shortDate.format(start)
  return shortDate.formatRange(start, end)
}

const dateTime = (date, time) => {
  const label = longDate.format(date)
  return time ? `${label} · ${time}` : label
}

export function getPeriods(now = new Date()) {
  const today = startOfDay(now)
  const weekStart = addDays(today, 1)
  const monthStart = today
  const yearStart = today

  return [
    {
      id: 'today',
      title: 'Today',
      date: longDate.format(today),
      events: [
        {
          id: 'slow-morning',
          title: 'A slow morning somewhere new',
          date: dateTime(today, '10:00am'),
          place: 'The neighborhood',
          price: 'Free',
          color: 'mint',
          note: 'Pick a direction, walk until something looks interesting, and stop for coffee on the way back.',
        },
        {
          id: 'matinee',
          title: 'Catch an afternoon matinee',
          date: dateTime(today, '2:30pm'),
          place: 'A local cinema',
          price: '$14',
          color: 'peach',
          note: 'Choose the film after you arrive. The small surprise is part of the plan.',
        },
        {
          id: 'sunset-table',
          title: 'Dinner before sunset',
          date: dateTime(today, '6:15pm'),
          place: 'Near the water',
          price: '$$',
          color: 'lavender',
          note: 'A table, a long conversation, and enough daylight left for the walk home.',
        },
      ],
    },
    {
      id: 'week',
      title: 'This week',
      date: formatRange(weekStart, endOfWeek(today)),
      events: [
        {
          id: 'gallery-night',
          title: 'Late-night gallery walk',
          date: `${shortDate.format(addDays(today, 1))} · 7:00pm`,
          place: 'Downtown',
          price: 'Free',
          color: 'sky',
          note: 'Three small shows within walking distance, followed by a quiet drink nearby.',
        },
        {
          id: 'greenmarket',
          title: 'Saturday greenmarket',
          date: `${shortDate.format(addDays(today, 3))} · 9:00am`,
          place: 'Union Square',
          price: 'Free',
          color: 'butter',
          note: 'Arrive early, buy one thing you have never cooked, and build lunch around it.',
        },
        {
          id: 'listening-room',
          title: 'An evening in a listening room',
          date: `${shortDate.format(addDays(today, 4))} · 8:00pm`,
          place: 'Brooklyn',
          price: '$18',
          color: 'mint',
          note: 'A small room, a short set, and no pressure to make the night bigger than it is.',
        },
      ],
    },
    {
      id: 'month',
      title: 'This month',
      date: formatRange(monthStart, endOfMonth(today)),
      events: [
        {
          id: 'museum-free',
          title: 'A museum on its free evening',
          date: formatRange(today, endOfMonth(today)),
          place: 'Uptown',
          price: 'Free',
          color: 'peach',
          note: 'Stay for one floor instead of trying to see everything. Leave while you still want more.',
        },
        {
          id: 'ferry-day',
          title: 'Take the ferry without a plan',
          date: formatRange(today, endOfMonth(today)),
          place: 'East River',
          price: '$4.50',
          color: 'lavender',
          note: 'Pick the route for the view, get off somewhere unfamiliar, and find your way back slowly.',
        },
        {
          id: 'park-picnic',
          title: 'A park picnic with one good book',
          date: formatRange(today, endOfMonth(today)),
          place: 'Wherever the grass is dry',
          price: 'Free',
          color: 'sky',
          note: 'Bring less than you think you need: one blanket, one book, and something cold to drink.',
        },
      ],
    },
    {
      id: 'year',
      title: 'This year',
      date: String(today.getFullYear()),
      events: [
        {
          id: 'day-trip',
          title: 'Take the train to the end of the line',
          date: formatRange(today, endOfYear(today)),
          place: 'Somewhere outside the city',
          price: '$',
          color: 'mint',
          note: 'Choose the destination for the ride itself. Pack lightly and come home before it feels like homework.',
        },
        {
          id: 'small-festival',
          title: 'Find a festival you have never heard of',
          date: formatRange(today, endOfYear(today)),
          place: 'To be decided',
          price: 'Under $20',
          color: 'butter',
          note: 'A neighborhood event, a tiny film program, or a street fair is enough reason to make a day of it.',
        },
        {
          id: 'open-calendar',
          title: 'Keep one weekend completely open',
          date: formatRange(today, endOfYear(today)),
          place: 'Anywhere',
          price: 'Free',
          color: 'peach',
          note: 'Protect a blank weekend and decide what it is for only when it arrives.',
        },
      ],
    },
  ]
}
