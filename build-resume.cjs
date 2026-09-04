const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const profileImagePath = path.join(__dirname, 'public', 'images', 'profile.jpg');
const profileFallback = path.join(__dirname, 'public', 'images', 'profile.jpg.jpeg');
let profileBase64 = '';

if (fs.existsSync(profileImagePath)) {
  profileBase64 = fs.readFileSync(profileImagePath).toString('base64');
} else if (fs.existsSync(profileFallback)) {
  profileBase64 = fs.readFileSync(profileFallback).toString('base64');
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ali Zain - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #ffffff;
      color: #1e293b;
      font-size: 11.5px;
      line-height: 1.45;
      letter-spacing: -0.01em;
    }

    .resume-page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 10mm 13mm 10mm 13mm;
      margin: 0 auto;
      background: #ffffff;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Subtle top accent bar */
    .top-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #0284c7 0%, #0ea5e9 40%, #06b6d4 70%, #10b981 100%);
    }

    /* Header styling */
    .header {
      display: grid;
      grid-template-columns: 78px 1fr;
      gap: 16px;
      align-items: center;
      padding-bottom: 11px;
      border-bottom: 1.5px solid #e2e8f0;
    }

    .profile-photo {
      width: 78px;
      height: 78px;
      border-radius: 14px;
      object-fit: cover;
      border: 2px solid #0ea5e9;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
    }

    .name-title-wrap h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .subtitle {
      font-size: 12.5px;
      font-weight: 600;
      color: #0284c7;
      margin-top: 3px;
      margin-bottom: 7px;
    }

    .contact-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 16px;
      font-size: 10.5px;
      color: #475569;
      font-weight: 500;
    }

    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .contact-item svg {
      width: 12px;
      height: 12px;
      color: #0284c7;
      flex-shrink: 0;
    }

    .contact-item a {
      color: #334155;
      text-decoration: none;
    }

    /* Summary */
    .summary-box {
      margin-top: 9px;
      padding: 7px 11px;
      background: #f8fafc;
      border-left: 3px solid #0284c7;
      border-radius: 0 6px 6px 0;
      font-size: 11px;
      color: #334155;
      line-height: 1.45;
    }

    /* Main 2-column layout */
    .main-grid {
      display: grid;
      grid-template-columns: 1fr 68mm;
      gap: 16px;
      margin-top: 11px;
      flex: 1;
    }

    /* Section Headings */
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #0f172a;
      margin-bottom: 7px;
      padding-bottom: 3px;
      border-bottom: 1.5px solid #e2e8f0;
    }

    .section-header svg {
      width: 14px;
      height: 14px;
      color: #0284c7;
    }

    /* Projects Cards */
    .project-card {
      margin-bottom: 9px;
      padding-bottom: 8px;
      border-bottom: 1px dashed #e2e8f0;
    }

    .project-card:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .project-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }

    .project-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #0f172a;
    }

    .project-role {
      font-size: 10px;
      font-weight: 600;
      color: #0284c7;
      background: #f0f9ff;
      padding: 1px 6px;
      border-radius: 4px;
    }

    .project-desc {
      font-size: 10.8px;
      color: #334155;
      line-height: 1.4;
      margin-bottom: 4px;
    }

    .project-highlights {
      font-size: 10.5px;
      color: #475569;
      line-height: 1.38;
      margin-bottom: 5px;
      padding-left: 13px;
    }

    .project-highlights li {
      margin-bottom: 2px;
    }

    .tag-container {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .tag {
      font-size: 9.5px;
      font-weight: 600;
      padding: 1.5px 6px;
      border-radius: 4px;
      background: #f1f5f9;
      color: #334155;
    }

    .tag.primary {
      background: #e0f2fe;
      color: #0369a1;
    }

    /* Right Sidebar styling */
    .sidebar-section {
      margin-bottom: 11px;
    }

    .sidebar-section:last-child {
      margin-bottom: 0;
    }

    .skill-group {
      margin-bottom: 6px;
    }

    .skill-label {
      font-size: 10.5px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .skill-items {
      font-size: 10.5px;
      color: #475569;
      line-height: 1.35;
    }

    /* Highlights list */
    .achievement-item {
      display: flex;
      gap: 6px;
      align-items: flex-start;
      margin-bottom: 5px;
      font-size: 10.5px;
      color: #334155;
      line-height: 1.35;
    }

    .achievement-icon {
      color: #0284c7;
      font-weight: bold;
      flex-shrink: 0;
    }

    .info-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 4px;
      background: #f1f5f9;
      color: #334155;
      margin: 2px 3px 2px 0;
    }
  </style>
</head>
<body>
  <div class="resume-page">
    <div class="top-accent"></div>

    <!-- Header -->
    <header class="header">
      <img src="data:image/jpeg;base64,${profileBase64}" alt="Ali Zain" class="profile-photo">
      <div class="name-title-wrap">
        <h1>Ali Zain</h1>
        <div class="subtitle">Full-Stack Developer &bull; AI Builder &bull; Student Developer</div>
        <div class="contact-bar">
          <div class="contact-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <a href="mailto:energetickids02@gmail.com">energetickids02@gmail.com</a>
          </div>
          <div class="contact-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            <a href="https://github.com/az201214">github.com/az201214</a>
          </div>
          <div class="contact-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
            <a href="https://az201214.github.io/My-Portfolio/">az201214.github.io/My-Portfolio</a>
          </div>
          <div class="contact-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
            <span>Grade 9 (O Levels) &bull; Age: 14</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Professional Summary -->
    <div class="summary-box">
      Student developer and hands-on AI builder driven by creating end-to-end web, mobile, and intelligent software systems. Specializing in TypeScript, Next.js, Supabase, Flutter, and AI model integration, turning complex requirements into production-ready, performant products with high aesthetic standards.
    </div>

    <!-- Main Content -->
    <div class="main-grid">
      <!-- Left Column: Featured Projects & Open Source -->
      <div>
        <div class="section-header">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          Featured Projects
        </div>

        <!-- Project 1: NexusInsight CRM -->
        <div class="project-card">
          <div class="project-head">
            <span class="project-title">NexusInsight CRM</span>
            <span class="project-role">Creator &amp; Full-Stack Dev</span>
          </div>
          <div class="project-desc">A full-stack multi-tenant B2B workspace and CRM system designed for structured team collaboration and pipeline management.</div>
          <ul class="project-highlights">
            <li>Engineered multi-tenant data architecture with role-based access control (RBAC).</li>
            <li>Implemented workspace management, task boards, and real-time database sync.</li>
            <li>Built complete UI design system with responsive layouts and automated workflows.</li>
          </ul>
          <div class="tag-container">
            <span class="tag primary">TypeScript</span>
            <span class="tag primary">Next.js</span>
            <span class="tag primary">Supabase</span>
            <span class="tag">PostgreSQL</span>
            <span class="tag">Tailwind CSS</span>
          </div>
        </div>

        <!-- Project 2: Rally -->
        <div class="project-card">
          <div class="project-head">
            <span class="project-title">Rally &mdash; Sports Matchmaking Platform</span>
            <span class="project-role">Mobile App Lead</span>
          </div>
          <div class="project-desc">Cross-platform mobile application matching padel players and groups based on location, skill level, and schedule availability.</div>
          <ul class="project-highlights">
            <li>Designed interactive matchmaking algorithm for solo players and incomplete doubles pairs.</li>
            <li>Integrated real-time database and cloud messaging for live notifications and instant chat.</li>
            <li>Optimized native-feel smooth UI transitions across both iOS and Android.</li>
          </ul>
          <div class="tag-container">
            <span class="tag primary">Flutter</span>
            <span class="tag primary">Dart</span>
            <span class="tag primary">Firebase</span>
            <span class="tag">Cloud Firestore</span>
            <span class="tag">Realtime Sync</span>
          </div>
        </div>

        <!-- Project 3: Meetily -->
        <div class="project-card">
          <div class="project-head">
            <span class="project-title">Meetily &mdash; AI Meeting Assistant</span>
            <span class="project-role">Open-Source Contributor</span>
          </div>
          <div class="project-desc">Exploration into privacy-first AI meeting intelligence utilizing local speech models and offline LLMs.</div>
          <ul class="project-highlights">
            <li>Forked and adapted an open-source codebase to integrate localized Whisper models.</li>
            <li>Engineered automated summarization and action-item extraction workflows via Ollama.</li>
            <li>Contributed improvements to backend concurrency and system performance.</li>
          </ul>
          <div class="tag-container">
            <span class="tag primary">Rust</span>
            <span class="tag primary">Whisper</span>
            <span class="tag primary">Ollama</span>
            <span class="tag">Local LLMs</span>
            <span class="tag">Audio Processing</span>
          </div>
        </div>

        <!-- Project 4: Interactive 3D Portfolio -->
        <div class="project-card">
          <div class="project-head">
            <span class="project-title">3D Interactive Web Portfolio</span>
            <span class="project-role">Sole Developer</span>
          </div>
          <div class="project-desc">Immersive 3D web experience with encrypted GLTF assets, dynamic studio lighting, and smooth GSAP scroll interactions.</div>
          <div class="tag-container" style="margin-top: 4px;">
            <span class="tag primary">Three.js</span>
            <span class="tag primary">React Three Fiber</span>
            <span class="tag">GSAP</span>
            <span class="tag">TypeScript</span>
            <span class="tag">WebGL</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Skills, Education & Achievements -->
      <div>
        <!-- Technical Skills -->
        <div class="sidebar-section">
          <div class="section-header">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            Technical Skills
          </div>

          <div class="skill-group">
            <div class="skill-label">Languages</div>
            <div class="skill-items">TypeScript, JavaScript, Dart, Rust, HTML5, CSS3, SQL</div>
          </div>

          <div class="skill-group">
            <div class="skill-label">Frontend &amp; Mobile</div>
            <div class="skill-items">React, Next.js, Vite, Tailwind CSS, Flutter, Android</div>
          </div>

          <div class="skill-group">
            <div class="skill-label">Backend &amp; Database</div>
            <div class="skill-items">Node.js, Express, Supabase (PostgreSQL), Firebase, REST APIs</div>
          </div>

          <div class="skill-group">
            <div class="skill-label">AI &amp; Emerging Tech</div>
            <div class="skill-items">LLM Integration, Ollama, Whisper, Generative AI, Automation</div>
          </div>

          <div class="skill-group">
            <div class="skill-label">3D &amp; Creative Web</div>
            <div class="skill-items">Three.js, React Three Fiber, React Three Drei, WebGL, GSAP</div>
          </div>

          <div class="skill-group">
            <div class="skill-label">DevOps &amp; Practices</div>
            <div class="skill-items">Git, GitHub Actions, Auth/RBAC, Unit &amp; E2E Testing, Performance</div>
          </div>
        </div>

        <!-- Education -->
        <div class="sidebar-section">
          <div class="section-header">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/></svg>
            Education
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #0f172a;">O Levels (Cambridge Curriculum)</div>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">Grade 9 &bull; Current</div>
          <div style="font-size: 10.5px; color: #475569;">Focus on Sciences, Mathematics &amp; Computer Science.</div>
        </div>

        <!-- Honors & Achievements -->
        <div class="sidebar-section">
          <div class="section-header">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            Achievements
          </div>
          <div class="achievement-item">
            <span class="achievement-icon">&bull;</span>
            <div><strong>Top 10 Finalist</strong> &mdash; Code Bash Programming Competition</div>
          </div>
          <div class="achievement-item">
            <span class="achievement-icon">&bull;</span>
            <div><strong>1st Academic Position</strong> &mdash; School Grades 6, 7 &amp; 8 (consecutively)</div>
          </div>
        </div>

        <!-- Languages & Interests -->
        <div class="sidebar-section">
          <div class="section-header">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg>
            Languages &amp; Focus
          </div>
          <div style="margin-bottom: 5px;">
            <span class="info-badge">English (Fluent)</span>
            <span class="info-badge">Urdu (Native)</span>
          </div>
          <div>
            <span class="info-badge">AI Systems</span>
            <span class="info-badge">Full-Stack SaaS</span>
            <span class="info-badge">Mobile Apps</span>
            <span class="info-badge">Padel</span>
            <span class="info-badge">Cricket</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</body>
</html>`;

// Write the updated professional resume HTML
const resumeHtmlPath = path.join(__dirname, 'resume.html');
fs.writeFileSync(resumeHtmlPath, htmlContent, 'utf8');
console.log('Updated resume.html successfully.');

// Target output PDF locations
const rootPdfPath = path.join(__dirname, 'Ali_Zain_Resume.pdf');
const publicPdfPath = path.join(__dirname, 'public', 'Ali_Zain_Resume.pdf');

// Chrome executable
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

console.log('Generating PDF via headless Chrome...');
execFileSync(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--no-pdf-header-footer',
  '--print-to-pdf=' + rootPdfPath,
  'file:///' + resumeHtmlPath.replace(/\\/g, '/')
]);

if (fs.existsSync(rootPdfPath)) {
  const stats = fs.statSync(rootPdfPath);
  console.log('Successfully generated ' + rootPdfPath + ' (' + stats.size + ' bytes)');
  // Also copy to public/Ali_Zain_Resume.pdf so portfolio resume button serves latest
  fs.copyFileSync(rootPdfPath, publicPdfPath);
  console.log('Successfully copied to ' + publicPdfPath);
} else {
  throw new Error('PDF file was not created.');
}
