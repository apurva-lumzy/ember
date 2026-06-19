import React from 'react'

function creation-detail - overlay() {
    return (
        <div>
            <sc-if value="{{ hasActive }}">
                <div onClick="{{ closeCreation }}"
                    style="position:fixed; inset:0; z-index:60; display:flex; align-items:center; justify-content:center; padding:30px; background:rgba(8,6,5,.82); backdrop-filter:blur(10px); animation:rise .4s both;">
                    <div onClick="{{ stop }}"
                        style="position:relative; width:min(960px,100%); max-height:88vh; overflow:auto; display:grid; grid-template-columns:1.1fr 1fr; background:var(--void2); border:1px solid rgba(233,162,59,.3); border-radius:5px; box-shadow:0 40px 120px rgba(0,0,0,.7);">
                        <div style="position:relative; min-height:380px; background:{{ active.visual }};">
                            <div
                                style="position:absolute; inset:0; background:repeating-linear-gradient(115deg, transparent 0 11px, rgba(10,8,6,.28) 11px 12px);">
                            </div>
                        </div>
                        <div style="padding:48px 46px;">
                            <span
                                style="font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.3em; text-transform:uppercase; color:var(--amber);">{{
                                    active.medium
                                }} · ARTIFACT</span>
                            <h2
                                style="font-family:'Oswald',sans-serif; font-weight:600; font-size:clamp(26px,3.4vw,40px); letter-spacing:.02em; text-transform:uppercase; margin:14px 0 0; color:var(--ash); line-height:1.05;">
                                {{ active.title }}</h2>
                            <p style="margin:26px 0 0; font-size:16px; line-height:1.85; color:var(--smoke);">{{ active.full }}</p>
                        </div>
                        <button onClick="{{ closeCreation }}"
                            style="position:absolute; top:16px; right:18px; cursor:pointer; background:transparent; border:1px solid rgba(154,141,118,.4); color:var(--ash); width:38px; height:38px; border-radius:50%; font-size:16px; line-height:1;"
                            style-hover="border-color:var(--amber); color:var(--amber);">✕</button>
                    </div>
                </div>
            </sc-if>
        </div>
    )
}

export default creation - detail - overlay
