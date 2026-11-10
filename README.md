# daylobby

A quiet, horizontally draggable log of a designer and developer's week: one column per day, one card per thing done. The interface is a simplified reconstruction of the interaction model at [senyil.com/what-should-we-do-today](https://senyil.com/what-should-we-do-today/), using flat color cards in place of event artwork and omitting the filter control.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Build the production bundle with `npm run build`.

## Interaction

- Drag or swipe horizontally to move between About and each day of the week.
- Use Arrow Left, Arrow Right, Home, and End for keyboard navigation.
- Open any card for its details. Press Escape or click outside the tray to close it.
- On mobile, swipe horizontally to move between the About panel and each period.
