import { useRef, useEffect, useCallback, useMemo } from 'react'
import { useTheme } from '../../context/ThemeContext'

/* ═══════════════════════════════════════════════════════════════
   THEME CONFIGS — extracted from Dark Theme.html & Bright Theme.html
   ═══════════════════════════════════════════════════════════════ */

const THEMES = {
  dark: {
    stageBg: '#04061a',
    wallStops: {
      a: { s: '#0a0e28', e: '#12173a' },
      b: { s: '#1b2158', e: '#262c6e' },
      c: { s: '#342f7a', e: '#453fa0' },
    },
    blob: { fill: '#6a5fd0', opacityStart: 0.16, opacityEnd: 0.26 },
    lightRay: 'radial-gradient(ellipse at 88% 55%, #5a4fd066 0%, transparent 60%)',
    lightRayBlend: 'screen',
    lightRayOpacity: 0.6,
    desk: { top: '#3a3226', bottom: '#241f18' },
    deskShadow: 'inset 0 12px 30px rgba(0,0,0,.4)',
    deskGrainOpacity: 0.15,
    deskGrainColor: 'rgba(255,255,255,.15)',
    ink: '#e8ecff',
    cardShadow: '0 12px 26px rgba(0,0,0,.5), 0 2px 4px rgba(0,0,0,.3)',
    // Object colors
    exam: '#c9c3e8',
    syllabus: '#a9b4dd',
    quiz: '#b8bfe0',
    study: '#e7c468',
    revisionNeeded: '#c9a8dd',
    revisionDone: '#f4f2ee',
    revisionDoneLabel: '#2f8f5c',
    planFace: '#f4f2ee',
    planLabel: '#2b2b28',
    planValue: '#5a5a52',
    planSub: '#6b6b62',
    restLabel: '#2b2b28',
    // Books
    book1: 'linear-gradient(90deg,#2f6f8f,#4a8fae)',
    book2: 'linear-gradient(90deg,#6c5faa,#8d7fc9)',
    book3: 'linear-gradient(90deg,#9b6f9c,#b98fb8)',
    // Notebook
    notebookPage: '#dfe1ef',
    notebookSpine: '#8478b0',
    notebookClosed: 'linear-gradient(135deg,#9d90ce,#6f62a8)',
    notebookClosedAccent: '#5d5090',
    // Pen
    pen: 'linear-gradient(90deg,#1a1a1a,#050505)',
    penAccent: '#c9a45a',
    // Pen cup
    cupBg: 'linear-gradient(180deg,#6a6fa0,#4f5482)',
    stick1: '#7fd8e8',
    stick2: '#e8c468',
    stick3: '#e390b8',
    // Clock
    clockBg: 'radial-gradient(circle at 35% 30%,#8f96c4,#5b5f95)',
    clockShadow: '0 12px 24px rgba(0,0,0,.5), inset 0 0 0 4% #ffffff1a',
    clockHands: '#1c1e33',
    // Plant
    potBg: 'linear-gradient(180deg,#e9e5dc,#c7bfae)',
    leaf1: '#7fa050',
    leaf2: '#6f9040',
    leaf3: '#7fa050',
    // Lamp
    lampPart: '#3f4470',
    lampHead: 'linear-gradient(180deg,#4c5188,#3f4470)',
    lampBeam: 'radial-gradient(ellipse at top,#ffe9b0cc,transparent 70%)',
    // Laptop
    laptop: 'linear-gradient(180deg,#4a5188,#333a68)',
    laptopIcon: '\\2726',
    laptopIconColor: '#fff',
    // Certificates
    certBg: 'linear-gradient(160deg,#8f8dbf,#6a6699)',
    certInner: '#f4f2ee',
    certBorder: '#cbc6e0',
    certText: '#3a3646',
    certLine: '#cbc6e0',
    certSeal: 'radial-gradient(circle,#e8c468,#c99a3a)',
    // Grad cap
    gradTop: 'linear-gradient(160deg,#6a5fa8,#4e4488)',
    gradBase: 'linear-gradient(180deg,#4e4488,#3a3268)',
    gradTassel: '#e8c468',
    // Diploma
    diplomaRoll: '#f4f2ee',
    diplomaRibbon: '#5b6fae',
    // HUD
    hudColor: '#e8ecff',
    hudShadow: '0 1px 4px rgba(0,0,0,.6)',
    progressBg: 'rgba(255,255,255,.12)',
    progressFill: '#7fd8e8',
    particleColor: '#e8ecff',
    // Glow paths
    glowStroke: '#7fd8e8',
  },
  light: {
    stageBg: '#0e1220',
    wallStops: {
      a: { s: '#4d5c7d', e: '#7a83a8' },
      b: { s: '#727aa0', e: '#a49dc9' },
      c: { s: '#9a92c4', e: '#d9d2ee' },
    },
    blob: { fill: '#ffffff', opacityStart: 0.10, opacityEnd: 0.22 },
    lightRay: 'radial-gradient(ellipse at 85% 15%, #fff8 0%, transparent 55%)',
    lightRayBlend: 'screen',
    lightRayOpacity: 0.5,
    desk: { top: '#c19a6a', bottom: '#a9825a' },
    deskShadow: 'inset 0 12px 24px rgba(0,0,0,.15)',
    deskGrainOpacity: 0.12,
    deskGrainColor: 'rgba(0,0,0,.4)',
    ink: '#f5f0e8',
    cardShadow: '0 10px 24px rgba(0,0,0,.28), 0 2px 4px rgba(0,0,0,.15)',
    exam: '#f0cdbd',
    syllabus: '#d7dcc2',
    quiz: '#dcdcdc',
    study: '#e7c468',
    revisionNeeded: '#efb3a8',
    revisionDone: '#fbfaf7',
    revisionDoneLabel: '#2f8f5c',
    planFace: '#f7f2e8',
    planLabel: '#2b2b28',
    planValue: '#5a5a52',
    planSub: '#6b6b62',
    restLabel: '#2b2b28',
    book1: 'linear-gradient(90deg,#5fa79b,#7fbfae)',
    book2: 'linear-gradient(90deg,#9788c4,#b6a8de)',
    book3: 'linear-gradient(90deg,#d68fa3,#e3b0c0)',
    notebookPage: '#f7f2e8',
    notebookSpine: '#c9a45a',
    notebookClosed: 'linear-gradient(135deg,#b9aede,#8d7fc0)',
    notebookClosedAccent: '#7c6fae',
    pen: 'linear-gradient(90deg,#2b2b2b,#111)',
    penAccent: '#c9a45a',
    cupBg: 'linear-gradient(180deg,#8891ab,#6b7490)',
    stick1: '#6fd6c4',
    stick2: '#e8c468',
    stick3: '#e3a0b0',
    clockBg: 'radial-gradient(circle at 35% 30%,#a9b1d1,#7c85a8)',
    clockShadow: '0 10px 20px rgba(0,0,0,.3), inset 0 0 0 4% #ffffff22',
    clockHands: '#2b2f45',
    potBg: 'linear-gradient(180deg,#f2ede2,#ddd5c4)',
    leaf1: '#8fae5c',
    leaf2: '#7fa050',
    leaf3: '#8fae5c',
    lampPart: '#6d7690',
    lampHead: 'linear-gradient(180deg,#7d86a0,#6d7690)',
    lampBeam: 'radial-gradient(ellipse at top, #ffe9b0aa, transparent 70%)',
    laptop: 'linear-gradient(180deg,#8b93b3,#6f7796)',
    laptopIcon: '',
    laptopIconColor: '#fff',
    certBg: 'linear-gradient(160deg,#cba876,#a9825a)',
    certInner: '#f7f2e8',
    certBorder: '#cbb98f',
    certText: '#4a4436',
    certLine: '#cbb98f',
    certSeal: 'radial-gradient(circle,#e8c468,#c99a3a)',
    gradTop: 'linear-gradient(160deg,#9789c9,#7c6fae)',
    gradBase: 'linear-gradient(180deg,#7c6fae,#655a94)',
    gradTassel: '#e8c468',
    diplomaRoll: '#f7f2e8',
    diplomaRibbon: '#5b6fae',
    hudColor: '#f5f0e8',
    hudShadow: '0 1px 3px rgba(0,0,0,.4)',
    progressBg: 'rgba(255,255,255,.15)',
    progressFill: '#6fd6c4',
    particleColor: '#f5f0e8',
    glowStroke: '#6fd6c4',
  },
}

/* ═══════════════════════════════════════════════════════════════
   OBJECT DATA — shared between themes
   l=left%, t=top%, w=width%, r=rotation, op=opacity
   range=[startProgress, endProgress]
   ═══════════════════════════════════════════════════════════════ */

// Dark theme objects
const DARK_OBJECTS = [
  { id: 'card-exam', start: { l: 18, t: 16, w: 9.6, r: -3, op: 1 }, end: { l: 10, t: -8, w: 6, r: -18, op: 0 }, range: [0.18, 0.62], aspect: '1.15' },
  { id: 'card-study', start: { l: 36, t: 23.5, w: 10, r: 2, op: 1 }, end: { l: 28, t: 19.5, w: 10.4, r: -1, op: 1 }, range: [0.5, 0.92], aspect: '1.39' },
  { id: 'card-syllabus', start: { l: 17.9, t: 36.2, w: 10.5, r: -2, op: 1 }, end: { l: 32.1, t: 29.8, w: 12.2, r: 0, op: 0 }, range: [0.24, 0.7], aspect: '1.18' },
  { id: 'card-blank', start: { l: 17.9, t: 36.2, w: 10.5, r: 0, op: 0 }, end: { l: 43, t: 24, w: 9.5, r: 0, op: 1 }, range: [0.62, 0.84], aspect: '1.05' },
  { id: 'card-quiz', start: { l: 36.7, t: 39.9, w: 10.6, r: 1, op: 1 }, end: { l: 50, t: 68, w: 5.5, r: 18, op: 0 }, range: [0.26, 0.68], aspect: '1.26' },
  { id: 'card-rev-need', start: { l: 23.6, t: 52.3, w: 9.2, r: -1, op: 1 }, end: { l: 46.6, t: 31.4, w: 10.3, r: 1, op: 0 }, range: [0.28, 0.78], aspect: '1.0' },
  { id: 'card-rev-done', start: { l: 23.6, t: 52.3, w: 9.2, r: -1, op: 0 }, end: { l: 56, t: 31, w: 10.3, r: 1, op: 1 }, range: [0.6, 0.86], aspect: '1.32' },
  { id: 'card-plan', start: { l: 90.5, t: 66, w: 9.7, r: 0, op: 1 }, end: { l: 88, t: 78, w: 10, r: 0, op: 0 }, range: [0.5, 0.85], aspect: '0.77' },
  { id: 'card-rest', start: { l: 88, t: 78, w: 13, r: 0, op: 0 }, end: { l: 90, t: 75, w: 12.5, r: 0, op: 1 }, range: [0.8, 0.98], aspect: '1.15' },
  { id: 'books', start: { l: 7.8, t: 81, w: 15.7, r: 0, op: 1 }, end: { l: 8.2, t: 85, w: 16.4, r: 0, op: 1 }, range: [0.1, 0.95], aspect: '1.08' },
  { id: 'notebook-open', start: { l: 33.4, t: 78.5, w: 42.3, r: 0, op: 1 }, end: { l: 33.4, t: 78.5, w: 30, r: -8, op: 0 }, range: [0.55, 0.72], aspect: '3.6', z: 9 },
  { id: 'notebook-closed', start: { l: 40, t: 80, w: 29, r: 10, op: 0 }, end: { l: 42, t: 75, w: 28.6, r: 0, op: 1 }, range: [0.6, 0.78], aspect: '2.4', z: 9 },
  { id: 'pen', start: { l: 44.5, t: 76.5, w: 9, r: 22, op: 1 }, end: { l: 49, t: 75.6, w: 8, r: 18, op: 1 }, range: [0.05, 0.98], aspect: '6.2', z: 12 },
  { id: 'pencup', start: { l: 38.6, t: 60.7, w: 8, r: 0, op: 1 }, end: { l: 34.9, t: 57.4, w: 8.4, r: 0, op: 1 }, range: [0.3, 0.85], aspect: '0.63' },
  { id: 'clock', start: { l: 48.4, t: 62.6, w: 10, r: 0, op: 1 }, end: { l: 45.2, t: 61.7, w: 9.5, r: 0, op: 1 }, range: [0.3, 0.85], aspect: '0.97' },
  { id: 'plant', start: { l: 67.5, t: 62.4, w: 9.4, r: 0, op: 1 }, end: { l: 61, t: 52, w: 7, r: 0, op: 1 }, range: [0.4, 0.9], aspect: '0.9', z: 11 },
  { id: 'lamp', start: { l: 78.3, t: 50, w: 12.5, r: 0, op: 1 }, end: { l: 78, t: 52, w: 9.5, r: 0, op: 1 }, range: [0.35, 0.9], aspect: '0.44', z: 11 },
  { id: 'laptop', start: { l: 69, t: 74.1, w: 32, r: 0, op: 1 }, end: { l: 63, t: 71, w: 25, r: 0, op: 1 }, range: [0.4, 0.9], aspect: '5.1', z: 9 },
  { id: 'cert2', start: { l: 72, t: 110, w: 11, r: 2, op: 0 }, end: { l: 68, t: 45, w: 12.5, r: 0, op: 1 }, range: [0.68, 0.94], aspect: '0.83', z: 8 },
  { id: 'cert1', start: { l: 58, t: 112, w: 12.5, r: -3, op: 0 }, end: { l: 57, t: 49, w: 14, r: -2, op: 1 }, range: [0.72, 0.96], aspect: '1.08', z: 8 },
  { id: 'gradcap', start: { l: 54, t: 112, w: 9.7, r: -6, op: 0 }, end: { l: 56, t: 61, w: 10, r: 0, op: 1 }, range: [0.7, 0.95], aspect: '1.25', z: 9 },
  { id: 'diploma', start: { l: 65, t: 112, w: 11.5, r: 8, op: 0 }, end: { l: 66, t: 62, w: 10, r: 3, op: 1 }, range: [0.73, 0.96], aspect: '2.7', z: 9 },
]

// Light theme objects (different positions for some items)
const LIGHT_OBJECTS = [
  { id: 'card-exam', start: { l: 17.8, t: 16, w: 9.6, r: -3, op: 1 }, end: { l: 10, t: -8, w: 6, r: -18, op: 0 }, range: [0.18, 0.62], aspect: '1.15' },
  { id: 'card-study', start: { l: 36.2, t: 23.7, w: 10, r: 2, op: 1 }, end: { l: 36.4, t: 21, w: 10.2, r: -1, op: 1 }, range: [0.5, 0.92], aspect: '1.39' },
  { id: 'card-syllabus', start: { l: 17.7, t: 36, w: 10.3, r: -2, op: 1 }, end: { l: 6, t: 68, w: 5.5, r: -24, op: 0 }, range: [0.22, 0.66], aspect: '1.18' },
  { id: 'card-quiz', start: { l: 36.6, t: 39.7, w: 10.6, r: 1, op: 1 }, end: { l: 50, t: 68, w: 5.5, r: 18, op: 0 }, range: [0.26, 0.68], aspect: '1.26' },
  { id: 'card-rev-need', start: { l: 23.1, t: 52, w: 8.75, r: -1, op: 1 }, end: { l: 48, t: 31.5, w: 10.3, r: 1, op: 0 }, range: [0.28, 0.78], aspect: '1.0' },
  { id: 'card-rev-done', start: { l: 23.1, t: 52, w: 8.75, r: -1, op: 0 }, end: { l: 48, t: 31.5, w: 10.3, r: 1, op: 1 }, range: [0.6, 0.86], aspect: '1.32' },
  { id: 'card-plan', start: { l: 91.5, t: 66, w: 9.5, r: 0, op: 1 }, end: { l: 91.5, t: 78, w: 10, r: 0, op: 0 }, range: [0.5, 0.85], aspect: '0.77' },
  { id: 'card-rest', start: { l: 91.5, t: 78, w: 13, r: 0, op: 0 }, end: { l: 90, t: 78, w: 13.5, r: 0, op: 1 }, range: [0.8, 0.98], aspect: '1.2' },
  { id: 'books', start: { l: 8, t: 81, w: 15.8, r: 0, op: 1 }, end: { l: 8, t: 85, w: 16.6, r: 0, op: 1 }, range: [0.1, 0.95], aspect: '1.08' },
  { id: 'notebook-open', start: { l: 33.6, t: 78.5, w: 41, r: 0, op: 1 }, end: { l: 33.6, t: 78.5, w: 30, r: -8, op: 0 }, range: [0.55, 0.72], aspect: '3.6', z: 9 },
  { id: 'notebook-closed', start: { l: 40, t: 80, w: 29, r: 10, op: 0 }, end: { l: 45, t: 85, w: 29, r: 0, op: 1 }, range: [0.6, 0.78], aspect: '2.5', z: 9 },
  { id: 'pen', start: { l: 45, t: 76.5, w: 9, r: 22, op: 1 }, end: { l: 52, t: 81.5, w: 8, r: 18, op: 1 }, range: [0.05, 0.98], aspect: '6.2', z: 12 },
  { id: 'pencup', start: { l: 38.8, t: 60.7, w: 8.1, r: 0, op: 1 }, end: { l: 30, t: 90, w: 4, r: 0, op: 0 }, range: [0.42, 0.7], aspect: '0.63' },
  { id: 'clock', start: { l: 50, t: 62.7, w: 9.4, r: 0, op: 1 }, end: { l: 58, t: 92, w: 4, r: 0, op: 0 }, range: [0.44, 0.7], aspect: '0.97' },
  { id: 'plant', start: { l: 67.6, t: 62.5, w: 9.1, r: 0, op: 1 }, end: { l: 73, t: 90, w: 4, r: 0, op: 0 }, range: [0.46, 0.72], aspect: '0.9' },
  { id: 'lamp', start: { l: 80.3, t: 51, w: 11, r: 0, op: 1 }, end: { l: 85, t: 25, w: 5, r: 0, op: 0 }, range: [0.48, 0.74], aspect: '0.44' },
  { id: 'laptop', start: { l: 69.5, t: 76.5, w: 32.2, r: 0, op: 1 }, end: { l: 75, t: 98, w: 15, r: 0, op: 0 }, range: [0.4, 0.66], aspect: '5.1', z: 9 },
  { id: 'cert1', start: { l: 58, t: 110, w: 12, r: -4, op: 0 }, end: { l: 63, t: 80, w: 13.5, r: -3, op: 1 }, range: [0.68, 0.94], aspect: '1.08' },
  { id: 'cert2', start: { l: 72, t: 112, w: 12.5, r: 3, op: 0 }, end: { l: 76, t: 74, w: 13.5, r: 2, op: 1 }, range: [0.72, 0.96], aspect: '0.84' },
  { id: 'trophy1', start: { l: 80, t: 114, w: 4.5, r: 0, op: 0 }, end: { l: 83, t: 88, w: 4.8, r: 0, op: 1 }, range: [0.75, 0.96], aspect: '0.6' },
  { id: 'trophy2', start: { l: 88, t: 114, w: 4.5, r: 0, op: 0 }, end: { l: 90, t: 89, w: 4.8, r: 0, op: 1 }, range: [0.77, 0.97], aspect: '0.6' },
  { id: 'gradcap', start: { l: 54, t: 112, w: 10, r: -6, op: 0 }, end: { l: 56, t: 90, w: 10.5, r: 0, op: 1 }, range: [0.7, 0.95], aspect: '1.25' },
  { id: 'diploma', start: { l: 66, t: 112, w: 13, r: 8, op: 0 }, end: { l: 68, t: 91, w: 13.5, r: 3, op: 1 }, range: [0.73, 0.96], aspect: '2.7' },
]

const PHASES = [
  { end: 0.15, label: 'Observing your prep' },
  { end: 0.30, label: 'Mapping what matters' },
  { end: 0.50, label: 'Connecting the pieces' },
  { end: 0.70, label: 'Prioritizing weak spots' },
  { end: 0.86, label: 'Building your plan' },
  { end: 1.01, label: 'Ready to focus' },
]

/* ═══════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
function clamp01(v) {
  return Math.min(1, Math.max(0, v))
}
function lerp(a, b, t) {
  return a + (b - a) * t
}
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [n >> 16 & 255, n >> 8 & 255, n & 255]
}
function rgbToStr(rgb) {
  return `rgb(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0})`
}
function lerpColor(c1, c2, t) {
  const a = hexToRgb(c1), b = hexToRgb(c2)
  return rgbToStr([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)])
}

/* ═══════════════════════════════════════════════════════════════
   OBJECT RENDERERS — pure functions returning JSX for each object type
   ═══════════════════════════════════════════════════════════════ */

function RenderCardContent({ id, t }) {
  const c = t
  switch (id) {
    case 'card-exam':
      return <><div className="cs-pin" /><div className="cs-card" style={{ background: c.exam, boxShadow: c.cardShadow }}><div className="cs-label">Exam</div><div className="cs-value"><span className="cs-icon">📅</span>6 days left</div></div></>
    case 'card-study':
      return <><div className="cs-pin" /><div className="cs-card" style={{ background: c.study, boxShadow: c.cardShadow }}><div className="cs-label">Study time</div><div className="cs-value"><span className="cs-icon">⏱</span>3 hrs/day</div></div></>
    case 'card-syllabus':
      return <><div className="cs-pin" /><div className="cs-card" style={{ background: c.syllabus, boxShadow: c.cardShadow }}><div className="cs-label">Syllabus</div><div className="cs-value"><span className="cs-icon">📖</span>Many topics</div></div></>
    case 'card-blank':
      return <div className="cs-card" style={{ background: '#e4e6ef', boxShadow: c.cardShadow }} />
    case 'card-quiz':
      return <><div className="cs-pin" /><div className="cs-card" style={{ background: c.quiz, boxShadow: c.cardShadow }}><div className="cs-label">Quiz score</div><div className="cs-value"><span className="cs-icon">📊</span>6 / 10</div></div></>
    case 'card-rev-need':
      return <><div className="cs-pin" /><div className="cs-card" style={{ background: c.revisionNeeded, boxShadow: c.cardShadow }}><div className="cs-label">Revision</div><div className="cs-value"><span className="cs-icon">❗</span>Needed</div></div></>
    case 'card-rev-done':
      return <><div className="cs-pin" /><div className="cs-card" style={{ background: c.revisionDone, boxShadow: c.cardShadow }}><div className="cs-label" style={{ color: c.revisionDoneLabel }}>Revision</div><div className="cs-value"><span className="cs-icon" style={{ color: c.revisionDoneLabel }}>✔</span>Done</div></div></>
    case 'card-plan':
      return <div className="cs-tent"><div className="cs-tent-face" style={{ background: c.planFace, boxShadow: c.cardShadow }}><div className="cs-label" style={{ color: c.planLabel }}>Plan</div><div className="cs-value" style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(16px, 3vw, 30px)', color: c.planValue }}>?</div><div className="cs-sub" style={{ color: c.planSub }}>What to study next</div></div></div>
    case 'card-rest':
      return <div className="cs-tent"><div className="cs-tent-face" style={{ background: c.planFace, boxShadow: c.cardShadow }}><div className="cs-label" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 'clamp(11px, 2vw, 22px)', color: c.restLabel, letterSpacing: '.08em' }}>Rest</div></div></div>
    case 'books':
      return <div className="cs-books"><div className="cs-book" style={{ background: c.book1 }} /><div className="cs-book" style={{ background: c.book2 }} /><div className="cs-book" style={{ background: c.book3 }} /></div>
    case 'notebook-open':
      return <div className="cs-notebook-open"><div className="cs-page cs-page-l" style={{ background: c.notebookPage }} /><div className="cs-spine" style={{ background: c.notebookSpine }} /><div className="cs-page cs-page-r" style={{ background: c.notebookPage }} /></div>
    case 'notebook-closed':
      return <div className="cs-notebook-closed" style={{ background: c.notebookClosed }}><div className="cs-notebook-band" style={{ background: c.notebookClosedAccent }} /></div>
    case 'pen':
      return <div className="cs-pen" style={{ background: c.pen }}><div className="cs-pen-tip" style={{ background: c.penAccent }} /></div>
    case 'pencup':
      return <div className="cs-pencup"><div className="cs-cup" style={{ background: c.cupBg }} /><div className="cs-stick cs-s1" style={{ background: c.stick1 }} /><div className="cs-stick cs-s2" style={{ background: c.stick2 }} /><div className="cs-stick cs-s3" style={{ background: c.stick3 }} /></div>
    case 'clock':
      return <div className="cs-clock" style={{ background: c.clockBg, boxShadow: c.clockShadow }}><div className="cs-clock-hand cs-hour" style={{ background: c.clockHands }} /><div className="cs-clock-hand cs-min" style={{ background: c.clockHands }} /></div>
    case 'plant':
      return <div className="cs-plant"><div className="cs-pot" style={{ background: c.potBg }} /><div className="cs-leaf cs-l1" style={{ background: c.leaf1 }} /><div className="cs-leaf cs-l2" style={{ background: c.leaf2 }} /><div className="cs-leaf cs-l3" style={{ background: c.leaf3 }} /></div>
    case 'lamp':
      return <div className="cs-lamp"><div className="cs-lamp-beam" style={{ background: c.lampBeam }} /><div className="cs-lamp-head" style={{ background: c.lampHead }} /><div className="cs-lamp-stem" style={{ background: c.lampPart }} /><div className="cs-lamp-base" style={{ background: c.lampPart }} /></div>
    case 'laptop':
      return <div className="cs-laptop" style={{ background: c.laptop }}><div className="cs-laptop-icon" style={{ color: c.laptopIconColor }}>{c.laptopIcon || ''}</div></div>
    case 'cert1':
    case 'cert2':
      return <div className="cs-cert" style={{ background: c.certBg }}><div className="cs-cert-inner" style={{ background: c.certInner, border: `1px solid ${c.certBorder}` }}><span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 'clamp(9px,1.3vw,15px)', color: c.certText }}>Certificate</span><div className="cs-cert-line" style={{ background: c.certLine }} /><div className="cs-cert-line" style={{ background: c.certLine, width: '55%' }} /></div><div className="cs-cert-seal" style={{ background: c.certSeal }} /></div>
    case 'gradcap':
      return <div className="cs-gradcap"><div className="cs-grad-top" style={{ background: c.gradTop }} /><div className="cs-grad-base" style={{ background: c.gradBase }} /><div className="cs-grad-tassel" style={{ background: c.gradTassel }} /></div>
    case 'diploma':
      return <div className="cs-diploma"><div className="cs-diploma-roll" style={{ background: c.diplomaRoll }} /><div className="cs-diploma-ribbon" style={{ background: c.diplomaRibbon }} /></div>
    case 'trophy1':
    case 'trophy2':
      return <div className="cs-trophy"><div className="cs-trophy-cup" style={{ background: 'linear-gradient(160deg,#bfe8e0aa,#8fd0c5cc)' }} /><div className="cs-trophy-base" style={{ background: 'linear-gradient(160deg,#bfe8e0aa,#8fd0c5cc)' }} /></div>
    default:
      return null
  }
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function CinematicScroll({ scrollHeight = 600 }) {
  const { isDark } = useTheme()
  const wrapperRef = useRef(null)
  const stageRef = useRef(null)
  const wallRef = useRef(null)
  const blobPathRef = useRef(null)
  const hudRef = useRef(null)
  const progressFillRef = useRef(null)
  const objRefsMap = useRef({})
  const doodleRefs = useRef([])
  const connectRefs = useRef([])
  const lastLabelRef = useRef('')

  const theme = isDark ? THEMES.dark : THEMES.light
  const objects = isDark ? DARK_OBJECTS : LIGHT_OBJECTS

  // Create ref callbacks for objects
  const setObjRef = useCallback((id, el) => {
    if (el) objRefsMap.current[id] = el
  }, [])

  const update = useCallback((progress) => {
    const p = clamp01(progress)
    const eased = easeInOutCubic(p)
    const t = isDark ? THEMES.dark : THEMES.light
    const objs = isDark ? DARK_OBJECTS : LIGHT_OBJECTS

    // Update objects
    objs.forEach(cfg => {
      const el = objRefsMap.current[cfg.id]
      if (!el) return
      let local = (p - cfg.range[0]) / (cfg.range[1] - cfg.range[0])
      local = clamp01(local)
      const lt = easeInOutCubic(local)
      const left = lerp(cfg.start.l, cfg.end.l, lt)
      const top = lerp(cfg.start.t, cfg.end.t, lt)
      const w = lerp(cfg.start.w, cfg.end.w, lt)
      const rot = lerp(cfg.start.r || 0, cfg.end.r || 0, lt)
      const op = lerp(cfg.start.op != null ? cfg.start.op : 1, cfg.end.op != null ? cfg.end.op : 1, lt)
      el.style.left = left + '%'
      el.style.top = top + '%'
      el.style.width = w + '%'
      el.style.opacity = op
      el.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`
    })

    // Doodle draw-in
    doodleRefs.current.forEach(({ el, len }, i) => {
      if (!el || !len) return
      const drawT = clamp01((p - 0.04 - i * 0.015) / 0.2)
      const fadeT = clamp01((p - 0.62) / 0.18)
      el.style.strokeDashoffset = lerp(len, 0, easeInOutCubic(drawT))
      el.style.opacity = lerp(0.6, 0, easeInOutCubic(fadeT))
    })

    // Connection paths
    connectRefs.current.forEach(({ el, len }, i) => {
      if (!el || !len) return
      const drawT = clamp01((p - 0.30 - i * 0.04) / 0.18)
      const fadeT = clamp01((p - 0.68) / 0.14)
      el.style.strokeDashoffset = lerp(len, 0, easeInOutCubic(drawT))
      el.style.opacity = lerp(0, 0.9, easeInOutCubic(drawT)) * (1 - easeInOutCubic(fadeT))
    })

    // Wall gradient
    if (wallRef.current) {
      const c1 = lerpColor(t.wallStops.a.s, t.wallStops.a.e, eased)
      const c2 = lerpColor(t.wallStops.b.s, t.wallStops.b.e, eased)
      const c3 = lerpColor(t.wallStops.c.s, t.wallStops.c.e, eased)
      wallRef.current.style.background = `linear-gradient(135deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`
    }

    // Blob
    if (blobPathRef.current) {
      const blobScale = lerp(1, 1.15, eased)
      const blobOpacity = lerp(t.blob.opacityStart, t.blob.opacityEnd, eased)
      blobPathRef.current.style.opacity = blobOpacity
      blobPathRef.current.setAttribute('transform', `translate(800,500) scale(${blobScale}) translate(-800,-500)`)
    }

    // Camera push
    if (stageRef.current) {
      stageRef.current.style.transform = `scale(${lerp(1, 1.035, eased)})`
    }

    // Progress rail
    if (progressFillRef.current) {
      progressFillRef.current.style.height = (p * 100) + '%'
    }

    // HUD label
    if (hudRef.current) {
      const phase = PHASES.find(ph => p <= ph.end) || PHASES[PHASES.length - 1]
      if (phase.label !== lastLabelRef.current) {
        hudRef.current.style.opacity = '0'
        setTimeout(() => {
          if (hudRef.current) {
            hudRef.current.textContent = phase.label
            hudRef.current.style.opacity = '0.8'
          }
        }, 120)
        lastLabelRef.current = phase.label
      }
    }
  }, [isDark])

  useEffect(() => {
    // Initialize SVG path lengths
    const initPaths = () => {
      doodleRefs.current.forEach(({ el }) => {
        if (el) {
          const len = el.getTotalLength()
          el.style.strokeDasharray = len
          el.style.strokeDashoffset = len
          doodleRefs.current.find(d => d.el === el).len = len
        }
      })
      connectRefs.current.forEach(({ el }) => {
        if (el) {
          const len = el.getTotalLength()
          el.style.strokeDasharray = len
          el.style.strokeDashoffset = len
          connectRefs.current.find(d => d.el === el).len = len
        }
      })
    }

    const timer = setTimeout(initPaths, 100)

    const onScroll = () => {
      // Progress based on full page scroll height
      const total = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = total > 0 ? scrolled / total : 0
      requestAnimationFrame(() => update(progress))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [update])

  // Re-init paths when theme changes
  useEffect(() => {
    const timer = setTimeout(() => {
      doodleRefs.current.forEach(({ el }) => {
        if (el) {
          const len = el.getTotalLength()
          el.style.strokeDasharray = len
          el.style.strokeDashoffset = len
          doodleRefs.current.find(d => d.el === el).len = len
        }
      })
      connectRefs.current.forEach(({ el }) => {
        if (el) {
          const len = el.getTotalLength()
          el.style.strokeDasharray = len
          el.style.strokeDashoffset = len
          connectRefs.current.find(d => d.el === el).len = len
        }
      })
      // Re-trigger scroll to update positions
      const total = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = total > 0 ? scrolled / total : 0
      update(progress)
    }, 50)
    return () => clearTimeout(timer)
  }, [isDark, update])

  // Create stable doodle ref setters
  const setDoodleRef = useCallback((i) => (el) => {
    if (el) {
      doodleRefs.current[i] = { el, len: doodleRefs.current[i]?.len || 0 }
    }
  }, [])

  const setConnectRef = useCallback((i) => (el) => {
    if (el) {
      connectRefs.current[i] = { el, len: connectRefs.current[i]?.len || 0 }
    }
  }, [])

  return (
    <div ref={wrapperRef} className="cs-fixed-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <style>{`
        .cs-fixed-bg {
          position: fixed; inset: 0; z-index: 0;
          pointer-events: none;
        }
        .cs-viewport {
          position: absolute; inset: 0; width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; background: ${theme.stageBg};
          opacity: 0.35;
        }
        .cs-stage {
          position: relative; width: min(92vw, 158vh); height: min(80vh, 90vw * 0.625);
          border-radius: 18px; overflow: hidden;
          box-shadow: 0 40px 120px rgba(0,0,0,.6);
          transform-origin: center center; will-change: transform;
        }
        .cs-wall { position: absolute; inset: 0; z-index: 1; }
        .cs-blob { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .cs-light-ray {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          mix-blend-mode: ${theme.lightRayBlend}; opacity: ${theme.lightRayOpacity};
          background: ${theme.lightRay};
        }
        .cs-particles { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
        .cs-particle {
          position: absolute; width: 3px; height: 3px; border-radius: 50%;
          background: ${theme.particleColor}; opacity: 0;
          animation: cs-drift linear infinite;
        }
        @keyframes cs-drift {
          0% { opacity: 0; transform: translateY(0) translateX(0); }
          10% { opacity: 0.5; }
          90% { opacity: 0.35; }
          100% { opacity: 0; transform: translateY(-140px) translateX(20px); }
        }
        .cs-doodles {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          width: 100%; height: 100%;
        }
        .cs-doodles path, .cs-doodles circle {
          fill: none; stroke: ${theme.ink}; stroke-width: 2.4;
          stroke-linecap: round; stroke-linejoin: round;
          filter: drop-shadow(0 0 4px rgba(232,236,255,.35));
        }
        .cs-glow-path {
          fill: none; stroke: ${theme.glowStroke}; stroke-width: 3;
          stroke-linecap: round; opacity: 0;
          filter: drop-shadow(0 0 7px ${theme.glowStroke});
        }
        .cs-desk {
          position: absolute; left: 0; right: 0; bottom: 0; height: 44%; z-index: 6;
          background: linear-gradient(180deg, ${theme.desk.top} 0%, ${theme.desk.bottom} 100%);
          box-shadow: ${theme.deskShadow};
        }
        .cs-desk-grain {
          position: absolute; left: 0; right: 0; bottom: 0; height: 44%; z-index: 7;
          opacity: ${theme.deskGrainOpacity};
          background-image: repeating-linear-gradient(90deg, ${theme.deskGrainColor} 0 1px, transparent 1px 90px);
        }
        .cs-obj {
          position: absolute; transform: translate(-50%,-50%); z-index: 10;
          display: flex; align-items: center; justify-content: center;
        }
        .cs-card {
          width: 100%; height: 100%; border-radius: 10px;
          display: flex; flex-direction: column; justify-content: center;
          padding: 7% 9%; font-family: 'Quicksand', sans-serif;
        }
        .cs-label {
          font-size: clamp(9px, 1.35vw, 15px); font-weight: 700;
          letter-spacing: .03em; color: #26262f; text-transform: uppercase;
        }
        .cs-value {
          font-family: 'Inter', sans-serif; font-size: clamp(8px, 1.15vw, 13px);
          color: #3a3a44; margin-top: 6%; display: flex; align-items: center; gap: 6%;
        }
        .cs-icon { font-size: clamp(10px, 1.5vw, 18px); }
        .cs-sub {
          font-family: 'Inter', sans-serif; font-size: clamp(7px, 1vw, 11px);
          margin-top: 4%;
        }
        .cs-pin {
          position: absolute; top: -3%; left: 50%; transform: translateX(-50%);
          width: 9%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #fff8, #0006 70%); z-index: 2;
        }
        .cs-tent { width: 100%; height: 100%; position: relative; }
        .cs-tent-face {
          position: absolute; inset: 0; border-radius: 6px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          font-family: 'Quicksand', sans-serif; text-align: center; padding: 8%;
        }
        .cs-books { width: 100%; height: 100%; display: flex; flex-direction: column-reverse; gap: 4%; }
        .cs-book { width: 100%; flex: 1; border-radius: 3px 8px 8px 3px; box-shadow: 0 4px 12px rgba(0,0,0,.4); }
        .cs-notebook-open { width: 100%; height: 100%; position: relative; }
        .cs-page {
          position: absolute; top: 0; bottom: 0; width: 48%;
          border-radius: 2px 8px 8px 2px; box-shadow: 0 10px 22px rgba(0,0,0,.4);
        }
        .cs-page-l { left: 0; }
        .cs-page-r { right: 0; border-radius: 8px 2px 2px 8px; }
        .cs-spine { position: absolute; left: 48%; width: 4%; top: 2%; bottom: 2%; }
        .cs-notebook-closed {
          width: 100%; height: 100%; border-radius: 6px 10px 10px 6px;
          box-shadow: 0 12px 26px rgba(0,0,0,.5); position: relative;
        }
        .cs-notebook-band {
          position: absolute; right: 6%; top: 8%; bottom: 8%; width: 5%; border-radius: 2px;
        }
        .cs-pen {
          width: 100%; height: 100%; border-radius: 40% 4px 4px 40%;
          box-shadow: 0 5px 10px rgba(0,0,0,.5); position: relative;
        }
        .cs-pen-tip {
          position: absolute; left: 0; top: 35%; bottom: 35%; width: 14%; border-radius: 2px;
        }
        .cs-pencup { width: 100%; height: 100%; position: relative; }
        .cs-cup {
          position: absolute; bottom: 0; left: 10%; right: 10%; height: 55%;
          border-radius: 0 0 30% 30%/0 0 12% 12%;
        }
        .cs-stick { position: absolute; bottom: 40%; width: 9%; height: 60%; border-radius: 3px; }
        .cs-s1 { left: 28%; transform: rotate(-8deg); }
        .cs-s2 { left: 46%; transform: rotate(2deg); }
        .cs-s3 { left: 63%; transform: rotate(10deg); }
        .cs-clock {
          width: 100%; height: 100%; border-radius: 50%; position: relative;
        }
        .cs-clock-hand {
          position: absolute; left: 50%; top: 50%; border-radius: 2px;
          transform-origin: 0 0;
        }
        .cs-hour { width: 26%; height: 2.4%; transform: translate(0,-1.2%) rotate(-20deg); }
        .cs-min { width: 18%; height: 2.4%; transform: translate(0,-1.2%) rotate(70deg); }
        .cs-plant { width: 100%; height: 100%; position: relative; }
        .cs-pot {
          position: absolute; bottom: 0; left: 18%; right: 18%; height: 40%;
          border-radius: 0 0 18% 18%/0 0 30% 30%;
        }
        .cs-leaf {
          position: absolute; bottom: 32%; width: 26%; height: 42%;
          border-radius: 60% 10% 60% 10%;
        }
        .cs-l1 { left: 16%; transform: rotate(-18deg); }
        .cs-l2 { left: 38%; transform: rotate(4deg); }
        .cs-l3 { left: 56%; transform: rotate(22deg); }
        .cs-lamp { width: 100%; height: 100%; position: relative; }
        .cs-lamp-base {
          position: absolute; bottom: 0; left: 30%; right: 30%; height: 6%; border-radius: 6px;
        }
        .cs-lamp-stem {
          position: absolute; bottom: 6%; left: 47%; width: 5%; height: 60%; border-radius: 4px;
        }
        .cs-lamp-head {
          position: absolute; top: 0; left: 8%; right: 8%; height: 34%;
          border-radius: 50% 50% 20% 20%;
        }
        .cs-lamp-beam {
          position: absolute; top: 26%; left: 14%; right: 14%; height: 52%;
        }
        .cs-laptop {
          width: 100%; height: 100%; border-radius: 6px; position: relative;
        }
        .cs-laptop-icon {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
          opacity: .85; font-size: 180%; line-height: 1;
        }
        .cs-cert {
          width: 100%; height: 100%; border-radius: 4px; padding: 8%;
          box-shadow: 0 16px 30px rgba(0,0,0,.5);
        }
        .cs-cert-inner {
          width: 100%; height: 100%; border-radius: 2px;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 8%; padding: 6%;
        }
        .cs-cert-line { width: 70%; height: 6%; border-radius: 2px; }
        .cs-cert-seal {
          position: absolute; bottom: 6%; right: 10%; width: 14%; aspect-ratio: 1;
          border-radius: 50%;
        }
        .cs-gradcap { width: 100%; height: 100%; position: relative; }
        .cs-grad-top {
          position: absolute; top: 0; left: 0; right: 0; height: 45%;
          clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
        }
        .cs-grad-base {
          position: absolute; bottom: 0; left: 22%; right: 22%; height: 45%;
          border-radius: 0 0 6px 6px;
        }
        .cs-grad-tassel {
          position: absolute; top: 6%; right: 14%; width: 5%; height: 60%; border-radius: 2px;
        }
        .cs-diploma { width: 100%; height: 100%; position: relative; }
        .cs-diploma-roll {
          position: absolute; inset: 0; border-radius: 50px;
          box-shadow: 0 10px 20px rgba(0,0,0,.4);
        }
        .cs-diploma-ribbon {
          position: absolute; left: 50%; top: 20%; bottom: 20%; width: 16%;
          transform: translateX(-50%); border-radius: 2px;
        }
        .cs-trophy { width: 100%; height: 100%; position: relative; }
        .cs-trophy-cup {
          position: absolute; top: 0; left: 20%; right: 20%; height: 55%;
          border-radius: 10% 10% 50% 50%; box-shadow: 0 6px 14px rgba(0,0,0,.2);
        }
        .cs-trophy-base {
          position: absolute; bottom: 0; left: 30%; right: 30%; height: 18%;
        }
        .cs-hud {
          position: absolute; left: 22px; bottom: 20px; z-index: 50;
          font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: .16em;
          text-transform: uppercase; opacity: .8; transition: opacity .25s ease;
          color: ${theme.hudColor}; text-shadow: ${theme.hudShadow};
        }
        .cs-progress-rail {
          position: absolute; right: 16px; top: 8%; bottom: 8%; width: 3px;
          background: ${theme.progressBg}; z-index: 50; border-radius: 3px;
        }
        .cs-progress-fill {
          position: absolute; left: 0; top: 0; width: 100%; height: 0%;
          background: ${theme.progressFill}; border-radius: 3px;
        }
        @media (max-width: 640px) {
          .cs-stage { width: 94vw; }
        }
      `}</style>

      <div className="cs-viewport">
        <div className="cs-stage" ref={stageRef}>
          <div className="cs-wall" ref={wallRef} />

          <svg className="cs-blob" viewBox="0 0 1600 1000" preserveAspectRatio="none">
            <path ref={blobPathRef}
              d="M1080,-40 C1330,60 1650,260 1600,560 C1560,830 1260,1040 1010,1000 C920,985 960,700 1060,500 C1140,340 960,110 1080,-40 Z"
              fill={theme.blob.fill} opacity={theme.blob.opacityStart}
            />
          </svg>

          <div className="cs-light-ray" />

          <svg className="cs-doodles" viewBox="0 0 1600 1000" preserveAspectRatio="none">
            <path ref={setDoodleRef(0)} d="M410,150 C450,140 470,155 480,170" />
            <path ref={setDoodleRef(1)} d="M170,370 C220,360 250,375 260,390" />
            <path ref={setDoodleRef(2)} d="M480,540 C505,555 490,570 465,560" />
            <path ref={setDoodleRef(3)} d="M120,400 C90,430 60,420 55,390 C50,355 90,340 120,360 C150,380 130,420 95,425" />
            <path ref={setDoodleRef(4)} d="M715,375 C715,355 735,350 743,365 C750,378 733,382 733,398" />
            <path ref={setDoodleRef(5)} d="M580,120 l4,10 10,2 -8,7 2,10 -8,-6 -8,6 2,-10 -8,-7 10,-2 z" />
            <path ref={setConnectRef(0)} className="cs-glow-path" d="M280,160 C400,260 400,330 585,235" />
            <path ref={setConnectRef(1)} className="cs-glow-path" d="M280,360 C420,400 420,460 585,395" />
            <path ref={setConnectRef(2)} className="cs-glow-path" d="M330,510 C450,520 480,480 585,430" />
          </svg>

          {/* Particles */}
          <div className="cs-particles">
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="cs-particle" style={{
                left: (Math.random() * 100) + '%',
                top: (50 + Math.random() * 45) + '%',
                animationDuration: (6 + Math.random() * 8) + 's',
                animationDelay: (Math.random() * 8) + 's',
              }} />
            ))}
          </div>

          <div className="cs-desk" />
          <div className="cs-desk-grain" />

          {/* Objects */}
          {objects.map(obj => (
            <div
              key={obj.id}
              className="cs-obj"
              ref={(el) => setObjRef(obj.id, el)}
              style={{ aspectRatio: obj.aspect, zIndex: obj.z || 10 }}
            >
              <RenderCardContent id={obj.id} t={theme} />
            </div>
          ))}

          <div className="cs-hud" ref={hudRef}>Observing your prep</div>
          <div className="cs-progress-rail">
            <div className="cs-progress-fill" ref={progressFillRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
