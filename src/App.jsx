import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import creations from './components/creations'
import future from './components/future'
import journey from './components/journey'
import navbar from './components/navbar'
import origin from './components/origin'


import

  function App() {
    const [count, setCount] = useState(0)

    return (
      <>

        <div class="ember-root" ref="{{ setRoot }}"
          style="position:relative; height:100vh; width:100%; overflow:hidden; background:var(--void); color:var(--ash); font-family:'Hanken Grotesk',sans-serif; -webkit-font-smoothing:antialiased;">

          <canvas ref="{{ setCanvas }}"
            style="position:fixed; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;"></canvas>
          <div
            style="position:fixed; inset:0; z-index:1; pointer-events:none; background:radial-gradient(120% 90% at 50% 0%, rgba(233,162,59,.07), transparent 55%), radial-gradient(100% 70% at 50% 120%, rgba(194,105,58,.10), transparent 60%);">
          </div>

          <div ref="{{ setCursor }}"
            style="position:fixed; top:0; left:0; z-index:2; width:520px; height:520px; margin:-260px 0 0 -260px; border-radius:50%; pointer-events:none; mix-blend-mode:screen; opacity:0; transition:opacity .6s ease; background:radial-gradient(circle, rgba(255,196,107,.16), rgba(233,162,59,.05) 38%, transparent 65%);">
          </div>

          <navbar></navbar>

          <div class="ember-scene" ref="{{ setScene }}"
            style="position:relative; z-index:10; height:100vh; overflow-y:auto; overflow-x:hidden; scroll-behavior:smooth;">
            
            <origin></origin>

            <journey></journey>

            <creations></creations>

            <future></future>
            
          </div>

          <CreationDetailOverlay></CreationDetailOverlay>
        </div>
      </>
    )
  }
import CreationDetailOverlay from './components/creation-detail-overlay'

export default App
