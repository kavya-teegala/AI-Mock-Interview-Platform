# PrepPilot — AI Mock Interview & Resume Analyzer (Frontend)

React 19 + Vite + Tailwind CSS v4 + Framer Motion + Lucide React + Axios + React Router.
No Material UI / Chakra / Bootstrap — Tailwind + Framer Motion only.

## Run it

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and point `VITE_API_BASE_URL` at your Express/MERN API.
The UI runs fully on mock/local data out of the box (Interview grading, Resume analysis,
Dashboard stats) so you can demo it with zero backend.

## Folder structure

```
src/
├── api/               # axios instance (interceptors, base config)
├── animations/        # centralized Framer Motion variants
├── components/
│   ├── common/         # GlassCard, GradientButton, AILoader, ProgressRing,
│   │                    StatsCard, AnimatedHeading, Toast, SessionExpiredModal
│   └── layout/          # Navbar, Sidebar, Footer
├── context/            # AuthContext, ToastContext
├── hooks/               # useAuth, useToast
├── layouts/             # AuthLayout, DashboardLayout, ProtectedRoute
├── pages/
│   ├── home/             # landing page + sections (Hero, Stats, Features, Testimonials, CTA)
│   ├── auth/              # Login, Register, ForgotPassword
│   ├── dashboard/          # Dashboard
│   ├── interview/           # Interview (mock interview workspace — centerpiece)
│   ├── resume/                ResumeAnalyzer
│   ├── history/                 History
│   ├── profile/                  Profile
│   └── settings/                   Settings
├── routes/ (constants live in utils/constants.js)
├── services/             # authService, interviewService, resumeService
└── utils/                # cn.js (classnames), constants.js
```

## Design system

See `src/index.css` `@theme` block for the full token system (colors, fonts, radii) —
"Control Room" theme: near-black surfaces, violet **Signal** accent (AI/intelligence),
mint **Pulse** accent (success/live/score), coral **Ember** (alerts). Display font is
Space Grotesk, body is Inter, data/scores use JetBrains Mono.
