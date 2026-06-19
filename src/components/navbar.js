import React from 'react'

function navbar() {
  return (
    <div>
      <div class="ember-nav"
        style="position:fixed; top:0; left:0; right:0; z-index:40; display:flex; align-items:center; justify-content:space-between; padding:22px 46px; backdrop-filter:blur(6px); background:linear-gradient(180deg, rgba(10,8,6,.72), rgba(10,8,6,0));">
        <div onClick="{{ goHome }}" style="display:flex; align-items:center; gap:11px; cursor:pointer;">
          <span
            style="width:11px; height:11px; border-radius:50%; background:var(--glow); box-shadow:0 0 14px var(--amber),0 0 28px rgba(233,162,59,.5); animation:flicker 3.2s infinite;"></span>
          <span
            style="font-family:'Anton',sans-serif; font-size:21px; letter-spacing:.42em; padding-left:.42em; color:var(--ash);">EMBER</span>
        </div>
        <div class="ember-chaps" style="display:flex; align-items:center; gap:34px;">
          <sc-for list="{{ nav }}" as="ch" hint-placeholder-count="4">
            <div onClick="{{ ch.go }}" style="cursor:pointer; display:flex; flex-direction:column; gap:6px;">
              <div style="display:flex; align-items:baseline; gap:8px;">
                <span
                  style="font-family:'Space Mono',monospace; font-size:10px; color:var(--amber); opacity:{{ ch.numOp }};">{{
                  ch.n }}</span>
                <span
                  style="font-family:'Oswald',sans-serif; font-weight:500; font-size:13px; letter-spacing:.22em; text-transform:uppercase; color:{{ ch.col }}; transition:color .4s;">{{
                  ch.label }}</span>
              </div>
              <span
                style="height:1px; width:100%; transform-origin:left; transform:scaleX({{ ch.barX }}); background:var(--amber); transition:transform .5s cubic-bezier(.16,1,.3,1);"></span>
            </div>
          </sc-for>
        </div>
      </div>
      <div style="position:fixed; top:0; left:0; right:0; z-index:41; height:2px; background:transparent;">
        <div ref="{{ setProgress }}"
          style="height:100%; width:100%; transform-origin:left; transform:scaleX(0); background:linear-gradient(90deg,var(--burnt),var(--amber),var(--glow));">
        </div>
      </div>
    </div>
  )
}

export default navbar
