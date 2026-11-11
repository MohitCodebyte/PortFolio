# Mohit Kushwah — 3D Interactive Portfolio Website

A complete, production-ready, 3D animated portfolio website for **Mohit Kushwah** (*Data Scientist & Python Developer*), built with **React**, **Vite**, **Tailwind CSS**, **Three.js**, **React Three Fiber (R3F)**, **Drei**, **Postprocessing**, **GSAP + ScrollTrigger**, **Lenis Smooth Scroll**, **Framer Motion**, **Vanilla Tilt**, and **EmailJS**.

---

## ✨ Key Architectural Features

- **Mobile-First Responsive Design (320px–768px & Tablet 768px–1024px)**:
  - Zero horizontal overflow (`overflow-x: clip`, `min-width: 0`, `max-width: 100%`), `100svh`/`100dvh` viewport units, safe-area inset support (`env(safe-area-inset-*)`), fluid `clamp()` typography, and `44×44px+` touch targets.
  - Compact `56px` mobile glass navbar with body-scroll-locking fullscreen menu and a swipe-dismissable **Bottom Sheet** for role-specific resumes.
  - Automatic **Mobile-Lite 3D** mode (`dpr <= 1.25`, `antialias: false`, `powerPreference: "high-performance"`, postprocessing disabled, `<= 150` particles, low-poly centerpiece + 2 accents, and automatic tab visibility pause when `document.hidden`).
- **Persistent Fixed 3D WebGL Canvas (`src/three/scenes/GlobalCanvas.jsx`)**:
  - Single `<Canvas>` behind all sections with scroll-synced 3D camera waypoints (`home`, `about`, `skills`, `experience`, `projects`, `education`, `contact`).
  - Custom GLSL flowing Aurora & FBM noise shader (`src/three/shaders/AuroraShader.js`) reactive to cursor and scroll progress.
- **Custom Animated Developer Cartoon Avatar (`src/components/Avatar.jsx`)**:
  - Inline SVG cartoon developer in a purple/cyan hoodie with glasses and a glowing laptop.
  - Features idle breathing/floating motion, periodic eye blinking, cursor-tracking pupils, laptop screen glow, and a wave animation on hover/click (static when `prefers-reduced-motion` is enabled).
- **Role-Specific Resume System (`src/components/ResumeButtons.jsx`)**:
  - Placed in 3 dedicated locations: **Navbar** (glass popover on desktop / bottom sheet via menu on mobile), **Projects** (above the tabs), and **Footer** (compact).
  - Direct PDF download (`download` attribute), secondary "View in new tab" button, and `HEAD` request verification with a friendly `"Resume file not found"` toast fallback if a PDF is missing.
- **Self-Hosted WebP Projects Showcase (`src/sections/Projects.jsx` & `src/components/ProjectCarousel.jsx`)**:
  - Sticky horizontally scrollable snap filter tabs (**All (9)**, **Data Science (3)**, **Python Developer (6)**).
  - Self-hosted 800×450 `.webp` images in `public/projects/` with 16:9 aspect ratio, dark purple/blue neon overlay, lazy loading, skeleton shimmer, and custom gradient+icon fallback.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Create optimized production build
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 📄 Swapping Resumes

Place your two PDF resumes inside the `public/resumes/` directory with **exact** filenames:
- `public/resumes/data-scientist.pdf` → downloads as `Mohit-Kushwah-Data-Scientist-Resume.pdf`
- `public/resumes/python-developer.pdf` → downloads as `Mohit-Kushwah-Python-Developer-Resume.pdf`

All resume labels, paths, and download filenames are centralized in `src/data/site.js` under `siteConfig.resumes`.

---

## ✉️ EmailJS Setup Steps (Contact Form)

The Contact form sends messages directly via `@emailjs/browser`. If environment variables are not configured, submitting the form gracefully falls back to opening a pre-filled `mailto:kushwamitansh@gmail.com` link so visitors can always reach you.

1. Create a free account at [https://www.emailjs.com/](https://www.emailjs.com/).
2. In the EmailJS Dashboard, go to **Email Services** → **Add New Service** (connect Gmail for `kushwamitansh@gmail.com`) and copy your **Service ID**.
3. Go to **Email Templates** → **Create New Template**. Use these template variables in your template body:
   - `{{from_name}}` — Sender's name
   - `{{from_email}}` — Sender's email address
   - `{{reply_to}}` — Reply-to address
   - `{{message}}` — Message content
   Save and copy your **Template ID**.
4. Go to **Account** → **General** → **API Keys** and copy your **Public Key**.
5. Duplicate `.env.example` to `.env` in the project root and paste your keys:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   ```

---

## 🛠️ How to Add or Edit Projects

All project data lives in a single source of truth: **`src/data/projects.js`**.

To add a project, place an 800×450 `.webp` thumbnail in `public/projects/<slug>.webp` and append an entry to the `projects` array:
```js
{
  id: 'my-new-project',
  title: 'Project Title',
  category: 'data-science', // 'data-science' or 'python-developer'
  categoryLabel: 'Data Science', // 'Data Science' or 'Python Developer'
  image: '/projects/my-new-project.webp',
  description: '1–2 line summary of the project architecture and business value.',
  liveUrl: 'https://your-live-demo.vercel.app/',
  repoUrl: 'https://github.com/MohitCodebyte/your-repo', // or null if private/unavailable
  isRenderHosted: false,
  tech: ['Python', 'Scikit-learn', 'FastAPI'],
}
```

---

## 🖼️ Project Image Credits (Unsplash License)

All 9 project card thumbnails are self-hosted in `public/projects/*.webp` (resized to 800×450 WebP) from free-to-use Unsplash photography:

| Project File | Photographer | Source URL |
| :--- | :--- | :--- |
| `public/projects/creditrisk-ai.webp` | Luke Chesser | [https://unsplash.com/photos/JKUTrJ4vK00](https://images.unsplash.com/photo-1551288049-bebda4e38f71) |
| `public/projects/ecommerce-customer-intelligence.webp` | Carlos Muza | [https://unsplash.com/photos/hpjSkU2UYSU](https://images.unsplash.com/photo-1460925895917-afdab827c52f) |
| `public/projects/nexus-ai-support.webp` | Franck (`@franckinjapan`) | [https://unsplash.com/photos/V37iTrYZz2E](https://images.unsplash.com/photo-1531746790731-6c087fecd65a) |
| `public/projects/sahara-hospital.webp` | National Cancer Institute | [https://unsplash.com/photos/L8tWZT4CcVQ](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d) |
| `public/projects/ott-platform.webp` | freestocks | [https://unsplash.com/photos/11SgH7U6TmI](https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37) |
| `public/projects/kinder-kids-school.webp` | Element5 Digital | [https://unsplash.com/photos/OyCl7Y4y0Bk](https://images.unsplash.com/photo-1503676260728-1c00da094a0b) |
| `public/projects/ecommerce-website.webp` | Blake Wisz | [https://unsplash.com/photos/Xn5FbEM9564](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d) |
| `public/projects/billing-management.webp` | Kelly Sikkema | [https://unsplash.com/photos/xoU52jUVUXA](https://images.unsplash.com/photo-1554224155-6726b3ff858f) |
| `public/projects/edusphere-school-erp.webp` | Priscilla Du Preez | [https://unsplash.com/photos/XkKCui44iM0](https://images.unsplash.com/photo-1523240795612-9a054b0db644) |

---

## 🌐 Deploying to Vercel (PowerShell Commands)

Run the following exact commands in Windows PowerShell from `d:\Data scientist\PortFolio`:

```powershell
# 1. Verify production build locally
npm run build
npm run preview

# 2. Option A: Deploy directly from terminal with Vercel CLI
npm i -g vercel
vercel login
vercel          # preview deploy
vercel --prod   # production deploy

# 3. Option B: Deploy via GitHub + Vercel Dashboard (auto-deploy on every push)
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/MohitCodebyte/<your-repo-name>.git
git push -u origin main
# Then go to https://vercel.com/new -> Import the GitHub repo ->
# Framework Preset: Vite, Build Command: npm run build, Output Directory: dist ->
# (Optional) Environment Variables: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY ->
# Click Deploy.
```

> **Note:** After deploying, replace `https://YOUR-DOMAIN.vercel.app` in `index.html`, `public/robots.txt`, and `public/sitemap.xml` with your live Vercel URL.
