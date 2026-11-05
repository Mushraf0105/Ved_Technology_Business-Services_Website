# Veda Technology - Business & Services Website

A modern, responsive, multi-section business website developed for **Veda Technology** to showcase its technology programs, training cohorts, internship offerings, enterprise IT & digital services, company background, interactive FAQs, and inquiry contact mechanisms.

Built strictly with **pure HTML5, CSS3, and Vanilla JavaScript** without any external bloated frameworks or third-party dependencies, adhering directly to the assessment specifications and lightweight web standards.

- **Initial Project Release**: November 04, 2026
- **Feature Upgrade Release**: November 05, 2026

---

## 🎯 Project Objectives & Assessment Scope

- **Responsive Web Design**: Fluid layout optimized seamlessly across mobile devices (≤ 480px), tablets (≤ 768px - 1024px), laptops, and desktop screens.
- **Pure Technology Stack**:
  - **HTML5**: Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) with accessible ARIA attributes and landmark roles.
  - **CSS3**: Modern layout architecture utilizing CSS custom properties (variables), Flexbox, CSS Grid, smooth transitions, and modular media queries.
  - **Vanilla JavaScript (ES6+)**: Custom DOM manipulation, interactive filtering, accordion states, and input validation without jQuery or UI libraries.
  - **Git & GitHub**: Version control and structured commits.
- **Reusable Component Architecture**: Consistent cards for programs, services, values, and testimonials.
- **Search Engine Optimization (SEO)**: Primary metadata, Open Graph (OG) tags, Twitter Card tags, canonical links, descriptive headings, and meaningful URL anchors.
- **Accurate Public Information**: Clean, honest representation of Veda Technology's technology solutions and educational tracks without unsupported claims or private data.

---

## 📁 Directory Structure

```text
Business_&_Services_Website/
│
├── index.html            # Main semantic HTML5 business website with SEO metadata
├── style.css             # Pure CSS3 responsive styles (Variables, Flexbox, Grid, Media Queries)
├── script.js             # Pure Vanilla JavaScript (Menu, Filtering, Accordion, Validation)
├── README.md             # Project documentation, changelog & execution guide
└── Project_Report.pdf    # Comprehensive technical assessment & feature upgrade report
```

---

## 📅 Project Changelog & Timeline

### Initial Release — November 04, 2026
- Developed baseline single-page architecture with semantic HTML5, CSS3, and Vanilla JavaScript.
- Implemented core sections: Navigation Bar, Hero Section with code graphic, About Us with 4 Pillars, Technology Programs with Category Filter Tabs, IT & Digital Services Grid, Structured 3-Phase Internship Roadmap, Accessible FAQ Accordion, Contact Form with Client-Side Regex Validation, and Footer.
- Full mobile-first responsive layout across all device viewports.

### Feature Upgrade — November 05, 2026
- 🌓 **Dark / Light Mode Toggle**: Interactive Sun/Moon switch in header with deep slate tokens and persistent memory (`localStorage`).
- 🚀 **Tech Stack Marquee Banner**: Infinite pure-CSS ticker featuring 12 industry technologies with hover-pause.
- 📈 **Animated Milestone Counter**: Dynamic viewport-triggered counting animation for Hero statistics (`5,000+`, `120+`, `95%+`) using `IntersectionObserver` with cubic ease-out easing.
- ⭐ **Student & Client Testimonials Section**: Added dedicated `#testimonials` section with 5-star rating badges and authentic outcome reviews.
- 📄 **Project Report**: Updated and compiled into `Project_Report.pdf` with assessment metrics and both release dates.

---

## 🚀 Key Features & Deliverables

### 1. Navigation & Header
- **Dark / Light Theme Toggle** *(Added Nov 05, 2026)*: Seamless switcher between bright modern palette and sleek dark slate mode with `localStorage` memory.
- **Sticky Navigation**: Header transitions with backdrop blur and subtle elevation shadow as the user scrolls.
- **Mobile Hamburger Drawer**: Accessible toggle with animated hamburger icon and keyboard support (`Escape` key close, body scroll lock).
- **Scroll-Spy Navigation**: Automatically highlights the active section link in the navbar during scrolling.

### 2. Homepage / Hero Section & Tech Stack Marquee
- High-impact value proposition headline with technology badges.
- Prominent call-to-action (CTA) buttons: *Explore Programs* and *Our IT Services*.
- **Animated Milestone Counter** *(Added Nov 05, 2026)*: Statistics (`5,000+`, `120+`, `95%+`) count up smoothly as they enter viewport using `IntersectionObserver`.
- Interactive simulated code terminal graphic representing Veda Technology's engineering stack.
- **Tech Stack Marquee Banner** *(Added Nov 05, 2026)*: Continuous infinite-scrolling ticker showcasing modern industry technologies (*React, Node.js, Python, AWS, Docker, Kubernetes, etc.*).

### 3. About Section
- Corporate narrative highlighting Veda Technology's mission, values, and pedagogy.
- 4 Core Pillars: Production Standards, Agile Methodology, Community & Mentorship, and Transparent Value.
- Direct CTA routes to internship cohorts and enterprise consultation.

### 4. Technology Programs Section
- **Dynamic Category Filter**: Filter courses by domain (*All*, *Web & Full Stack*, *Cloud & DevOps*, *Data & AI*, *Mobile & Systems*).
- Program cards detailing course duration, learning mode, comprehensive bullet points, tech tags, and direct enrollment triggers.
- Click-to-enroll buttons automatically populate the inquiry form with the selected course name.

### 5. IT & Digital Services Section
- Reusable business service cards covering:
  1. Custom Software & Web Development
  2. Cloud Migration & DevOps Automation
  3. Mobile App Development (iOS & Android)
  4. Digital Transformation & IT Consulting
  5. UI/UX Design & Product Strategy
  6. QA & Test Automation

### 6. Internship & Industrial Training Section
- Structured 3-Phase Roadmap (Foundation & Tooling, Core Engineering, Live Capstone & Deployment).
- Key intern benefits: Verified certificate, real GitHub commits, 1-on-1 mentorship, and placement assistance.
- Detailed track descriptions for Web Development, Cloud/DevOps, and Data Engineering interns with a quick-apply trigger.

### 7. Student & Client Testimonials Section *(Added Nov 05, 2026)*
- 5-Star verified review cards from alumni interns and corporate clients.
- Real quotes showcasing career outcomes, interview success, and enterprise delivery quality.

### 8. Interactive FAQ Accordion
- Accessible expand/collapse accordion implemented with `aria-expanded` and `hidden` attributes.
- Auto-collapses other open questions when a new item is selected.
- Answers real-world questions on eligibility, remote participation, project authenticity, and enterprise consulting.

### 9. Contact & Inquiry Section
- Multi-channel contact information (Office address, email addresses, phone lines, operating hours).
- Location campus summary card.
- **Client-Side Form Validation**:
  - Full Name validation (minimum length check).
  - Regular expression email format verification.
  - Phone number validation (at least 10 digits).
  - Required dropdown selector check.
  - Message length validation (minimum 15 characters).
  - Inline error messaging and visual focus styling.
  - Asynchronous submission simulation with spinner and success feedback alert.

### 10. Back-to-Top Floating Button
- Appears smoothly after scrolling down 350px.
- Smoothly animates the viewport back to the top when clicked.

---

## 🛠️ Getting Started / How to Run

No installation, build tools, or extra libraries required.

Simply double-click or open **`index.html`** in any web browser (Chrome, Edge, Firefox, or Safari).

---

## 🌿 Git Version Control

To initialize and manage this project with Git:

```bash
# Check status
git status

# Stage all files
git add .

# Create initial commit
git commit -m "feat: complete Veda Technology business and services website"

# Push to GitHub (replace with your repository URL)
git branch -M main
git remote add origin https://github.com/your-username/veda-technology-website.git
git push -u origin main
```

---

## 📱 Browser Compatibility & Accessibility

- **Browsers**: Tested and fully functional across all modern Chromium browsers, Firefox, Safari, and Edge.
- **Accessibility (A11y)**:
  - Skip link (`Skip to main content`) for keyboard and screen-reader navigation.
  - Proper ARIA states (`aria-expanded`, `aria-controls`, `aria-label`, `role="tab"`).
  - High-contrast color combinations conforming to WCAG AA guidelines.
  - Keyboard accessible navigation, accordions, and forms.

---

## 📄 License & Attribution

Created for the **Veda Technology Business & Services Website Assessment**.  
All rights reserved © 2026 Veda Technology.

