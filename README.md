# Paradox 🌌

**Paradox** is an interactive, cyberpunk-themed gamified event platform built with React, Vite, Framer Motion, and Tailwind CSS. It provides an immersive sci-fi terminal experience featuring team authentication, mission briefings, role assignments, live dashboards, and an interactive code editor.

---

## 🚀 Features

- **Splash & Lobby Experience:** Futuristic intro animations and pre-event lobby screen.
- **Terminal Authentication:** Cyberpunk-style login modal for team authentication (`AuthModal`).
- **Role Assignment:** Dynamic role card reveals for team members (`RoleCardScreen`).
- **Mission Briefing:** Immersive story-driven mission briefings (`MissionBriefScreen`).
- **Live Dashboard & Code Editor:** Interactive mission dashboard with live problem solving, code editing (`CodeEditor`), leaderboard, and status logs.
- **Animated Visuals:** Smooth screen transitions powered by `framer-motion` and custom SVG components.

---

## 🛠️ Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Iconography:** [Lucide React](https://lucide.dev/)
- **Linter:** [Oxlint](https://oxc.rs/)

---

## 📁 Project Structure

```
Paradox/
├── public/                # Static public assets
├── src/
│   ├── assets/            # Images and vector graphics
│   ├── components/        # UI components & screen modules
│   │   ├── AmongUsCharacter.jsx   # Animated sci-fi character component
│   │   ├── AuthModal.jsx          # Terminal-style team authentication modal
│   │   ├── CodeEditor.jsx         # Interactive in-browser code editor component
│   │   ├── Dashboard.jsx          # Main event dashboard shell & state navigation
│   │   ├── DashboardSections.jsx  # Missions, Leaderboard, and status sections
│   │   ├── LobbyScreen.jsx        # Pre-event interactive lobby portal
│   │   ├── MissionBriefScreen.jsx # Mission lore & objective briefing screen
│   │   ├── RoleCardScreen.jsx     # Team role card reveal screen
│   │   └── SplashScreen.jsx       # Introductory splash screen animation
│   ├── App.css            # Custom animations & component styling
│   ├── App.jsx            # Main app router & screen state manager
│   ├── index.css          # Tailwind CSS directives & global dark theme
│   └── main.jsx           # React application entry point
├── .oxlintrc.json         # Oxlint configuration
├── index.html             # HTML root document
├── package.json           # Project dependencies & npm scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS theme configuration
└── vite.config.js         # Vite build tool configuration
```

---

## ⚡ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Paradox
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Run linter:
   ```bash
   npm run lint
   ```

