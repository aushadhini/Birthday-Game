# Birthday Quest for Adeesha ❤️

A romantic, interactive 2D birthday mini-game website — a personal birthday gift with three playful levels, memories, music, and a final surprise.

Built with **React + Vite**, **Tailwind CSS**, and **Framer Motion**. Ready to deploy on **Vercel**.

---

## Quick start

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

### Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Framework preset: **Vite** (auto-detected)
4. Deploy

`vercel.json` is already included for SPA routing.

---

## Default password

The gate password is set in `src/data/config.js`:

```js
password: '1408',
passwordHint: 'Our special date (DDMM) ❤️',
```

Change it to whatever special date or phrase you share.

---

## Game flow

1. **Password gate** — unlocks the experience  
2. **Welcome** — countdown to August 14, music player, start button, gallery  
3. **Level 1 — Birthday Collection** — move Adeesha left/right to catch 🎂 🎁 ❤️  
4. **Level 2 — Memory Challenge** — relationship quiz with unlocked memories  
5. **Level 3 — Birthday Surprise** — cake, fireworks, confetti, love letter  

### Extra features

- **Countdown** to August 14  
- **Music player** (add your own track)  
- **Secret button** — tap the invisible bottom-right hotspot **3 times** for “100 reasons why I love you”  
- **Photo gallery** — soft memory grid  

---

## Customize personal content

All personal text lives in editable data files:

| File | What to edit |
|------|----------------|
| `src/data/config.js` | Name, password, birthday date, music path |
| `src/data/quizQuestions.js` | Quiz questions, answers, memory unlocks |
| `src/data/memories.js` | Gallery captions + Level 1 collect messages |
| `src/data/loveReasons.js` | The 100 reasons list |

### Add photos

1. Put images in `public/photos/` (e.g. `public/photos/first-meet.jpg`)  
2. Update paths in `memories.js` or `quizQuestions.js`:

```js
src: '/photos/first-meet.jpg'
// or for quiz unlocks:
photo: '/photos/first-meet.jpg'
```

### Add music

Our song is **"Until I Found You" — Stephen Sanchez**.

1. Place the mp3 at `public/music/until-i-found-you.mp3`  
2. Or change `musicSrc` / `musicTitle` / `musicArtist` in `src/data/config.js`

Browsers often block autoplay — the player starts after a tap.

---

## Project structure

```
src/
 ├── components/
 │   ├── WelcomeScreen.jsx
 │   ├── BirthdayGame.jsx
 │   ├── MemoryQuiz.jsx
 │   ├── PhotoGallery.jsx
 │   ├── FinalSurprise.jsx
 │   ├── Countdown.jsx
 │   ├── MusicPlayer.jsx
 │   ├── PasswordGate.jsx
 │   ├── LoveReasonsModal.jsx
 │   └── FloatingDecorations.jsx
 ├── data/
 │   ├── config.js
 │   ├── memories.js
 │   ├── quizQuestions.js
 │   └── loveReasons.js
 ├── App.jsx
 ├── main.jsx
 └── index.css
public/
 ├── music/
 ├── photos/
 └── favicon.svg
```

---

## Controls (Level 1)

- **Desktop:** Left / Right arrow keys (or A / D)  
- **Mobile:** On-screen ← → hold buttons  

Collect one of each item type to advance.

---

## Notes for editing the quiz

In `quizQuestions.js`, `correctIndex` is **0-based**:

```js
options: ['University', 'School', 'A coffee shop', 'Online'],
correctIndex: 1, // "School"
```

Update question 2 (“How long have we been together?”) with your real timeline.

---

Made with love for Adeesha’s birthday 🤍
