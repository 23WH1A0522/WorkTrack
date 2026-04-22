# WorkTrack

WorkTrack is now wired as a working local MERN project:
- `frontend` is a Vite React app using Redux and the Express API
- `backend` is an Express + MongoDB API with JWT auth
- a demo workspace, project, tasks, and demo users are seeded automatically on first backend start

## Local setup

1. Start MongoDB locally on `mongodb://127.0.0.1:27017`
2. Start the backend from the project root:

```bash
npm run dev:backend
```

3. Start the frontend from the project root in another terminal:

```bash
npm run dev:frontend
```

4. Open `http://localhost:5173`

## Demo login

- Email: `alex@worktrack.demo`
- Password: `demo12345`

## Environment

Backend env lives in [backend/.env](/c:/Users/rajag/OneDrive/Desktop/sirisha/test_worktrack/WorkTrack/backend/.env).

Frontend env lives in [frontend/.env](/c:/Users/rajag/OneDrive/Desktop/sirisha/test_worktrack/WorkTrack/frontend/.env).

## Verified

- Frontend lint passes
- Frontend production build passes

## Notes

- The backend needs a running MongoDB instance to start successfully.
- The seeded data is only created when the users collection is empty.
