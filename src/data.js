const addDays = (date, amount) => {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

const startOfDay = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const startOfWeek = (date) => addDays(date, -((date.getDay() + 6) % 7))

const shortDate = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'long' })

const log = [
  {
    id: 'mon',
    events: [
      { id: 'mon-0', title: 'Sketched the onboarding flow', time: '9:10am', app: 'Figma', duration: '45 min', color: 'mint', note: 'Three rough screens on paper first, then boxes in Figma. Nothing polished, just the order of things.' },
      { id: 'mon-1', title: 'Fixed the card hover bug', time: '11:30am', app: 'VS Code', duration: '1 hr 20 min', color: 'peach', note: 'The hover state fired on touch devices. Scoped it to hover-capable pointers and checked it on a phone.' },
      { id: 'mon-2', title: 'Wrote up design notes', time: '3:00pm', app: 'Obsidian', duration: '30 min', color: 'lavender', note: "Captured why the spacing scale is 4-based, so future me doesn't undo it." },
    ],
  },
  {
    id: 'tue',
    events: [
      { id: 'tue-0', title: 'Built the settings page layout', time: '9:30am', app: 'VS Code', duration: '2 hr', color: 'sky', note: 'Two-column layout with a sticky nav. Used Base UI primitives and kept the styling plain.' },
      { id: 'tue-1', title: 'Picked type for the dashboard', time: '1:15pm', app: 'Figma', duration: '40 min', color: 'butter', note: 'Compared three sans options at real sizes. Inter won on tables, by a small margin.' },
      { id: 'tue-2', title: 'Reviewed a pull request', time: '4:45pm', app: 'GitHub', duration: '25 min', color: 'mint', note: 'Left four comments, mostly about naming and one missing focus style.' },
    ],
  },
  {
    id: 'wed',
    events: [
      { id: 'wed-0', title: 'Prototyped the drawer motion', time: '10:00am', app: 'Cursor', duration: '1 hr 30 min', color: 'lavender', note: 'Spring on open, quick ease-out on close. Made sure it can be caught mid-animation.' },
      { id: 'wed-1', title: 'Exported icons to SVG', time: '1:00pm', app: 'Figma', duration: '35 min', color: 'peach', note: 'Cleaned up stroke widths and trimmed the paths so they stay crisp at 16px.' },
      { id: 'wed-2', title: 'Shipped the landing update', time: '3:30pm', app: 'Terminal', duration: '20 min', color: 'sky', note: 'Built, pushed main, and checked the Vercel deployment came up green.' },
    ],
  },
  {
    id: 'thu',
    events: [
      { id: 'thu-0', title: 'Deep work: data table', time: '9:00am', app: 'VS Code', duration: '2 hr 30 min', color: 'mint', note: 'Sorting, empty states and keyboard navigation. Phone off, one task only.' },
      { id: 'thu-1', title: 'Design review with a friend', time: '2:00pm', app: 'Zoom', duration: '45 min', color: 'butter', note: 'Walked through the flow, noted where they hesitated, and wrote those spots down.' },
      { id: 'thu-2', title: 'Refined the empty states', time: '4:00pm', app: 'Figma', duration: '50 min', color: 'peach', note: 'Short, friendly copy and one clear next action for each blank screen.' },
    ],
  },
  {
    id: 'fri',
    events: [
      { id: 'fri-0', title: 'Fixed accessibility issues', time: '9:45am', app: 'VS Code', duration: '1 hr', color: 'sky', note: 'Labels on icon buttons, visible focus rings, and a pass with the keyboard only.' },
      { id: 'fri-1', title: 'Tried a new component idea', time: '12:30pm', app: 'Cursor', duration: '1 hr 15 min', color: 'lavender', note: 'A tiny experiment in a lab folder. No plan to ship it, just curiosity.' },
      { id: 'fri-2', title: "Wrapped up the week's log", time: '4:30pm', app: 'Obsidian', duration: '20 min', color: 'mint', note: 'Listed what shipped, what stalled, and one thing to carry into Monday.' },
    ],
  },
  {
    id: 'sat',
    events: [
      { id: 'sat-0', title: 'Read about design systems', time: '10:30am', app: 'Browser', duration: '1 hr', color: 'butter', note: 'Saved three articles worth rereading and highlighted a few ideas on tokens.' },
      { id: 'sat-1', title: 'Side project tinkering', time: '2:00pm', app: 'VS Code', duration: '1 hr 45 min', color: 'peach', note: 'Small, unhurried changes to a personal tool. No deadlines, so no pressure.' },
    ],
  },
  {
    id: 'sun',
    events: [
      { id: 'sun-0', title: 'Planned next week', time: '6:00pm', app: 'Notion', duration: '25 min', color: 'sky', note: 'Picked three things that matter and left the rest of the week loose.' },
      { id: 'sun-1', title: 'Tidied files and folders', time: '7:00pm', app: 'Finder', duration: '20 min', color: 'lavender', note: 'Filed screenshots, archived finished experiments, and cleared the desktop.' },
    ],
  },

]

export function getPeriods(now = new Date()) {
  const monday = startOfWeek(startOfDay(now))
  return log.map((day, index) => {
    const date = addDays(monday, index)
    return {
      id: day.id,
      title: weekday.format(date),
      date: shortDate.format(date),
      events: day.events.map(({ time, ...event }) => ({
        ...event,
        date: `${shortDate.format(date)} · ${time}`,
        place: event.app,
        price: event.duration,
      })),
    }
  })
}
