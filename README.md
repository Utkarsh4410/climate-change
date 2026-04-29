# 🌍 Climate Change — 3D Interactive Website

A fully redesigned, **3D interactive** educational website about climate change — built with **Three.js**, **GSAP ScrollTrigger**, and **Vanilla CSS** with a premium dark-mode aesthetic.

🔗 **Live Demo:** [https://utkarsh4410.github.io/climate-change/](https://utkarsh4410.github.io/climate-change/)

---

## ✨ What's New (Recent Upgrades)

### 🌐 Phase 2 — 3D Interactive Experience
> _Transformed the flat dark-mode site into a fully immersive 3D experience._

| Feature | Details |
|---|---|
| **Three.js Earth Globe** | Wireframe WebGL globe with green continent patches, atmospheric halo glow, and 150+ floating particle stars — rendered full-viewport as the hero |
| **GSAP ScrollTrigger** | All section cards fade + slide in on scroll using `gsap.from()` with `scrollTrigger`, replacing static layouts |
| **3D Card Tilt** | Mouse-tracking perspective tilt effect on all stat/info cards using CSS `perspective` + JS `mousemove` |
| **3D Molecule Visualizer** | Interactive CO₂ / CH₄ / N₂O molecule builder on the Causes page — clickable gas cards pulse the molecule and re-render bonds in Three.js canvas |
| **Animated Stat Counters** | Evidence page counters count up from 0 to real data values on scroll using `IntersectionObserver` |
| **Animated Progress Bars** | Emission source bars animate from 0% to their target widths when scrolled into view |
| **3D Press Submit Button** | Feedback form submit button has a `translateZ` press effect on click |
| **Confetti Burst** | Successful feedback form submission triggers a canvas confetti animation |

### 🎨 Phase 1 — Modern Dark-Mode Redesign
> _Replaced legacy Bootstrap with a cohesive custom design system._

- Dark glassmorphism navbar (fixed, backdrop-blur, border-bottom)
- CSS custom properties (design tokens: colors, spacing, border-radius, shadows)
- Inter typeface via Google Fonts
- Smooth gradient backgrounds with layered `radial-gradient` overlays
- Fully responsive layouts across all 4 pages
- Semantic HTML5 structure with proper heading hierarchy and meta descriptions

---

## 📁 Project Structure

```
climate-change/
├── index.html          # Home — 3D Earth hero, feature cards
├── climate2.html       # Evidence — animated stat counters, progress bars
├── climate3.html       # Causes — 3D molecule visualizer, gas cards
├── feedback.html       # Feedback — floating labels, confetti submit
├── style.css           # Global design system & all page styles
└── three-scene.js      # Three.js Earth globe & molecule visualizer
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic markup, accessibility |
| **Vanilla CSS** | Custom design system, glassmorphism, animations |
| **JavaScript (ES6+)** | Interactivity, IntersectionObserver, event handling |
| **[Three.js](https://threejs.org/)** | WebGL 3D Earth globe + molecule visualizer |
| **[GSAP + ScrollTrigger](https://gsap.com/)** | Scroll-driven entrance animations |
| **GitHub Pages** | Static site hosting & CI/CD |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Utkarsh4410/climate-change.git
cd climate-change

# Open locally (no build step required)
open index.html
# or serve with any static file server:
npx serve .
```

---

## 📄 Pages Overview

### 🏠 Home (`index.html`)
- Full-viewport Three.js Earth hero with atmospheric glow and star particles
- Animated feature card grid with GSAP scroll reveals
- Glassmorphism navigation bar

### 📊 Evidence (`climate2.html`)
- Animated stat counters (CO₂ PPM, temperature rise, sea level rise, species at risk)
- Scroll-triggered emission source progress bars
- 3D tilt effect on all data cards

### ⚗️ Causes (`climate3.html`)
- Interactive greenhouse gas card selector (CO₂, CH₄, N₂O, H₂O)
- Real-time Three.js molecule visualizer that updates on card click
- GSAP-animated section entrances

### 💬 Feedback (`feedback.html`)
- Floating label input fields
- Radio pill selectors for rating
- 3D press-effect submit button
- Canvas confetti burst on successful submission

---

## 🌟 Key Implementation Highlights

### Three.js Earth Globe
```javascript
// Wireframe sphere + green continent overlay + atmospheric halo
const earthMesh = new THREE.Mesh(geometry, wireMat);
const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat); // glow halo
scene.add(earthGroup); // auto-rotates at 0.002 rad/frame
```

### GSAP ScrollTrigger Cards
```javascript
gsap.from(".feature-card", {
  scrollTrigger: { trigger: ".features", start: "top 80%" },
  y: 60, opacity: 0, duration: 0.8, stagger: 0.15
});
```

### 3D Card Tilt
```javascript
card.addEventListener("mousemove", e => {
  const { rotateX, rotateY } = getAngles(e, card);
  card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});
```

---

## 📸 Screenshots

> _Live site hosted at [https://utkarsh4410.github.io/climate-change/](https://utkarsh4410.github.io/climate-change/)_

---

## 👤 Author

**Utkarsh** — [@Utkarsh4410](https://github.com/Utkarsh4410)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
