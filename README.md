# Self as System — v2 (Inverse Decay)

An interactive, generative canvas experience exploring the tension between user agency and systemic entropy. In motion, the artwork maintains an orderly, electric cyan vector environment. Upon stillness, the system undergoes a progressive 10-second decay into chaotic visual and auditory turmoil.

## Live Demo
- **Live Deployment:** https://aiself-awareness.vercel.app
- **Repository:** https://github.com/GlassC0ffin/self-as-system-build-v2

## System Mechanics & Concept
- **Order via Agency:** Active cursor velocity maintains systemic control, anchoring cyan vector triangles into smooth trajectory dampening and steady orientation.
- **10-Second Chaos Ramp:** Halting movement initiates an escalating 600-frame (~10 second) idle decay curve (`RAMP_TIME = 600`).
- **Visual Turmoil:** Extended stillness triggers erratic trajectory thrusts, screen wrapping, dynamic size pulsing, positional jiggling, strobe flashing, and a color shift from electric cyan (`#00f3ff`) into a full dynamic HSL rainbow spectrum.
- **Procedural Glitch Audio:** Powered by the Web Audio API, real-time sawtooth and square wave noise bursts synthesize procedural glitch sounds that scale in frequency and volume alongside the chaos level (unlocked on user click/interaction).

## Tech Stack
- **Visuals:** HTML5 Canvas API & Vanilla JavaScript (ES6+)
- **Audio Engine:** Web Audio API (procedural synthesis)
- **Styling:** CSS3

## Setup & Local Execution
1. Clone the repository:
   ```bash
   git clone [https://github.com/GlassC0ffin/self-as-system-build-v2.git](https://github.com/GlassC0ffin/self-as-system-build-v2.git)