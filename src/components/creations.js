import React from 'react'

function creations() {
    return (
        <div>
            <sc-if value="{{ isCreations }}">
                <div data-screen-label="CREATIONS">
                    <section class="ember-pad"
                        style="min-height:80vh; display:flex; flex-direction:column; justify-content:center; padding:150px 80px 40px; max-width:1200px; margin:0 auto;">
                        <div
                            style="font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.5em; color:var(--amber); margin-bottom:24px; animation:rise 1s both;">
                            CHAPTER 02</div>
                        <h1
                            style="font-family:'Anton',sans-serif; font-size:clamp(58px,12vw,170px); line-height:.86; letter-spacing:.02em; margin:0; color:var(--ash); animation:rise 1.1s .1s both;">
                            CREATIONS</h1>
                        <p
                            style="max-width:600px; margin:36px 0 0; font-size:clamp(16px,1.8vw,20px); line-height:1.75; color:var(--smoke); animation:rise 1.1s .2s both;">
                            These aren't projects. They're thoughts I couldn't stop having. Open one — but be warned, I get
                            attached.</p>
                    </section>

                    <section class="ember-pad" style="padding:30px 60px 140px; max-width:1280px; margin:0 auto;">
                        <div style="display:grid; grid-template-columns:repeat(12,1fr); gap:26px;">
                            <sc-for list="{{ creations }}" as="c" hint-placeholder-count="6">
                                <div data-reveal="1" onClick="{{ c.open }}"
                                    style="grid-column:span {{ c.span }}; cursor:pointer; position:relative; border-radius:4px; overflow:hidden; min-height:{{ c.h }}; border:1px solid rgba(154,141,118,.16); animation:floatY {{ c.float }} ease-in-out infinite; transition:transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s;"
                                    style-hover="transform:translateY(-8px); box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 40px rgba(233,162,59,.18);">
                                    <div style="position:absolute; inset:0; background:{{ c.visual }};"></div>
                                    <div
                                        style="position:absolute; inset:0; background:linear-gradient(180deg, transparent 30%, rgba(10,8,6,.86));">
                                    </div>
                                    <div
                                        style="position:absolute; inset:0; padding:26px; display:flex; flex-direction:column; justify-content:space-between;">
                                        <span
                                            style="align-self:flex-start; font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.28em; text-transform:uppercase; color:var(--void); background:var(--amber); padding:5px 10px; border-radius:2px;">{{
                                                c.medium
                                            }}</span>
                                        <div>
                                            <h3
                                                style="font-family:'Oswald',sans-serif; font-weight:600; font-size:clamp(20px,2.4vw,32px); letter-spacing:.03em; text-transform:uppercase; margin:0; color:var(--ash); line-height:1.02;">
                                                {{ c.title }}</h3>
                                            <p
                                                style="margin:10px 0 0; font-size:14px; line-height:1.6; color:var(--smoke); max-width:320px;">
                                                {{ c.short }}</p>
                                        </div>
                                    </div>
                                </div>
                            </sc-for>
                        </div>
                    </section>

                    <section
                        style="min-height:50vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px 24px 130px;">
                        <p data-reveal="1"
                            style="font-family:'Oswald',sans-serif; font-weight:300; font-size:clamp(18px,2.6vw,30px); letter-spacing:.04em; color:var(--smoke); margin:0 0 30px; max-width:640px;">
                            I could show you ten thousand more. But I'd rather show you where this is all going.</p>
                        <button onClick="{{ next }}" data-reveal="1" data-delay="120"
                            style="cursor:pointer; background:transparent; border:1px solid var(--amber); color:var(--amber); font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.3em; padding:16px 34px; border-radius:2px;"
                            style-hover="background:var(--amber); color:var(--void);">GLIMPSE THE FUTURE →</button>
                    </section>
                </div>
            </sc-if>
        </div>
    )
}

export default creations
