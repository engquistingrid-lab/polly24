## Quick context

This repo is a small realtime polling/quiz prototype using Vue 3 + Vite on the frontend and a tiny Express/Socket.IO server on the backend. The backend stores all state in-memory in `server/Data.js` (no DB). Socket event names and message shapes are defined and handled in `server/sockets.js` and are relied on by the front-end views in `src/views`.

## Quick start (developer)

- Install: `npm install`
- Dev (starts both front-end and backend with auto-reload): `npm run dev` (uses `concurrently`).
- Backend only (nodemon): `npm run dev:backend` (server entry: `server/index.js`).
- Frontend only (vite): `npm run dev:frontend`.
- Build frontend: `npm run build`. Lint: `npm run lint`.

Notes: the vite dev server runs on port 5173 by default; the socket server listens on 3000. `server/index.js` configures CORS to `http://localhost:5173` — update this when changing ports.

## Architecture & important files

- Frontend: `src/`
  - Entry: `src/main.js` mounts `App.vue` and registers the router.
  - Routing & pages: `src/router` and `src/views/*` (views implement the poll flows: `StartView.vue`, `PollView.vue`, `ResultView.vue`, `AdministratorGroupPage.vue`, etc.).
  - Reusable UI: `src/components/*` (examples: `BarsComponent.vue`, `QuestionComponent.vue`).

- Backend: `server/`
  - Entry: `server/index.js` — creates HTTP server and `socket.io` server.
  - Socket handlers: `server/sockets.js` — all socket events and broadcast logic live here.
  - In-memory data store: `server/Data.js` — the canonical place to add persistence or change data shape.
  - i18n labels: `server/data/labels-en.json` and `server/data/labels-sv.json` — UI labels are loaded from these files via `Data.getUILabels(lang)`.

## Data flow & socket contract (examples)

- Creating a poll:
  - Client emits: `createPoll` with `{ pollId, lang }`.
  - Backend: `Data.createPoll` then emits `pollData` with the poll object.

- Joining & receiving questions:
  - Client emits: `joinPoll` with `pollId` → backend `socket.join(pollId)` and emits `questionUpdate` and `submittedAnswersUpdate`.

- Running a question:
  - Client emits: `runQuestion` with `{ pollId, questionNumber }` → backend calls `Data.activateQuestion` and broadcasts `questionUpdate` and `submittedAnswersUpdate` to the room with `io.to(pollId).emit(...)`.

- Submitting an answer:
  - Client emits: `submitAnswer` with `{ pollId, answer }` → backend updates `Data.submitAnswer` and broadcasts `submittedAnswersUpdate`.

Refer to `server/sockets.js` for the full list of event names: `getUILabels`, `createPoll`, `addQuestion`, `joinPoll`, `participateInPoll`, `startPoll`, `runQuestion`, `submitAnswer`.

## Conventions & patterns to follow

- The backend uses ES modules (`server/package.json` sets `type: "module"`). Use `import`/`export` there.
- `server/Data.js` is intentionally minimal and uses prototype methods for performance and clarity — add new data-facing methods here when changing state shape.
- Socket handlers are thin: they call `Data` methods and emit updates — prefer adding broadcast logic in `sockets.js` and data persistence logic in `Data.js` (separation of concerns).
- UI labels are read synchronously from `server/data/labels-*.json` via `readFileSync` — keep filenames `labels-<lang>.json` to let `Data.getUILabels(lang)` find them.

## Editing guidance & gotchas

- State is ephemeral: restarting the backend clears all polls. If you need persistence, implement a DB adapter and replace or wrap `Data` methods.
- When changing socket event names or payloads, update both `server/sockets.js` and the front-end callers in `src/views` (search for the event name across `src/` to find all usages).
- If you change the frontend dev port, also update the CORS origin in `server/index.js`.
- Use `npm run dev` for local development — `nodemon` will auto-restart the backend; Vite handles frontend HMR.

## Files to inspect first when working on features or bugs

- `server/sockets.js` (socket event semantics and broadcasts)
- `server/Data.js` (application state and data shape)
- `src/views/*` (page flows and where socket events are emitted)
- `src/components/*` (shared UI primitives used by views)

## Short examples (where to change behaviour)

- To persist answers to disk/DB: implement a persistence layer in `server/Data.js` (e.g., add `savePoll(pollId)` and call it from `submitAnswer`).
- To add a new admin action: add a new socket event handler in `server/sockets.js`, modify `Data.js` if it alters state, and add a button in the relevant `src/views/*` page that emits the new event.

If anything here is unclear or you'd like me to include more examples (e.g., a code snippet showing how to add a DB adapter in `server/Data.js`), tell me which areas to expand.
