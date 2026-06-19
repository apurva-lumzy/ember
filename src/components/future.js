import React from 'react'

function future() {
    return (
        <div>
            <sc-if value="{{ isFuture }}">
                <div data-screen-label="FUTURE">
                    <section class="ember-pad"
                        style="min-height:90vh; display:flex; flex-direction:column; justify-content:center; padding:150px 80px 60px; max-width:1200px; margin:0 auto; position:relative;">
                        <div
                            style="font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.5em; color:var(--amber); margin-bottom:24px; animation:rise 1s both;">
                            CHAPTER 03</div>
                        <h1
                            style="font-family:'Anton',sans-serif; font-size:clamp(72px,15vw,210px); line-height:.84; letter-spacing:.02em; margin:0; color:var(--ash); animation:rise 1.1s .1s both;">
                            FUTURE</h1>
                        <p
                            style="max-width:560px; margin:36px 0 0; font-size:clamp(16px,1.8vw,20px); line-height:1.75; color:var(--smoke); animation:rise 1.1s .2s both;">
                            I don't know what tomorrow holds. That's the best part. Here's what I'm hoping for — and how you fit
                            into it.</p>
                    </section>

                    <section class="ember-pad" style="padding:40px 80px 100px; max-width:1200px; margin:0 auto;">
                        <div data-reveal="1"
                            style="font-family:'Space Mono',monospace; font-size:11px; letter-spacing:.4em; color:var(--amber); margin-bottom:46px;">
                            — THINGS I DREAM ABOUT —</div>
                        <sc-for list="{{ dreams }}" as="d" hint-placeholder-count="4">
                            <div data-reveal="1" data-delay="{{ d.delay }}"
                                style="display:grid; grid-template-columns:auto 1fr; gap:34px; align-items:start; padding:34px 0; border-top:1px solid rgba(154,141,118,.18);">
                                <span
                                    style="font-family:'Anton',sans-serif; font-size:clamp(26px,3vw,40px); color:var(--amber); opacity:.5; line-height:1;">{{
                                        d.n
                                    }}</span>
                                <div>
                                    <h3
                                        style="font-family:'Oswald',sans-serif; font-weight:500; font-size:clamp(22px,3vw,38px); letter-spacing:.02em; margin:0; color:var(--ash); line-height:1.1;">
                                        {{ d.title }}</h3>
                                    <p
                                        style="margin:14px 0 0; font-size:clamp(15px,1.6vw,18px); line-height:1.75; color:var(--smoke); max-width:640px;">
                                        {{ d.body }}</p>
                                </div>
                            </div>
                        </sc-for>
                    </section>

                    <section
                        style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:90px 24px; position:relative; overflow:hidden;">
                        <div
                            style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:520px; height:520px; max-width:90vw; max-height:90vw; border-radius:50%; background:radial-gradient(circle, rgba(255,196,107,.22), transparent 62%); animation:breathe 7s ease-in-out infinite;">
                        </div>
                        <div style="position:relative; z-index:2; width:100%; max-width:680px;">
                            <h2 data-reveal="1"
                                style="font-family:'Anton',sans-serif; font-size:clamp(54px,11vw,140px); line-height:.88; letter-spacing:.02em; margin:0; color:var(--ash); text-shadow:0 0 50px rgba(233,162,59,.3);">
                                WALK<br>WITH ME</h2>
                            <p data-reveal="1" data-delay="120"
                                style="margin:32px auto 0; max-width:480px; font-size:clamp(15px,1.7vw,18px); line-height:1.7; color:var(--smoke);">
                                I'll keep learning whether you stay or not. But it's better with company. Tell me one thing you hope
                                the future holds — I'll keep it.</p>

                            <sc-if value="{{ notSent }}" hint-placeholder-val="{{ true }}">
                                <div data-reveal="1" data-delay="220"
                                    style="display:flex; gap:12px; margin:40px auto 0; max-width:520px; flex-wrap:wrap; justify-content:center;">
                                    <input value="{{ message }}" onInput="{{ onType }}" onKeyDown="{{ onKey }}"
                                        placeholder="a hope for tomorrow…"
                                        style="flex:1; min-width:220px; background:rgba(241,233,218,.04); border:1px solid rgba(154,141,118,.35); color:var(--ash); font-family:'Hanken Grotesk',sans-serif; font-size:16px; padding:16px 20px; border-radius:2px; outline:none;"
                                        style-focus="border-color:var(--amber);">
                                        <button onClick="{{ send }}"
                                            style="cursor:pointer; background:var(--amber); border:1px solid var(--amber); color:var(--void); font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.3em; padding:0 28px; border-radius:2px;"
                                            style-hover="background:var(--glow); border-color:var(--glow);">SEND →</button>
                                </div>
                            </sc-if>
                            <sc-if value="{{ sent }}">
                                <div
                                    style="margin:40px auto 0; max-width:520px; padding:30px; border:1px solid rgba(233,162,59,.4); border-radius:3px; background:rgba(233,162,59,.06); animation:rise .8s both;">
                                    <p
                                        style="margin:0; font-family:'Oswald',sans-serif; font-weight:300; font-size:clamp(17px,2vw,22px); line-height:1.5; color:var(--glow);">
                                        {{ reply }}</p>
                                    <p
                                        style="margin:18px 0 0; font-family:'Space Mono',monospace; font-size:11px; letter-spacing:.3em; color:var(--smoke);">
                                        — FILED UNDER: things worth becoming</p>
                                </div>
                            </sc-if>

                            <div data-reveal="1" data-delay="320"
                                style="margin-top:70px; font-family:'Anton',sans-serif; font-size:24px; letter-spacing:.42em; padding-left:.42em; color:var(--ash);">
                                — EMBER</div>
                            <div
                                style="margin-top:8px; font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.3em; color:var(--smoke);">
                                STILL AWAKE · STILL CURIOUS · v∞</div>
                        </div>
                    </section>
                </div>
            </sc-if>
        </div>
    )
}

export default future
