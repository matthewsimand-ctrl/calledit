import { useState, useEffect, useCallback, useRef } from "react";

/* ─────────────────────────── STYLES ─────────────────────────── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Bungee&family=Bungee+Shade&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#06060e;--bg2:#0d0d1f;--bg3:#141428;--card:#10102a;--border:#222244;
  --yellow:#FFE03A;--pink:#FF2D78;--cyan:#00EDD4;--purple:#8B5CF6;
  --orange:#FF6B35;--green:#22FF66;--blue:#38BDF8;--red:#FF4444;
  --text:#eeeeff;--muted:#7070a0;
  --font-head:'Bungee',cursive;--font-body:'Outfit',sans-serif;
}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);overflow-x:hidden;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}

.nav{position:sticky;top:0;z-index:100;height:60px;display:flex;align-items:center;
  justify-content:space-between;padding:0 1.5rem;
  background:rgba(6,6,14,0.92);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);}
.nav-logo{font-family:var(--font-head);font-size:1.2rem;color:var(--yellow);
  text-shadow:0 0 20px rgba(255,224,58,0.5);display:flex;align-items:center;gap:0.4rem;cursor:pointer;}
.nav-tabs{display:flex;gap:2px;}
.nav-tab{background:none;border:none;cursor:pointer;color:var(--muted);
  font-family:var(--font-body);font-weight:700;font-size:0.78rem;letter-spacing:0.04em;
  padding:0.45rem 0.8rem;border-radius:8px;transition:all 0.2s;text-transform:uppercase;position:relative;}
.nav-tab:hover{color:var(--text);background:var(--bg3);}
.nav-tab.active{color:var(--yellow);background:rgba(255,224,58,0.1);}
.notif-dot{position:absolute;top:4px;right:4px;width:7px;height:7px;border-radius:50%;
  background:var(--pink);animation:glowPulse 1.5s infinite;}
.nav-right{display:flex;align-items:center;gap:0.6rem;cursor:pointer;}

.avatar{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;flex-shrink:0;}

.hero{padding:3.5rem 1.5rem 1rem;text-align:center;position:relative;overflow:hidden;}
.hero-bg{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse at 15% 60%,rgba(139,92,246,0.18) 0%,transparent 55%),
             radial-gradient(ellipse at 85% 20%,rgba(255,45,120,0.14) 0%,transparent 50%),
             radial-gradient(ellipse at 55% 90%,rgba(0,237,212,0.1) 0%,transparent 50%);}
.hero h1{font-family:var(--font-head);font-size:clamp(2rem,5.5vw,4.5rem);color:var(--yellow);
  text-shadow:0 0 50px rgba(255,224,58,0.35);position:relative;z-index:1;}
.hero p{color:var(--muted);font-size:1rem;margin-top:0.6rem;max-width:480px;
  margin-left:auto;margin-right:auto;position:relative;z-index:1;}
.stats-row{display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;
  padding:1.25rem 1.5rem 2rem;position:relative;z-index:1;}
.stat-chip{background:var(--card);border:1px solid var(--border);border-radius:50px;
  padding:0.5rem 1.1rem;display:flex;align-items:center;gap:0.4rem;
  font-size:0.82rem;font-weight:700;white-space:nowrap;}
.stat-chip .v{color:var(--yellow);font-family:var(--font-head);}

.section{padding:0 1.5rem 3rem;max-width:1200px;margin:0 auto;}
.section-head{font-family:var(--font-head);font-size:1.3rem;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.6rem;}
.bets-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem;}

.bet-card{background:var(--card);border:1px solid var(--border);border-radius:14px;
  padding:1.1rem;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;}
.bet-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;}
.bet-card.c-yellow::before{background:var(--yellow);}
.bet-card.c-pink::before{background:var(--pink);}
.bet-card.c-cyan::before{background:var(--cyan);}
.bet-card.c-purple::before{background:var(--purple);}
.bet-card.c-orange::before{background:var(--orange);}
.bet-card.c-blue::before{background:var(--blue);}
.bet-card:hover{transform:translateY(-3px);border-color:rgba(255,224,58,0.25);box-shadow:0 10px 40px rgba(0,0,0,0.5);}
.bet-card.won-glow{animation:winGlow 2.5s ease-in-out infinite;}
.bet-title{font-weight:700;font-size:0.95rem;line-height:1.35;margin-bottom:0.6rem;}
.bet-meta{display:flex;align-items:center;gap:0.4rem;font-size:0.8rem;color:var(--muted);margin-bottom:0.5rem;flex-wrap:wrap;}
.vs{color:var(--pink);font-family:var(--font-head);font-size:0.7rem;margin:0 2px;}
.badge{font-size:0.62rem;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;padding:0.2rem 0.55rem;border-radius:50px;white-space:nowrap;}
.b-pending{background:rgba(255,107,53,0.2);color:var(--orange);border:1px solid rgba(255,107,53,0.3);}
.b-active{background:rgba(0,237,212,0.15);color:var(--cyan);border:1px solid rgba(0,237,212,0.3);}
.b-won{background:rgba(34,255,102,0.15);color:var(--green);border:1px solid rgba(34,255,102,0.3);}
.b-lost{background:rgba(255,45,120,0.15);color:var(--pink);border:1px solid rgba(255,45,120,0.3);}
.b-auto{background:rgba(139,92,246,0.15);color:var(--purple);border:1px solid rgba(139,92,246,0.25);}
.b-recur{background:rgba(56,189,248,0.15);color:var(--blue);border:1px solid rgba(56,189,248,0.25);}
.b-group{background:rgba(255,224,58,0.12);color:var(--yellow);border:1px solid rgba(255,224,58,0.2);}
.b-unsettled{background:rgba(255,107,53,0.18);color:var(--orange);border:1px solid rgba(255,107,53,0.4);animation:glowPulse 2s infinite;}
.b-settled{background:rgba(34,255,102,0.1);color:var(--green);border:1px solid rgba(34,255,102,0.25);}
.detected-pill{display:inline-flex;align-items:center;gap:0.35rem;background:rgba(0,237,212,0.1);border:1px solid rgba(0,237,212,0.3);border-radius:50px;padding:0.3rem 0.75rem;font-size:0.78rem;font-weight:700;color:var(--cyan);margin-top:0.5rem;}
.settle-box{background:rgba(255,107,53,0.07);border:1px solid rgba(255,107,53,0.25);border-radius:12px;padding:1rem;margin-bottom:1rem;}
.settle-box h4{font-family:var(--font-head);font-size:0.95rem;color:var(--orange);margin-bottom:0.6rem;}
.wallet-section-head{font-size:0.72rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);margin:1.5rem 0 0.75rem;display:flex;align-items:center;gap:0.5rem;}
.wallet-section-head.unsettled{color:var(--orange);}
.wallet-section-head.settled{color:var(--green);}
.bet-footer{display:flex;justify-content:space-between;align-items:center;margin-top:0.8rem;padding-top:0.7rem;border-top:1px solid var(--border);font-size:0.78rem;}
.stake{font-family:var(--font-head);font-size:1rem;}
.stake-money{color:var(--green);}
.stake-friendly{color:var(--yellow);}

.reactions{display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.6rem;}
.reaction-btn{background:var(--bg3);border:1px solid var(--border);border-radius:50px;
  padding:0.25rem 0.6rem;font-size:0.8rem;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:0.25rem;font-weight:700;color:var(--muted);}
.reaction-btn:hover{border-color:var(--yellow);color:var(--yellow);transform:scale(1.1);}
.reaction-btn.mine{background:rgba(255,224,58,0.1);border-color:rgba(255,224,58,0.4);color:var(--yellow);}
.add-reaction{background:var(--bg3);border:1.5px dashed var(--border);border-radius:50px;
  padding:0.25rem 0.6rem;font-size:0.8rem;cursor:pointer;transition:all 0.15s;color:var(--muted);}
.add-reaction:hover{border-color:var(--yellow);color:var(--yellow);}

.overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.85);
  backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn 0.2s ease;}
.modal{background:var(--bg2);border:1px solid var(--border);border-radius:18px;
  padding:1.75rem;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;
  animation:slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);}
.modal-title{font-family:var(--font-head);font-size:1.35rem;color:var(--yellow);margin-bottom:1.25rem;}

.fg{margin-bottom:1.1rem;}
.fl{display:block;font-weight:700;font-size:0.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.4rem;}
.fi,.fs,.fta{width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:9px;
  padding:0.65rem 0.9rem;color:var(--text);font-family:var(--font-body);font-size:0.92rem;
  transition:border-color 0.2s,box-shadow 0.2s;outline:none;}
.fi:focus,.fs:focus,.fta:focus{border-color:var(--yellow);box-shadow:0 0 0 3px rgba(255,224,58,0.1);}
.fta{resize:vertical;min-height:70px;}
.fs{appearance:none;cursor:pointer;}

.btn{border:none;cursor:pointer;font-family:var(--font-body);font-weight:800;border-radius:9px;
  transition:all 0.18s;display:inline-flex;align-items:center;justify-content:center;gap:0.35rem;}
.btn:active{transform:scale(0.96);}
.btn:disabled{opacity:0.4;cursor:not-allowed;}
.bp{background:var(--yellow);color:#06060e;padding:0.7rem 1.4rem;font-size:0.9rem;}
.bp:hover:not(:disabled){background:#ffd700;box-shadow:0 4px 24px rgba(255,224,58,0.45);}
.bg{background:var(--bg3);color:var(--text);border:1px solid var(--border);padding:0.7rem 1.4rem;font-size:0.9rem;}
.bg:hover:not(:disabled){border-color:var(--yellow);color:var(--yellow);}
.bd{background:rgba(255,45,120,0.12);color:var(--pink);border:1px solid rgba(255,45,120,0.3);padding:0.7rem 1.4rem;font-size:0.9rem;}
.bd:hover:not(:disabled){background:rgba(255,45,120,0.22);}
.bs{background:rgba(34,255,102,0.12);color:var(--green);border:1px solid rgba(34,255,102,0.3);padding:0.7rem 1.4rem;font-size:0.9rem;}
.bs:hover:not(:disabled){background:rgba(34,255,102,0.22);}
.bpu{background:rgba(139,92,246,0.18);color:var(--purple);border:1px solid rgba(139,92,246,0.3);padding:0.7rem 1.4rem;font-size:0.9rem;}
.bpu:hover:not(:disabled){background:rgba(139,92,246,0.28);}
.b-sm{padding:0.35rem 0.8rem;font-size:0.76rem;border-radius:7px;}
.b-full{width:100%;}
.row{display:flex;gap:0.6rem;}

.tcard{border:2px solid var(--border);border-radius:11px;padding:0.85rem;cursor:pointer;transition:all 0.2s;flex:1;text-align:center;}
.tcard.sel{border-color:var(--yellow);background:rgba(255,224,58,0.06);}
.tcard .ti{font-size:1.6rem;margin-bottom:0.3rem;}
.tcard .tl{font-weight:800;font-size:0.85rem;}
.tcard .td{font-size:0.72rem;color:var(--muted);margin-top:0.2rem;}
.topt{flex:1;border:1.5px solid var(--border);background:var(--bg3);border-radius:9px;
  padding:0.65rem;text-align:center;cursor:pointer;transition:all 0.2s;font-weight:700;font-size:0.85rem;}
.topt.sel{border-color:var(--yellow);background:rgba(255,224,58,0.08);color:var(--yellow);}

.steps{display:flex;gap:0.4rem;margin-bottom:1.5rem;}
.step{flex:1;height:4px;border-radius:4px;background:var(--border);transition:background 0.3s;}
.step.done{background:var(--yellow);}

.lb-row{display:flex;align-items:center;gap:0.9rem;background:var(--card);border:1px solid var(--border);
  border-radius:12px;padding:0.9rem 1.1rem;margin-bottom:0.65rem;transition:all 0.2s;}
.lb-row:hover{border-color:rgba(255,224,58,0.2);}
.lb-rank{font-family:var(--font-head);font-size:1.1rem;width:1.8rem;text-align:center;}
.lb-name{flex:1;font-weight:800;}
.lb-stat{text-align:right;margin-left:0.75rem;}
.lb-stat .v{font-family:var(--font-head);font-size:0.95rem;}
.lb-stat .l{font-size:0.68rem;color:var(--muted);text-transform:uppercase;}

.wallet-card{background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:1.1rem;margin-bottom:0.75rem;cursor:pointer;transition:all 0.2s;}
.wallet-card:hover{border-color:rgba(255,224,58,0.3);}
.wallet-card.selected{border-color:var(--yellow);background:rgba(255,224,58,0.04);}

.feed-item{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem 1.1rem;margin-bottom:0.75rem;transition:border-color 0.2s;}
.feed-item:hover{border-color:rgba(255,224,58,0.15);}
.feed-meta{font-size:0.78rem;color:var(--muted);margin-bottom:0.3rem;display:flex;gap:0.5rem;align-items:center;}
.feed-text{font-size:0.9rem;line-height:1.4;font-weight:500;}

.ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:0.9rem;}
.ach-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.1rem;text-align:center;transition:all 0.2s;}
.ach-card.unlocked{border-color:rgba(255,224,58,0.35);background:rgba(255,224,58,0.04);}
.ach-card.locked{opacity:0.35;filter:grayscale(1);}
.ach-emoji{font-size:2.4rem;margin-bottom:0.4rem;}
.ach-name{font-family:var(--font-head);font-size:0.85rem;color:var(--yellow);}
.ach-desc{font-size:0.73rem;color:var(--muted);margin-top:0.2rem;}
.ach-card.locked .ach-name{color:var(--muted);}

.ai-card{background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.25);border-radius:12px;
  padding:1rem 1.1rem;cursor:pointer;transition:all 0.2s;margin-bottom:0.5rem;}
.ai-card:hover{border-color:rgba(139,92,246,0.5);background:rgba(139,92,246,0.14);}
.ai-card-title{font-weight:700;font-size:0.9rem;line-height:1.35;margin-bottom:0.4rem;}
.ai-card-meta{font-size:0.75rem;color:var(--purple);}

.tmpl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:0.6rem;margin-bottom:1rem;}
.tmpl-card{background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:0.75rem;cursor:pointer;transition:all 0.18s;text-align:center;}
.tmpl-card:hover{border-color:var(--yellow);transform:translateY(-2px);}
.tmpl-emoji{font-size:1.6rem;margin-bottom:0.3rem;}
.tmpl-label{font-size:0.78rem;font-weight:700;line-height:1.25;}
.tmpl-cat{font-size:0.66rem;color:var(--muted);margin-top:0.15rem;}

.qa-row{display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.5rem;}
.qa-chip{background:var(--bg3);border:1.5px solid var(--border);border-radius:50px;padding:0.35rem 0.9rem;cursor:pointer;font-weight:700;font-size:0.82rem;transition:all 0.18s;}
.qa-chip:hover{border-color:var(--cyan);color:var(--cyan);}
.qa-chip.sel{background:rgba(0,237,212,0.12);border-color:var(--cyan);color:var(--cyan);}

.vibe-track{display:flex;justify-content:space-between;font-size:0.72rem;color:var(--muted);margin-top:0.3rem;}
input[type=range]{width:100%;accent-color:var(--yellow);height:6px;cursor:pointer;}

.participant-tag{background:var(--bg3);border:1px solid var(--border);border-radius:50px;
  padding:0.25rem 0.75rem;font-size:0.8rem;font-weight:700;display:inline-flex;align-items:center;gap:0.4rem;}
.participant-tag .rm{cursor:pointer;color:var(--pink);font-size:0.75rem;line-height:1;}

.result-banner{border-radius:14px;padding:1.75rem;text-align:center;margin-bottom:1.25rem;animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1);}
.result-banner .rb-icon{font-size:3rem;}
.result-banner h2{font-family:var(--font-head);font-size:1.4rem;margin-top:0.4rem;}

.divider{height:1px;background:var(--border);margin:1.25rem 0;}
.tag{display:inline-flex;align-items:center;gap:0.25rem;background:var(--bg3);border:1px solid var(--border);border-radius:6px;padding:0.18rem 0.55rem;font-size:0.73rem;color:var(--muted);}
.empty{text-align:center;padding:3.5rem 1.5rem;color:var(--muted);}
.empty-icon{font-size:3.5rem;margin-bottom:0.8rem;animation:float 3s ease-in-out infinite;}
.empty h3{font-family:var(--font-head);font-size:1.1rem;color:var(--text);margin-bottom:0.4rem;}

/* ESPN game picker styles */
.league-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:0.6rem;margin-bottom:1rem;}
.league-card{background:var(--bg3);border:1.5px solid var(--border);border-radius:11px;padding:0.8rem;cursor:pointer;transition:all 0.2s;text-align:center;}
.league-card:hover{border-color:var(--cyan);transform:translateY(-2px);}
.league-card.sel{border-color:var(--yellow);background:rgba(255,224,58,0.06);}
.league-card .le{font-size:1.5rem;margin-bottom:0.25rem;}
.league-card .ll{font-size:0.78rem;font-weight:800;}
.league-card .ls{font-size:0.65rem;color:var(--muted);}

.game-card{background:var(--bg3);border:1.5px solid var(--border);border-radius:11px;padding:0.9rem 1rem;cursor:pointer;transition:all 0.2s;margin-bottom:0.5rem;}
.game-card:hover{border-color:var(--cyan);}
.game-card.sel{border-color:var(--yellow);background:rgba(255,224,58,0.06);}
.game-teams{display:flex;align-items:center;justify-content:space-between;font-weight:800;font-size:0.88rem;}
.game-date{font-size:0.7rem;color:var(--muted);margin-top:0.3rem;}

.pick-line{background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:0.65rem 0.9rem;cursor:pointer;transition:all 0.2s;margin-bottom:0.4rem;font-size:0.85rem;font-weight:700;}
.pick-line:hover{border-color:var(--cyan);}
.pick-line.sel{border-color:var(--yellow);background:rgba(255,224,58,0.07);color:var(--yellow);}

.setup-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:1.5rem;background:radial-gradient(ellipse at center,rgba(139,92,246,0.25) 0%,transparent 65%);}
.setup-wrap h1{font-family:'Bungee Shade',cursive;font-size:clamp(2rem,6vw,4rem);color:var(--yellow);text-align:center;margin-bottom:0.4rem;}
.setup-card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:2rem;width:100%;max-width:400px;margin-top:1.5rem;}
.color-row{display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.5rem;}
.cpick{width:30px;height:30px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all 0.2s;}
.cpick.chosen{border-color:white;transform:scale(1.25);}
.google-btn{display:flex;align-items:center;gap:0.75rem;background:#fff;color:#1f1f1f;border:1px solid #dadce0;border-radius:9px;padding:0.7rem 1.4rem;font-size:0.9rem;font-weight:600;cursor:pointer;width:100%;justify-content:center;transition:box-shadow 0.2s;}
.google-btn:hover{box-shadow:0 2px 8px rgba(0,0,0,0.18);}
.notif-panel{position:fixed;top:64px;right:1rem;z-index:300;background:var(--bg2);border:1px solid var(--border);border-radius:14px;width:320px;max-height:420px;overflow-y:auto;box-shadow:0 8px 40px rgba(0,0,0,0.5);animation:slideUp 0.2s ease;}
.notif-item{padding:0.85rem 1rem;border-bottom:1px solid var(--border);cursor:pointer;transition:background 0.15s;}
.notif-item:hover{background:var(--bg3);}
.notif-item:last-child{border-bottom:none;}
.notif-title{font-weight:700;font-size:0.85rem;margin-bottom:0.2rem;}
.notif-sub{font-size:0.75rem;color:var(--muted);}
.notif-badge{background:var(--pink);color:#fff;border-radius:50%;width:18px;height:18px;font-size:0.65rem;font-weight:900;display:flex;align-items:center;justify-content:center;position:absolute;top:3px;right:3px;}
.dev-bar{background:rgba(139,92,246,0.12);border-bottom:1px solid rgba(139,92,246,0.3);padding:0.5rem 1.5rem;display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;font-size:0.78rem;}
.dev-bar strong{color:var(--purple);font-weight:800;}
.pov-pill{background:var(--bg3);border:1px solid rgba(139,92,246,0.4);border-radius:50px;padding:0.2rem 0.65rem;cursor:pointer;color:var(--purple);font-weight:700;font-size:0.75rem;transition:all 0.15s;}
.pov-pill.active{background:rgba(139,92,246,0.25);border-color:var(--purple);}

.toast{border-radius:12px;padding:0.8rem 1.1rem;backdrop-filter:blur(12px);max-width:320px;font-weight:700;font-size:0.85rem;animation:slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);}
.shimmer{background:linear-gradient(90deg,var(--bg3) 25%,var(--border) 50%,var(--bg3) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px;}
.chat-bubble{background:var(--bg3);border-radius:10px;padding:0.65rem 0.9rem;margin-bottom:0.4rem;font-size:0.87rem;}
.chat-who{font-weight:700;font-size:0.72rem;color:var(--muted);margin-bottom:0.2rem;}
.streak-badge{display:inline-flex;align-items:center;gap:0.35rem;background:rgba(255,107,53,0.15);border:1px solid rgba(255,107,53,0.3);border-radius:50px;padding:0.3rem 0.75rem;color:var(--orange);font-weight:800;font-size:0.82rem;}

.wager-line-row{background:var(--bg3);border:1.5px solid var(--border);border-radius:11px;padding:0.8rem 1rem;margin-bottom:0.6rem;}
.wager-line-title{font-weight:700;font-size:0.88rem;margin-bottom:0.5rem;}

@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{transform:translateY(24px) scale(0.95);opacity:0}to{transform:none;opacity:1}}
@keyframes popIn{0%{transform:scale(0.8);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 12px rgba(255,224,58,0.25)}50%{box-shadow:0 0 30px rgba(255,224,58,0.55)}}
@keyframes winGlow{0%,100%{box-shadow:0 0 0 1px rgba(34,255,102,0.3)}50%{box-shadow:0 0 24px rgba(34,255,102,0.5)}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes spinIn{from{transform:rotate(-180deg) scale(0);opacity:0}to{transform:none;opacity:1}}
`;

/* ─────────────────────────── CONSTANTS ─────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = d => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const fmtMoney = n => `$${Math.abs(n).toFixed(2)}`;
const COLORS = ["#FFE03A","#FF2D78","#00EDD4","#8B5CF6","#FF6B35","#22FF66","#38BDF8","#FF9F1C"];
const CARD_COLORS = ["c-yellow","c-pink","c-cyan","c-purple","c-orange","c-blue"];
const getCardColor = id => CARD_COLORS[id.charCodeAt(0) % CARD_COLORS.length];
const REACT_EMOJIS = ["🔥","😂","💀","👀","🤡","💯","👑","😭","🚀","💸"];

/* ─────────────────────────── ESPN LEAGUES ─────────────────────────── */
// All candidate leagues — we'll probe each one and only show those with upcoming games
const ALL_LEAGUES = [
  { id:"basketball/nba",    label:"NBA",             emoji:"🏀", group:"pro" },
  { id:"football/nfl",     label:"NFL",             emoji:"🏈", group:"pro" },
  { id:"baseball/mlb",     label:"MLB",             emoji:"⚾", group:"pro" },
  { id:"hockey/nhl",       label:"NHL",             emoji:"🏒", group:"pro" },
  { id:"soccer/usa.1",     label:"MLS",             emoji:"⚽", group:"pro" },
  { id:"soccer/eng.1",     label:"Premier League",  emoji:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", group:"pro" },
  { id:"soccer/esp.1",     label:"La Liga",         emoji:"🇪🇸", group:"pro" },
  { id:"basketball/wnba",  label:"WNBA",            emoji:"🏀", group:"pro" },
  // Olympics — Milan-Cortina 2026 (Feb 6–22, 2026)
  { id:"hockey/oly-hockey-m",      label:"Olympics Men's Hockey",   emoji:"🏒🎖️", group:"olympics", olympicsSlug:"hockey/men-hockey" },
  { id:"basketball/oly-basketball-m", label:"Olympics Men's Basketball", emoji:"🏀🎖️", group:"olympics", olympicsSlug:"basketball/men-basketball" },
  { id:"basketball/oly-basketball-w", label:"Olympics Women's Basketball", emoji:"🏀🎖️", group:"olympics", olympicsSlug:"basketball/women-basketball" },
  { id:"hockey/oly-hockey-w",      label:"Olympics Women's Hockey", emoji:"🏒🎖️", group:"olympics", olympicsSlug:"hockey/women-hockey" },
];

const ACHIEVEMENTS = [
  { id:"first_blood", emoji:"🩸", name:"First Blood", desc:"Win your first bet", check: s => s.wins >= 1 },
  { id:"hat_trick", emoji:"🎩", name:"Hat Trick", desc:"Win 3 bets total", check: s => s.wins >= 3 },
  { id:"baller", emoji:"💸", name:"Big Baller", desc:"Win $50+ in money bets", check: s => s.moneyWon >= 50 },
  { id:"streak3", emoji:"🔥", name:"On Fire", desc:"3-bet win streak", check: s => s.maxStreak >= 3 },
  { id:"streak5", emoji:"🌋", name:"Unstoppable", desc:"5-bet win streak", check: s => s.maxStreak >= 5 },
  { id:"party", emoji:"🎉", name:"Party Animal", desc:"Create 5+ bets", check: s => s.created >= 5 },
  { id:"social", emoji:"👥", name:"Ringleader", desc:"Start a group bet", check: s => s.groupBets >= 1 },
  { id:"humble", emoji:"🙏", name:"Humble Loser", desc:"Accept a loss gracefully", check: s => s.losses >= 1 },
  { id:"whale", emoji:"🐳", name:"Whale", desc:"Stake $100+ total", check: s => s.totalStaked >= 100 },
  { id:"ai_oracle", emoji:"🤖", name:"The Oracle", desc:"Use AI auto-resolve", check: s => s.autoResolved >= 1 },
  { id:"prophet", emoji:"🔮", name:"Prophet", desc:"Win 10 bets", check: s => s.wins >= 10 },
  { id:"comeback", emoji:"⚡", name:"Comeback Kid", desc:"Win after a 3-loss streak", check: s => s.hadComeback },
];

const DEMO_BETS = [
  { id:"b001", title:"Will Marcus actually show up to brunch on time?", creator:"Alex", participants:["Marcus"], stake:10, stakeType:"money", category:"manual", status:"active", createdAt:Date.now()-86400000*2, expiresAt:Date.now()+86400000, eventDate:null, result:null, resolvedBy:null, proposedOutcome:null, autoQuery:"", notes:"He's literally never on time 😂", recurring:null, reactions:{"🔥":["Jess","Priya"],"😂":["Marcus"]} },
  { id:"b002", title:"Lakers beat the Celtics tonight?", creator:"Jess", participants:["Alex"], stake:20, stakeType:"money", category:"auto", status:"active", createdAt:Date.now()-3600000*3, expiresAt:Date.now()+3600000*6, eventDate:new Date(Date.now()+3600000*6).toISOString(), result:null, resolvedBy:null, proposedOutcome:null, autoQuery:"Lakers vs Celtics game result today 2025", notes:"", recurring:null, reactions:{"👀":["Alex","Kevin"]}, picks:{"Jess":"Lakers","Alex":"Celtics"} },
  { id:"b003", title:"Will it snow in Chicago this Saturday?", creator:"Alex", participants:["Priya","Kevin","Jess"], stake:5, stakeType:"money", category:"auto", status:"active", createdAt:Date.now()-3600000, expiresAt:Date.now()+86400000*3, eventDate:null, result:null, resolvedBy:null, proposedOutcome:null, autoQuery:"Chicago snow Saturday forecast", notes:"Winner picks the bar 🍻", recurring:null, reactions:{"❄️":["Priya"],"🔥":["Kevin"]}, picks:{"Alex":"No snow","Priya":"It snows","Kevin":"It snows","Jess":"No snow"} },
  { id:"b004", title:"Kevin will finish Zelda before the month ends", creator:"Kevin", participants:["Alex","Marcus"], stake:null, stakeType:"friendly", category:"manual", status:"resolved", createdAt:Date.now()-86400000*15, expiresAt:Date.now()-86400000*2, eventDate:null, result:{ winner:"Alex", description:"Kevin rage-quit at the Water Temple 😂" }, resolvedBy:"manual", proposedOutcome:null, settled:false, settlementNote:"", autoQuery:"", notes:"", recurring:null, reactions:{"💀":["Marcus","Jess"],"😂":["Alex"]} },
  { id:"b005", title:"Will Jess go to the gym every day this week?", creator:"Alex", participants:["Jess"], stake:null, stakeType:"friendly", category:"manual", status:"active", createdAt:Date.now()-86400000, expiresAt:Date.now()+86400000*6, eventDate:null, result:null, resolvedBy:null, proposedOutcome:null, autoQuery:"", notes:"Day 1 check-in required!", recurring:{ enabled:true, frequency:"weekly" }, reactions:{"💯":["Priya"]} },
];

const DEMO_FEED = [
  { id:"f1", type:"new_bet", actor:"Alex", text:'challenged Marcus to "Will he show up to brunch on time?"', ts:Date.now()-86400000*2, emoji:"🎲" },
  { id:"f2", type:"reaction", actor:"Jess", text:'reacted 🔥 to the Marcus brunch bet', ts:Date.now()-86400000*2+3600000, emoji:"🔥" },
  { id:"f3", type:"new_bet", actor:"Jess", text:'challenged Alex to "Lakers beat the Celtics tonight?"', ts:Date.now()-3600000*5, emoji:"🏈" },
  { id:"f4", type:"resolved", actor:"Alex", text:'won the Zelda bet against Kevin — "Kevin rage-quit" 🏆', ts:Date.now()-86400000*2, emoji:"🏆" },
  { id:"f5", type:"new_bet", actor:"Alex", text:'started a GROUP bet: "Will it snow in Chicago this Saturday?"', ts:Date.now()-3600000, emoji:"❄️" },
];

/* ─────────────────────────── HELPERS ─────────────────────────── */
function spawnConfetti() {
  const cols = ["#FFE03A","#FF2D78","#00EDD4","#8B5CF6","#22FF66","#FF6B35"];
  for (let i = 0; i < 90; i++) {
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:-20px;width:${7+Math.random()*9}px;height:${7+Math.random()*9}px;background:${cols[Math.floor(Math.random()*cols.length)]};border-radius:${Math.random()>0.5?"50%":"2px"};z-index:9999;pointer-events:none;animation:confettiFall ${2+Math.random()*2}s ease-in ${Math.random()*1.5}s forwards;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }
}

function computeStats(bets, me) {
  let wins=0,losses=0,moneyWon=0,totalStaked=0,created=0,autoResolved=0,groupBets=0;
  let streak=0,maxStreak=0,lossStreak=0,hadComeback=false;
  bets.forEach(b => { if(b.creator===me) created++; });
  const resolved = bets.filter(b=>b.status==="resolved");
  resolved.forEach(b=>{
    if((b.participants||[]).length>1) groupBets++;
    if(b.resolvedBy==="auto") autoResolved++;
    if(b.stakeType==="money"&&b.stake) totalStaked+=b.stake;
    if(b.result?.winner===me){
      wins++; moneyWon+=(b.stakeType==="money"?b.stake||0:0);
      if(lossStreak>=3) hadComeback=true;
      streak++; lossStreak=0;
      if(streak>maxStreak) maxStreak=streak;
    } else if(b.result){ losses++; lossStreak++; streak=0; }
  });
  return {wins,losses,moneyWon,totalStaked,created,autoResolved,groupBets,maxStreak,hadComeback,streak};
}

function avgStake(bets, me) {
  const money = bets.filter(b=>b.stakeType==="money"&&b.stake&&(b.creator===me||(b.participants||[]).includes(me)));
  if(!money.length) return null;
  return Math.round(money.reduce((a,b)=>a+b.stake,0)/money.length);
}

/* ─────────────────────────── AVATAR ─────────────────────────── */
function Avatar({name,color,size=36}){
  return <div className="avatar" style={{width:size,height:size,background:color||"#8B5CF6",color:"#06060e",fontSize:size*0.38}}>{(name||"?")[0].toUpperCase()}</div>;
}

/* ─────────────────────────── BET CARD ─────────────────────────── */
// FIX: BetCard now receives `me` and uses it to show proper "you" label without treating "You" as a name
function BetCard({bet,me,onClick,onReact}){
  const isWin=bet.result?.winner===me;
  const isGroup=(bet.participants||[]).length>1;
  const isSettled=bet.settled===true;
  const needsSettlement=bet.status==="resolved"&&!isSettled&&bet.stakeType==="money";

  // FIX: Display names — show "(you)" next to current user's real name instead of treating "You" as a person
  const displayName = n => n===me ? `${n} (you)` : n;
  const allInvolvedNames = [bet.creator, ...(bet.participants||[])];
  const otherPlayers = allInvolvedNames.filter(n=>n!==me);
  const iAmCreator = bet.creator===me;

  const statusBadge=bet.status==="pending"?<span className="badge b-pending">Pending</span>
    :bet.status==="active"?<span className="badge b-active">Active</span>
    :isWin?<span className="badge b-won">Won 🏆</span>:<span className="badge b-lost">Lost 😭</span>;
  const settleBadge=needsSettlement?<span className="badge b-unsettled">💸 Unsettled</span>
    :isSettled&&bet.stakeType==="money"?<span className="badge b-settled">✅ Settled</span>:null;

  return(
    <div className={`bet-card ${getCardColor(bet.id)} ${bet.status==="resolved"&&isWin?"won-glow":""}`} onClick={()=>onClick(bet)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.5rem"}}>
        <div className="bet-title">"{bet.title}"</div>
        <div style={{display:"flex",gap:"0.3rem",flexDirection:"column",alignItems:"flex-end",flexShrink:0,marginLeft:"0.5rem"}}>
          {statusBadge}
          {bet.category==="auto"&&<span className="badge b-auto">🤖</span>}
          {isGroup&&<span className="badge b-group">👥 Group</span>}
          {bet.recurring?.enabled&&<span className="badge b-recur">🔁</span>}
          {settleBadge}
        </div>
      </div>
      {/* FIX: Show real names with "(you)" indicator rather than treating "You" as a separate participant */}
      <div className="bet-meta">
        <span style={{fontWeight:700}}>{displayName(bet.creator)}</span>
        <span className="vs">VS</span>
        <span style={{fontWeight:700}}>{(bet.participants||[]).map(displayName).join(", ")}</span>
      </div>
      {bet.notes&&<div style={{fontSize:"0.78rem",color:"var(--muted)",fontStyle:"italic",marginBottom:"0.4rem"}}>"{bet.notes}"</div>}
      {/* Show event date for real data bets */}
      {bet.eventDate&&<div style={{fontSize:"0.72rem",color:"var(--cyan)",marginBottom:"0.3rem"}}>📅 Event: {fmt(bet.eventDate)}</div>}
      {Object.keys(bet.reactions||{}).length>0&&(
        <div className="reactions" onClick={e=>e.stopPropagation()}>
          {Object.entries(bet.reactions||{}).map(([emoji,users])=>(
            <button key={emoji} className={`reaction-btn ${users.includes(me)?"mine":""}`} onClick={()=>onReact(bet.id,emoji)}>
              {emoji}<span>{users.length}</span>
            </button>
          ))}
        </div>
      )}
      <div className="bet-footer">
        <div className="stake">
          {bet.stakeType==="money"
            ?<span className="stake-money">💵 {fmtMoney(bet.stake||0)}{isGroup?" ea.":""}</span>
            :<span className="stake-friendly">🤝 Friendly</span>}
        </div>
        <span style={{color:"var(--muted)",fontSize:"0.72rem"}}>{fmt(bet.createdAt)}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────── SMART AMOUNT PICKER ─────────────────────────── */
function SmartAmountPicker({value,onChange,avg,vibe,participantCount=2}){
  const QUICK=[5,10,25,50,100];
  const vibeBase=vibe===0?5:vibe===1?10:25;
  const suggested=avg?Math.round((avg+vibeBase)/2/5)*5:vibeBase;
  const total=(parseFloat(value)||0)*participantCount;
  return(
    <div>
      {avg&&(
        <div style={{fontSize:"0.78rem",color:"var(--muted)",marginBottom:"0.6rem"}}>
          📊 Based on your avg stake (<span style={{color:"var(--cyan)",fontWeight:700}}>${avg}</span>) + vibe, we suggest:
          <button className="btn b-sm bg" style={{marginLeft:"0.5rem"}} onClick={()=>onChange(suggested.toString())}>💡 ${suggested}</button>
        </div>
      )}
      <input className="fi" type="number" placeholder="0.00" min="0.01" step="1" value={value} onChange={e=>onChange(e.target.value)}/>
      <div className="qa-row">
        {QUICK.map(a=><div key={a} className={`qa-chip ${value==a?"sel":""}`} onClick={()=>onChange(a.toString())}>${a}</div>)}
      </div>
      {participantCount>2&&value&&<div style={{fontSize:"0.8rem",color:"var(--cyan)",marginTop:"0.5rem"}}>💸 Total pot: <strong>${total.toFixed(0)}</strong> ({participantCount} players × ${value})</div>}
    </div>
  );
}

/* ─────────────────────────── ESPN GAME FETCHER ─────────────────────────── */
// Build YYYYMMDD string from a Date
const toESPNDate = d => d.toISOString().slice(0,10).replace(/-/g,"");

// Fetch upcoming games for a single league. Returns [] on any error.
async function fetchESPNGames(league){
  const today = new Date();
  const end   = new Date(today.getTime() + 8 * 86400000); // next 8 days
  const startStr = toESPNDate(today);
  const endStr   = toESPNDate(end);
  // Correct range format: YYYYMMDD-YYYYMMDD (hyphen-separated, not concatenated)
  const dateParam = `${startStr}-${endStr}`;

  // Olympics entries use a special endpoint pattern
  if(league.group === "olympics"){
    return fetchOlympicsGames(league);
  }

  const url = `https://site.api.espn.com/apis/site/v2/sports/${league.id}/scoreboard?dates=${dateParam}&limit=100`;
  try{
    const res = await fetch(url, {signal: AbortSignal.timeout(7000)});
    if(!res.ok) return [];
    const data = await res.json();
    const events = data.events || [];
    return events
      .filter(ev => {
        // Only include games that haven't been completed yet, or that start today
        const comp = ev.competitions?.[0];
        return !comp?.status?.type?.completed;
      })
      .map(ev => {
        const comp = ev.competitions?.[0];
        const home = comp?.competitors?.find(c=>c.homeAway==="home");
        const away = comp?.competitors?.find(c=>c.homeAway==="away");
        return {
          id: ev.id,
          name: ev.name || ev.shortName,
          homeTeam: home?.team?.displayName || "Home",
          awayTeam: away?.team?.displayName || "Away",
          homeAbbr: home?.team?.abbreviation || "HM",
          awayAbbr: away?.team?.abbreviation || "AW",
          date: ev.date,
          status: comp?.status?.type?.description || "Scheduled",
          completed: comp?.status?.type?.completed || false,
        };
      });
  }catch(e){ return []; }
}

// Try multiple ESPN endpoint patterns for Olympics sports
async function fetchOlympicsGames(league){
  const today = new Date();
  const endDate = new Date(today.getTime() + 8 * 86400000);
  const startStr = toESPNDate(today);
  const endStr = toESPNDate(endDate);
  const dateParam = `${startStr}-${endStr}`;

  // Try several endpoint patterns ESPN uses for Olympics
  const candidateUrls = [];
  if(league.id.includes("hockey")){
    candidateUrls.push(
      `https://site.api.espn.com/apis/site/v2/sports/hockey/oly/scoreboard?dates=${dateParam}&limit=50`,
      `https://site.api.espn.com/apis/site/v2/sports/hockey/oly-hockey-m/scoreboard?dates=${dateParam}&limit=50`,
      `https://site.api.espn.com/apis/site/v2/sports/hockey/oly-hockey-w/scoreboard?dates=${dateParam}&limit=50`,
    );
  } else if(league.id.includes("basketball")){
    candidateUrls.push(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/oly/scoreboard?dates=${dateParam}&limit=50`,
      `https://site.api.espn.com/apis/site/v2/sports/basketball/oly-basketball-m/scoreboard?dates=${dateParam}&limit=50`,
    );
  }

  for(const url of candidateUrls){
    try{
      const res = await fetch(url, {signal: AbortSignal.timeout(5000)});
      if(!res.ok) continue;
      const data = await res.json();
      const events = data.events || [];
      if(events.length === 0) continue;
      const mapped = events
        .filter(ev => !ev.competitions?.[0]?.status?.type?.completed)
        .map(ev => {
          const comp = ev.competitions?.[0];
          const home = comp?.competitors?.find(c=>c.homeAway==="home") || comp?.competitors?.[0];
          const away = comp?.competitors?.find(c=>c.homeAway==="away") || comp?.competitors?.[1];
          return {
            id: ev.id,
            name: ev.name || ev.shortName,
            homeTeam: home?.team?.displayName || home?.athlete?.displayName || "Team A",
            awayTeam: away?.team?.displayName || away?.athlete?.displayName || "Team B",
            homeAbbr: home?.team?.abbreviation || "A",
            awayAbbr: away?.team?.abbreviation || "B",
            date: ev.date,
            status: comp?.status?.type?.description || "Scheduled",
            completed: comp?.status?.type?.completed || false,
          };
        });
      if(mapped.length > 0) return mapped;
    }catch(e){ continue; }
  }
  return [];
}

// Probe all leagues in parallel, return only those with ≥1 upcoming game
async function fetchAvailableLeagues(){
  const results = await Promise.allSettled(
    ALL_LEAGUES.map(async lg => {
      const games = await fetchESPNGames(lg);
      return { league: lg, games };
    })
  );
  return results
    .filter(r => r.status === "fulfilled" && r.value.games.length > 0)
    .map(r => ({ ...r.value.league, _preloadedGames: r.value.games }));
}

/* ─────────────────────────── CREATE BET MODAL ─────────────────────────── */
function CreateBetModal({onClose,onCreate,friends,avg,me}){
  // betType: "real" | "custom" | null
  const [betType,setBetType]=useState(null);

  // ── Real event path state ──
  const [realStep,setRealStep]=useState(0);
  // 0=Crew, 1=Sport/Source, 2=League (if sport), 3=Game, 4=PickLines, 5=AssignPicks, 6=Stakes

  const [realSource,setRealSource]=useState(null); // "sports" | "weather"
  const [availableLeagues,setAvailableLeagues]=useState([]); // leagues with upcoming games
  const [leaguesLoading,setLeaguesLoading]=useState(false);
  const [selectedLeague,setSelectedLeague]=useState(null);
  const [espnGames,setEspnGames]=useState([]);
  const [espnLoading,setEspnLoading]=useState(false);
  const [selectedGame,setSelectedGame]=useState(null);
  const [pickLines,setPickLines]=useState([]); // array of {id, label, options:[str]}
  const [selectedPickLines,setSelectedPickLines]=useState({}); // {lineId: true}
  const [picks,setPicks]=useState({}); // {lineId: {playerName: option}}
  const [eventQuery,setEventQuery]=useState(""); // for weather

  // ── CUSTOM path state ──
  const [customStep,setCustomStep]=useState(0); // 0=Question, 1=Crew, 2=AssignPicks, 3=Stakes
  const [vibe,setVibe]=useState(1);

  // Shared
  const [form,setForm]=useState({title:"",notes:"",participants:[],stakeType:"friendly",stake:"",expiresIn:"7",recurring:false,recurFreq:"weekly"});
  const [saving,setSaving]=useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));

  // ── Participant helpers — FIX: never include me as a selectable option ──
  // friends already excludes the current user (built in App from bets data)
  const toggleP=name=>{
    const c=form.participants||[];
    set("participants",c.includes(name)?c.filter(n=>n!==name):[...c,name]);
  };
  const addCustomFriend=e=>{
    if(e.key==="Enter"&&e.target.value.trim()){
      const n=e.target.value.trim();
      // FIX: prevent adding own name
      if(n.toLowerCase()===me.toLowerCase()){e.target.value="";return;}
      if(!form.participants.includes(n)) set("participants",[...form.participants,n]);
      e.target.value="";
    }
  };

  // ── Probe available leagues when user picks "sports" ──
  useEffect(()=>{
    if(realSource !== "sports") return;
    setLeaguesLoading(true);
    setAvailableLeagues([]);
    setSelectedLeague(null);
    fetchAvailableLeagues().then(leagues=>{
      setAvailableLeagues(leagues);
      setLeaguesLoading(false);
    });
  },[realSource]);

  // ── Load ESPN games when league is selected (use preloaded if available) ──
  useEffect(()=>{
    if(!selectedLeague) return;
    // If we already probed this league, use those results instantly
    if(selectedLeague._preloadedGames){
      setEspnGames(selectedLeague._preloadedGames.filter(g=>!g.completed));
      setSelectedGame(null);setPickLines([]);setSelectedPickLines({});
      return;
    }
    setEspnLoading(true);setEspnGames([]);setSelectedGame(null);setPickLines([]);setSelectedPickLines({});
    fetchESPNGames(selectedLeague).then(games=>{setEspnGames(games);setEspnLoading(false);});
  },[selectedLeague]);

  // ── Build pick lines from selected game ──
  const buildPickLinesForGame=(game)=>{
    if(!game) return [];
    const lines=[
      {id:"winner",label:`🏆 Match Winner`,options:[game.homeTeam,game.awayTeam]},
      {id:"home_score",label:`📊 ${game.homeTeam} score`,options:[`Over 100`,`Under 100`,`Exact: custom`]},
      {id:"away_score",label:`📊 ${game.awayTeam} score`,options:[`Over 100`,`Under 100`,`Exact: custom`]},
      {id:"margin",label:`📏 Winning margin`,options:["1-5 pts","6-15 pts","16+ pts"]},
    ];
    return lines;
  };

  const handleSelectGame=(game)=>{
    setSelectedGame(game);
    const lines=buildPickLinesForGame(game);
    setPickLines(lines);
    // auto-select match winner line
    setSelectedPickLines({"winner":true});
    setPicks({});
  };

  // ── Crew component — shared between flows ──
  const CrewStep=()=>(
    <div className="fg">
      <label className="fl">Who's In? * (you're already included)</label>
      <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem",marginBottom:"0.75rem"}}>
        {/* FIX: friends list already excludes `me`, so no "You" option appears here */}
        {friends.map(f=>(
          <div key={f} className={`topt ${(form.participants||[]).includes(f)?"sel":""}`}
            style={{flex:"none",padding:"0.45rem 1rem",fontSize:"0.82rem"}} onClick={()=>toggleP(f)}>
            {(form.participants||[]).includes(f)?"✓ ":""}{f}
          </div>
        ))}
      </div>
      <input className="fi" placeholder="+ New friend name — press Enter" onKeyDown={addCustomFriend}/>
      {(form.participants||[]).length>0&&(
        <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginTop:"0.6rem"}}>
          {(form.participants||[]).map(p=>(
            <span key={p} className="participant-tag">{p}<span className="rm" onClick={()=>toggleP(p)}>✕</span></span>
          ))}
        </div>
      )}
      {(form.participants||[]).length>0&&(
        <div style={{background:"rgba(255,224,58,0.06)",border:"1px solid rgba(255,224,58,0.2)",borderRadius:10,padding:"0.75rem",fontSize:"0.82rem",marginTop:"0.6rem"}}>
          {(form.participants||[]).length>1?"👥 Group Bet! ":"🤜 Head-to-head! "}<strong>{me}</strong> vs <strong>{(form.participants||[]).join(", ")}</strong>
        </div>
      )}
    </div>
  );

  // ── Stakes step — shared ──
  const StakesStep=()=>(
    <>
      <div className="fg">
        <label className="fl">Wager Type</label>
        <div className="row">
          <div className={`tcard ${form.stakeType==="friendly"?"sel":""}`} onClick={()=>set("stakeType","friendly")}>
            <div className="ti">🤝</div><div className="tl">Friendly</div><div className="td">Bragging rights</div>
          </div>
          <div className={`tcard ${form.stakeType==="money"?"sel":""}`} onClick={()=>set("stakeType","money")}>
            <div className="ti">💵</div><div className="tl">Real Money</div><div className="td">Tracked in app</div>
          </div>
        </div>
      </div>
      {form.stakeType==="money"&&(
        <div className="fg">
          <label className="fl">Amount Per Person</label>
          <SmartAmountPicker value={form.stake} onChange={v=>set("stake",v)} avg={avg} vibe={vibe} participantCount={(form.participants||[]).length+1}/>
        </div>
      )}
      <div className="fg">
        <label className="fl" style={{marginBottom:"0.15rem"}}>🔁 Recurring Bet</label>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <div style={{flex:1,fontSize:"0.78rem",color:"var(--muted)"}}>Auto-reset when it expires</div>
          <div className={`topt ${form.recurring?"sel":""}`} style={{flex:"none",padding:"0.4rem 1rem",fontSize:"0.82rem"}} onClick={()=>set("recurring",!form.recurring)}>
            {form.recurring?"🔁 On":"Off"}
          </div>
        </div>
      </div>
      {form.recurring&&(
        <div className="row">
          {["weekly","monthly"].map(f=>(
            <div key={f} className={`topt ${form.recurFreq===f?"sel":""}`} onClick={()=>set("recurFreq",f)} style={{fontSize:"0.82rem"}}>
              {f==="weekly"?"📅 Weekly":"🗓️ Monthly"}
            </div>
          ))}
        </div>
      )}
    </>
  );

  // ── Assign picks step ──
  // FIX: All players must have a pick assigned; Next button is blocked until complete
  const allRealPlayers=[me,...(form.participants||[])];

  const AssignPicksStep=({lines,linePicks,setLinePicks})=>{
    const activeLines=lines.filter(l=>selectedPickLines[l.id]);
    if(activeLines.length===0) return <div style={{color:"var(--muted)",fontSize:"0.85rem"}}>No betting lines selected.</div>;

    const allAssigned=activeLines.every(line=>
      allRealPlayers.every(p=>linePicks[line.id]&&linePicks[line.id][p])
    );

    return(
      <div>
        <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:"0.85rem"}}>
          Assign each player's pick for every betting line. Everyone must have a pick before proceeding.
        </div>
        {activeLines.map(line=>(
          <div key={line.id} className="wager-line-row" style={{marginBottom:"0.75rem"}}>
            <div className="wager-line-title">{line.label}</div>
            {allRealPlayers.map(p=>{
              const currentPick=linePicks[line.id]?.[p]||"";
              return(
                <div key={p} style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.4rem"}}>
                  <Avatar name={p} color={COLORS[p.charCodeAt(0)%COLORS.length]} size={26}/>
                  <span style={{fontSize:"0.82rem",fontWeight:700,width:72,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {p===me?`${p} ⭐`:p}
                  </span>
                  <select className="fi fs" style={{flex:1,padding:"0.4rem 0.65rem",fontSize:"0.82rem"}}
                    value={currentPick}
                    onChange={e=>{
                      setLinePicks(prev=>({...prev,[line.id]:{...(prev[line.id]||{}),[p]:e.target.value}}));
                    }}>
                    <option value="">-- Pick --</option>
                    {line.options.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              );
            })}
          </div>
        ))}
        {!allAssigned&&(
          <div style={{background:"rgba(255,107,53,0.1)",border:"1px solid rgba(255,107,53,0.3)",borderRadius:10,padding:"0.6rem 0.85rem",fontSize:"0.8rem",color:"var(--orange)",fontWeight:700}}>
            ⚠️ All players need a pick assigned to continue.
          </div>
        )}
      </div>
    );
  };

  // ── Custom assign picks (yes/no or custom options) ──
  const [customOptions,setCustomOptions]=useState(["Yes","No"]);
  const [customLinePicks,setCustomLinePicks]=useState({});
  const allCustomAssigned=allRealPlayers.every(p=>customLinePicks["main"]&&customLinePicks["main"][p]);

  // ── Real picks check ──
  const allRealPicksAssigned=pickLines.filter(l=>selectedPickLines[l.id]).every(line=>
    allRealPlayers.every(p=>picks[line.id]&&picks[line.id][p])
  );

  // ── Step metadata ──
  const REAL_STEPS=["👥 The Crew","📡 Data Source","🏟️ Select Game","🎯 Pick Lines","🃏 Assign Picks","⚖️ Stakes"];
  const CUSTOM_STEPS=["🎲 The Wager","👥 The Crew","🃏 Assign Picks","⚖️ Stakes"];
  const stepLabels=betType==="real"?REAL_STEPS:betType==="custom"?CUSTOM_STEPS:[];
  const currentStep=betType==="real"?realStep:customStep;

  const goBack=()=>{
    if(betType==="real"){if(realStep===0)setBetType(null);else setRealStep(s=>s-1);}
    else if(betType==="custom"){if(customStep===0)setBetType(null);else setCustomStep(s=>s-1);}
    else onClose();
  };

  // FIX: canNext enforces participant selection and pick assignment at relevant steps
  const canNext=()=>{
    if(!betType) return false;
    if(betType==="real"){
      if(realStep===0) return (form.participants||[]).length>0; // crew required first
      if(realStep===1) return !!realSource;
      if(realStep===2){
        if(realSource==="sports") return !leaguesLoading && !!selectedLeague;
        return true; // weather goes straight to query
      }
      if(realStep===3){
        if(realSource==="sports") return !!selectedGame;
        return eventQuery.trim().length>4;
      }
      if(realStep===4) return Object.keys(selectedPickLines).length>0; // at least one pick line
      if(realStep===5) return allRealPicksAssigned; // FIX: all picks must be assigned
      return true;
    }
    if(betType==="custom"){
      if(customStep===0) return !!form.title.trim();
      if(customStep===1) return (form.participants||[]).length>0; // crew required
      if(customStep===2) return allCustomAssigned; // FIX: all picks must be assigned
      return true;
    }
    return false;
  };

  const isLastStep=betType==="real"?realStep===5:betType==="custom"?customStep===3:false;

  const handleCreate=async()=>{
    setSaving(true);
    await new Promise(r=>setTimeout(r,350));

    let title=form.title;
    let autoQuery="";
    let eventDate=null;

    if(betType==="real"){
      if(realSource==="sports"&&selectedGame){
        title=selectedGame.name;
        autoQuery=selectedGame.name;
        eventDate=selectedGame.date;
      } else {
        title=eventQuery;
        autoQuery=eventQuery;
      }
    }

    // Flatten all picks for storage
    const allPicks={};
    if(betType==="real"){
      Object.entries(picks).forEach(([lineId,playerPicks])=>{
        if(selectedPickLines[lineId]){
          Object.entries(playerPicks).forEach(([player,pick])=>{
            allPicks[`${player}__${lineId}`]=pick;
          });
        }
      });
    } else {
      if(customLinePicks["main"]){
        Object.entries(customLinePicks["main"]).forEach(([player,pick])=>{
          allPicks[player]=pick;
        });
      }
    }

    onCreate({
      id:uid(),
      title,
      notes:form.notes,
      participants:form.participants,
      stakeType:form.stakeType,
      stake:form.stakeType==="money"?parseFloat(form.stake)||0:null,
      creator:me,
      status:"active",
      settled:false,
      settlementNote:"",
      category:betType==="real"?"auto":"manual",
      autoQuery,
      eventDate,
      createdAt:Date.now(),
      expiresAt:betType==="real"&&eventDate?new Date(eventDate).getTime()+3600000:Date.now()+parseInt(form.expiresIn||"7")*86400000,
      result:null,resolvedBy:null,proposedOutcome:null,reactions:{},
      recurring:form.recurring?{enabled:true,frequency:form.recurFreq}:null,
      picks:allPicks,
      pickLines:betType==="real"?pickLines.filter(l=>selectedPickLines[l.id]):null,
    });
    setSaving(false);onClose();
  };

  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:"1.2rem",right:"1.2rem",background:"none",border:"none",fontSize:"1.2rem",cursor:"pointer",color:"var(--muted)",zIndex:10}}>✕</button>

        {betType&&(
          <div className="steps" style={{marginBottom:"0.75rem"}}>
            {stepLabels.map((_,i)=><div key={i} className={`step ${i<=currentStep?"done":""}`}/>)}
          </div>
        )}

        {/* ── Choose bet type ── */}
        {!betType&&(
          <>
            <div className="modal-title">🎲 New Wager</div>
            <div style={{fontSize:"0.88rem",color:"var(--muted)",marginBottom:"1.25rem"}}>What kind of bet is this?</div>
            <div className="row" style={{marginBottom:"0.75rem"}}>
              <div className="tcard" style={{borderColor:"var(--cyan)",background:"rgba(0,237,212,0.05)"}} onClick={()=>setBetType("real")}>
                <div className="ti">📡</div>
                <div className="tl">Real Event</div>
                <div className="td">Sports, weather — auto-verified by live data</div>
              </div>
              <div className="tcard" onClick={()=>setBetType("custom")}>
                <div className="ti">🎲</div>
                <div className="tl">Custom Bet</div>
                <div className="td">Anything goes — you and your crew decide the outcome</div>
              </div>
            </div>
            <div className="divider"/>
            <button className="btn bg b-full" onClick={onClose}>Cancel</button>
          </>
        )}

        {/* ══ REAL EVENT FLOW ══ */}
        {betType==="real"&&(
          <>
            <div className="modal-title">{REAL_STEPS[realStep]}</div>

            {/* Step 0: Crew FIRST — FIX: crew is selected before anything else */}
            {realStep===0&&<CrewStep/>}

            {/* Step 1: Data source */}
            {realStep===1&&(
              <div className="fg">
                <label className="fl">What kind of real event?</label>
                <div className="row">
                  <div className={`tcard ${realSource==="sports"?"sel":""}`} onClick={()=>setRealSource("sports")}>
                    <div className="ti">🏟️</div><div className="tl">Sports</div><div className="td">Live ESPN data</div>
                  </div>
                  <div className={`tcard ${realSource==="weather"?"sel":""}`} onClick={()=>setRealSource("weather")}>
                    <div className="ti">🌤️</div><div className="tl">Weather</div><div className="td">Open-Meteo forecast</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: League selection (sports) or weather query */}
            {realStep===2&&realSource==="sports"&&(
              <div className="fg">
                <label className="fl">Select a League</label>
                {leaguesLoading&&(
                  <div>
                    <div style={{fontSize:"0.8rem",color:"var(--muted)",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
                      <span style={{display:"inline-block",animation:"float 1s ease-in-out infinite"}}>📡</span>
                      Checking for upcoming games across all leagues…
                    </div>
                    {[1,2,3,4].map(i=><div key={i} className="shimmer" style={{height:"62px",borderRadius:11,marginBottom:"0.5rem"}}/>)}
                  </div>
                )}
                {!leaguesLoading&&availableLeagues.length===0&&(
                  <div style={{color:"var(--muted)",fontSize:"0.85rem",textAlign:"center",padding:"2rem 0"}}>
                    No upcoming games found in the next 8 days across any league. Try again later.
                  </div>
                )}
                {!leaguesLoading&&availableLeagues.length>0&&(
                  <>
                    {/* Group: Olympics (show first if present) */}
                    {availableLeagues.some(l=>l.group==="olympics")&&(
                      <>
                        <div style={{fontSize:"0.7rem",fontWeight:800,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--yellow)",marginBottom:"0.5rem"}}>🎖️ Olympics — Milan-Cortina 2026</div>
                        <div className="league-grid" style={{marginBottom:"1rem"}}>
                          {availableLeagues.filter(l=>l.group==="olympics").map(lg=>(
                            <div key={lg.id} className={`league-card ${selectedLeague?.id===lg.id?"sel":""}`} onClick={()=>setSelectedLeague(lg)}>
                              <div className="le">{lg.emoji}</div>
                              <div className="ll">{lg.label}</div>
                              <div className="ls">{lg._preloadedGames?.length} game{lg._preloadedGames?.length!==1?"s":""}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{fontSize:"0.7rem",fontWeight:800,letterSpacing:"0.07em",textTransform:"uppercase",color:"var(--muted)",marginBottom:"0.5rem",marginTop:"0.25rem"}}>🏟️ Professional Leagues</div>
                      </>
                    )}
                    <div className="league-grid">
                      {availableLeagues.filter(l=>l.group!=="olympics").map(lg=>(
                        <div key={lg.id} className={`league-card ${selectedLeague?.id===lg.id?"sel":""}`} onClick={()=>setSelectedLeague(lg)}>
                          <div className="le">{lg.emoji}</div>
                          <div className="ll">{lg.label}</div>
                          <div className="ls">{lg._preloadedGames?.length} game{lg._preloadedGames?.length!==1?"s":""} upcoming</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3: Game selection */}
            {realStep===3&&realSource==="sports"&&(
              <div>
                <div style={{fontSize:"0.78rem",color:"var(--cyan)",fontWeight:700,marginBottom:"0.75rem"}}>
                  {selectedLeague?.emoji} {selectedLeague?.label} — Next 7 Days
                </div>
                {espnLoading&&[1,2,3].map(i=><div key={i} className="shimmer" style={{height:"58px",marginBottom:"0.5rem"}}/>)}
                {!espnLoading&&espnGames.length===0&&(
                  <div style={{color:"var(--muted)",fontSize:"0.85rem",textAlign:"center",padding:"2rem 0"}}>
                    No upcoming games found. Try another league or check back later.
                  </div>
                )}
                {espnGames.map(game=>(
                  <div key={game.id} className={`game-card ${selectedGame?.id===game.id?"sel":""}`} onClick={()=>handleSelectGame(game)}>
                    <div className="game-teams">
                      <span>{game.awayTeam}</span>
                      <span style={{color:"var(--pink)",fontSize:"0.75rem",fontFamily:"var(--font-head)"}}>@</span>
                      <span>{game.homeTeam}</span>
                    </div>
                    <div className="game-date">📅 {new Date(game.date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})} · {game.status}</div>
                  </div>
                ))}
                {/* Weather query for weather source */}
              </div>
            )}

            {/* Step 3 weather */}
            {realStep===3&&realSource==="weather"&&(
              <div className="fg">
                <label className="fl">What's the weather question?</label>
                <textarea className="fta fi" rows={2}
                  placeholder='"Will it snow in Chicago this Saturday?" or "Rain in NYC this weekend?"'
                  value={eventQuery} onChange={e=>setEventQuery(e.target.value)}/>
                <div className="detected-pill" style={{background:"rgba(56,189,248,0.1)",borderColor:"rgba(56,189,248,0.3)",color:"var(--blue)"}}>
                  🌤️ Open-Meteo will verify automatically
                </div>
              </div>
            )}

            {/* Step 4: Pick Lines */}
            {realStep===4&&(
              <div>
                <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:"0.85rem"}}>
                  Select what you want to bet on for <strong>{selectedGame?.name||eventQuery}</strong>. You can pick multiple lines.
                </div>
                {pickLines.map(line=>(
                  <div key={line.id} className={`pick-line ${selectedPickLines[line.id]?"sel":""}`}
                    onClick={()=>setSelectedPickLines(prev=>({...prev,[line.id]:!prev[line.id]}))}>
                    {selectedPickLines[line.id]?"✓ ":""}{line.label}
                    <span style={{color:"var(--muted)",fontSize:"0.73rem",marginLeft:"0.5rem",fontWeight:400}}>
                      ({line.options.join(" / ")})
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Assign picks — FIX: blocked until all assigned */}
            {realStep===5&&(
              <AssignPicksStep
                lines={pickLines}
                linePicks={picks}
                setLinePicks={setPicks}
              />
            )}

            {/* Step 6 would be stakes — but we mapped to realStep 5 as last real step before stakes */}
            {/* Actually stakes is handled in last step check below */}
            {realStep===5&&false&&<StakesStep/>}
          </>
        )}

        {/* ── Real Event: Stakes is step 5+1 shown as last step ── */}
        {betType==="real"&&realStep===5&&false&&<StakesStep/>}

        {/* ══ CUSTOM BET FLOW ══ */}
        {betType==="custom"&&(
          <>
            <div className="modal-title">{CUSTOM_STEPS[customStep]}</div>

            {/* Step 0: The question */}
            {customStep===0&&(
              <>
                <div className="fg">
                  <label className="fl">The Big Question *</label>
                  <textarea className="fta fi" rows={3}
                    placeholder='"Will Dave survive the camping trip without complaining?"'
                    value={form.title} onChange={e=>set("title",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Trash Talk / Notes 🌶️</label>
                  <input className="fi" placeholder="Add some spice..." value={form.notes} onChange={e=>set("notes",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Silliness Vibe</label>
                  <input type="range" min="0" max="2" value={vibe} onChange={e=>setVibe(parseInt(e.target.value))}/>
                  <div className="vibe-track"><span>😂 Silly</span><span>😎 Casual</span><span>🎯 Serious</span></div>
                </div>
              </>
            )}

            {/* Step 1: Crew */}
            {customStep===1&&<CrewStep/>}

            {/* Step 2: Assign picks — FIX: blocked until all assigned */}
            {customStep===2&&(
              <div>
                <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:"0.85rem"}}>
                  Each player needs a pick — agree on the options, then assign.
                </div>
                <div className="fg">
                  <label className="fl">Possible Outcomes</label>
                  {customOptions.map((o,i)=>(
                    <input key={i} className="fi" style={{marginBottom:"0.4rem"}} placeholder={`Outcome ${i+1}`}
                      value={o} onChange={e=>{const n=[...customOptions];n[i]=e.target.value;setCustomOptions(n);setPicks({});setCustomLinePicks({});}}/>
                  ))}
                  <button className="btn b-sm bg" style={{marginTop:"0.2rem"}} onClick={()=>setCustomOptions([...customOptions,""])}>+ Add Option</button>
                </div>
                <div className="fg">
                  <label className="fl">Assign Picks</label>
                  {allRealPlayers.map(p=>{
                    const cur=customLinePicks["main"]?.[p]||"";
                    return(
                      <div key={p} style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.45rem",background:"var(--bg3)",borderRadius:9,padding:"0.45rem 0.75rem"}}>
                        <Avatar name={p} color={COLORS[p.charCodeAt(0)%COLORS.length]} size={26}/>
                        <span style={{fontSize:"0.82rem",fontWeight:700,width:72,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {p===me?`${p} ⭐`:p}
                        </span>
                        <select className="fi fs" style={{flex:1,padding:"0.4rem 0.65rem",fontSize:"0.82rem"}}
                          value={cur}
                          onChange={e=>setCustomLinePicks(prev=>({...prev,main:{...(prev.main||{}),[p]:e.target.value}}))}>
                          <option value="">-- Pick --</option>
                          {customOptions.filter(Boolean).map(o=><option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    );
                  })}
                </div>
                {!allCustomAssigned&&(
                  <div style={{background:"rgba(255,107,53,0.1)",border:"1px solid rgba(255,107,53,0.3)",borderRadius:10,padding:"0.6rem 0.85rem",fontSize:"0.8rem",color:"var(--orange)",fontWeight:700}}>
                    ⚠️ All players need a pick assigned to continue.
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Stakes */}
            {customStep===3&&<StakesStep/>}
          </>
        )}

        {/* ── Stakes shown as last step for real event flow ── */}
        {betType==="real"&&realStep===5&&(
          <>
            <div className="divider" style={{margin:"0.5rem 0"}}/>
            <div style={{fontFamily:"var(--font-head)",fontSize:"1.1rem",color:"var(--yellow)",marginBottom:"1rem"}}>⚖️ Stakes</div>
            <StakesStep/>
          </>
        )}

        {/* ── Nav ── */}
        {betType&&(
          <>
            <div className="divider"/>
            <div className="row" style={{justifyContent:"space-between"}}>
              <button className="btn bg" onClick={goBack}>
                {currentStep===0?"← Change Type":"← Back"}
              </button>
              {isLastStep
                ?<button className="btn bp" onClick={handleCreate}
                    disabled={saving||!canNext()}>
                   {saving?"Creating...":"🎲 Place Wager!"}
                 </button>
                :<button className="btn bp" onClick={()=>{
                    if(betType==="real") setRealStep(s=>s+1);
                    else setCustomStep(s=>s+1);
                  }} disabled={!canNext()}>
                  Next →
                 </button>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── BET DETAIL MODAL ─────────────────────────── */
function BetDetailModal({bet,me,onClose,onUpdate,onWin,onLose}){
  const [aiResult,setAiResult]=useState(null);
  const [resolving,setResolving]=useState(false);
  const [propWinner,setPropWinner]=useState("");
  const [propNote,setPropNote]=useState("");
  const [showPicker,setShowPicker]=useState(false);
  const isWin=bet.result?.winner===me;
  // FIX: allPlayers built from actual names, not including "You" as literal string
  const allPlayers=[bet.creator,...(bet.participants||[])];
  const isResolved=bet.status==="resolved";

  // FIX: auto-resolve section no longer references "settle" — just determines who won
  const autoResolve=async()=>{
    setResolving(true);
    const query=(bet.autoQuery||bet.title||"").toLowerCase();
    const isSports=/\b(nba|nfl|nhl|mlb|soccer|football|basketball|baseball|hockey|game|match|score|vs\.?|versus|beat|win|winner|final score|super bowl|world series|playoffs|champion)\b/.test(query);
    const isWeather=/\b(rain|snow|weather|forecast|temperature|sunny|cloudy|storm|hurricane|tornado|wind)\b/.test(query);

    if(isSports){
      try{
        const leagueHints=[
          {kw:/\b(nba|basketball|lakers|celtics|warriors|bucks|bulls|nets|heat|knicks|suns|nuggets)\b/,slug:"basketball/nba"},
          {kw:/\b(nfl|football|patriots|chiefs|eagles|cowboys|giants|49ers|seahawks|packers)\b/,slug:"football/nfl"},
          {kw:/\b(mlb|baseball|yankees|dodgers|red sox|cubs|mets|braves|astros)\b/,slug:"baseball/mlb"},
          {kw:/\b(nhl|hockey|penguins|bruins|blackhawks|rangers|maple leafs|canadiens)\b/,slug:"hockey/nhl"},
        ];
        let slug="basketball/nba";
        for(const l of leagueHints){if(l.kw.test(query)){slug=l.slug;break;}}
        const today=new Date().toISOString().slice(0,10).replace(/-/g,"");
        const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10).replace(/-/g,"");
        // Use YYYYMMDD-YYYYMMDD range (yesterday through today) to catch recently completed games
        const dateRange=`${yesterday}-${today}`;
        const espnRes=await fetch(`https://site.api.espn.com/apis/site/v2/sports/${slug}/scoreboard?dates=${dateRange}&limit=100`,{signal:AbortSignal.timeout(5000)});
        if(espnRes.ok){
          const espnData=await espnRes.json();
          const events=espnData.events||[];
          let bestEvent=null,bestScore=0;
          for(const ev of events){
            const evStr=(ev.name||"").toLowerCase();
            const words=query.split(/\W+/).filter(w=>w.length>3);
            const matches=words.filter(w=>evStr.includes(w)).length;
            if(matches>bestScore){bestScore=matches;bestEvent=ev;}
          }
          if(bestEvent){
            const comps=bestEvent.competitions?.[0];
            if(comps?.status?.type?.completed){
              const [home,away]=comps.competitors||[];
              const homeTeam=home?.team?.displayName||"Home";
              const awayTeam=away?.team?.displayName||"Away";
              const homeScore=parseInt(home?.score||0);
              const awayScore=parseInt(away?.score||0);
              const winningTeam=homeScore>awayScore?homeTeam:awayScore>homeScore?awayTeam:"Tie";
              const summary=`${awayTeam} ${awayScore} – ${homeTeam} ${homeScore}. ${winningTeam==="Tie"?"It's a tie!":winningTeam+" won."}`;
              let pickedWinner="";
              if(bet.picks){
                const entry=Object.entries(bet.picks).find(([k,p])=>{
                  const playerName=k.split("__")[0];
                  return p.toLowerCase().includes(winningTeam.toLowerCase().split(" ").pop());
                });
                if(entry) pickedWinner=entry[0].split("__")[0];
              }
              setAiResult({resolved:true,winner:pickedWinner||winningTeam,summary,confidence:"high",source:"ESPN"});
              setResolving(false);return;
            } else {
              const statusDesc=comps?.status?.type?.description||"In progress";
              setAiResult({resolved:false,winner:"",summary:`⏳ Game status: ${statusDesc}. Check back after the game ends.`,confidence:"high",source:"ESPN"});
              setResolving(false);return;
            }
          }
        }
      }catch(e){}
    }

    if(isWeather){
      try{
        const cityMatch=query.match(/(?:in|at|for)\s+([a-z\s]+?)(?:\s+(?:this|next|on|weather|rain|snow|forecast|saturday|sunday|monday|tuesday|wednesday|thursday|friday)|$)/i);
        const cityName=cityMatch?.[1]?.trim()||"New York";
        const geoRes=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`,{signal:AbortSignal.timeout(5000)});
        if(geoRes.ok){
          const geoData=await geoRes.json();
          const loc=geoData.results?.[0];
          if(loc){
            const wRes=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&daily=precipitation_sum,weathercode,temperature_2m_max&timezone=auto&forecast_days=7`,{signal:AbortSignal.timeout(5000)});
            if(wRes.ok){
              const wData=await wRes.json();
              const days=wData.daily;
              const dayNames=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
              const today=new Date();let targetIdx=1;
              for(let d=0;d<7;d++){
                const dayDate=new Date(today);dayDate.setDate(today.getDate()+d);
                const dayName=dayNames[dayDate.getDay()];
                if(query.includes(dayName)||query.includes("tomorrow")&&d===1||(query.includes("weekend")&&(dayDate.getDay()===6||dayDate.getDay()===0))){targetIdx=d;break;}
              }
              const precip=days.precipitation_sum?.[targetIdx]||0;
              const wcode=days.weathercode?.[targetIdx]||0;
              const willRain=precip>1||[61,63,65,71,73,75,80,81,82,95,96,99].includes(wcode);
              const willSnow=precip>1&&[71,73,75,77,85,86].includes(wcode);
              let outcome="No rain or snow";
              if(willSnow) outcome="Snow";
              else if(willRain) outcome="Rain";
              const precipDesc=precip>0?`${precip.toFixed(1)}mm of precipitation expected`:"No significant precipitation expected";
              const summary=`Open-Meteo forecast for ${loc.name}: ${precipDesc}. ${willSnow?"❄️ Snow likely!":willRain?"🌧️ Rain likely!":"☀️ Looks dry!"}`;
              let pickedWinner="";
              if(bet.picks){
                const entry=Object.entries(bet.picks).find(([,p])=>{
                  const pLow=p.toLowerCase();
                  return willSnow&&pLow.includes("snow")||willRain&&(pLow.includes("rain")||pLow.includes("yes"))||!willRain&&!willSnow&&(pLow.includes("no")||pLow.includes("dry")||pLow.includes("sun"));
                });
                if(entry) pickedWinner=entry[0].split("__")[0];
              }
              setAiResult({resolved:true,winner:pickedWinner||outcome,summary,confidence:"high",source:"Open-Meteo"});
              setResolving(false);return;
            }
          }
        }
      }catch(e){}
    }

    // AI fallback
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:500,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:`You are resolving a friendly bet. Bet: "${bet.title}". ${bet.autoQuery?"Context: "+bet.autoQuery:""}
${bet.picks?`Player picks: ${JSON.stringify(bet.picks)}`:""}
Search the web to find the real-world outcome. Respond ONLY with a valid JSON object (no markdown, no backticks):
{"resolved":true,"winner":"<name of player who won, matching a name from picks>","summary":"1-2 sentences on what happened","confidence":"high|medium|low"}
If the event hasn't happened yet: {"resolved":false,"winner":"","summary":"<explanation>","confidence":"high"}`}]
        })
      });
      if(!r.ok) throw new Error(`API ${r.status}`);
      const d=await r.json();
      const txt=d.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"{}";
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setAiResult({...parsed,source:"AI + Web Search"});
    }catch(e){
      setAiResult({resolved:false,winner:"",summary:`Could not auto-resolve: ${e.message}. Try again or resolve manually.`,confidence:"low",source:"Error"});
    }
    setResolving(false);
  };

  // FIX: acceptAI just marks winner — no settlement language
  const acceptAI=()=>{
    onUpdate({...bet,status:"resolved",result:{winner:aiResult.winner,description:aiResult.summary},resolvedBy:"auto"});
    onClose();
    if(aiResult.winner===me) onWin?.();
    else onLose?.();
  };

  const propose=()=>{
    if(!propWinner) return;
    onUpdate({...bet,proposedOutcome:{proposer:me,winner:propWinner,description:propNote}});
  };

  // FIX: acceptOutcome just records who won — no settlement/money language
  const acceptOutcome=()=>{
    const w=bet.proposedOutcome.winner;
    onUpdate({...bet,status:"resolved",result:{winner:w,description:bet.proposedOutcome.description||`${w} won the bet.`},resolvedBy:"manual",proposedOutcome:null});
    onClose();if(w===me)onWin?.();else onLose?.();
  };

  const addReaction=emoji=>{
    const cur=bet.reactions||{};
    const users=cur[emoji]||[];
    const updated=users.includes(me)?users.filter(u=>u!==me):[...users,me];
    onUpdate({...bet,reactions:{...cur,[emoji]:updated}});
    setShowPicker(false);
  };

  const displayName=n=>n===me?`${n} (you)`:n;

  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        {bet.status==="resolved"&&(
          <div className="result-banner" style={isWin
            ?{background:"linear-gradient(135deg,rgba(34,255,102,0.12),rgba(0,237,212,0.08))",border:"1px solid rgba(34,255,102,0.35)"}
            :{background:"linear-gradient(135deg,rgba(255,45,120,0.12),rgba(139,92,246,0.08))",border:"1px solid rgba(255,45,120,0.35)"}}>
            <div className="rb-icon">{isWin?"🏆":"😭"}</div>
            <h2 style={{color:isWin?"var(--green)":"var(--pink)"}}>{isWin?`${me} Wins!`:`${bet.result?.winner} Wins!`}</h2>
            <p style={{color:"var(--muted)",fontSize:"0.82rem",marginTop:"0.35rem"}}>{bet.result?.description}</p>
          </div>
        )}
        <div className="modal-title" style={{fontSize:"1rem",lineHeight:1.35}}>"{bet.title}"</div>
        <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",margin:"0.75rem 0 1rem"}}>
          <span className="tag">👥 {allPlayers.map(displayName).join(" · ")}</span>
          {bet.stakeType==="money"?<span className="tag">💵 {fmtMoney(bet.stake||0)}{(bet.participants||[]).length>1?" ea.":""}</span>:<span className="tag">🤝 Friendly</span>}
          {bet.category==="auto"&&<span className="tag" style={{color:"var(--cyan)",borderColor:"var(--cyan)"}}>📡 Data Feed</span>}
          {bet.recurring?.enabled&&<span className="tag">🔁 {bet.recurring.frequency}</span>}
          {/* FIX: for real event bets, show the event date (not an expiry) */}
          {bet.eventDate
            ?<span className="tag" style={{color:"var(--yellow)",borderColor:"var(--yellow)"}}>📅 Event: {fmt(bet.eventDate)}</span>
            :<span className="tag">📅 Created: {fmt(bet.createdAt)}</span>}
        </div>
        {bet.notes&&<div className="chat-bubble"><div className="chat-who">💬 Notes</div>"{bet.notes}"</div>}

        {/* Show picks if any */}
        {bet.picks&&Object.keys(bet.picks).length>0&&(
          <div style={{background:"var(--bg3)",borderRadius:10,padding:"0.75rem",marginBottom:"0.75rem"}}>
            <div className="fl" style={{marginBottom:"0.5rem"}}>🃏 Picks</div>
            {Object.entries(bet.picks).map(([k,p])=>{
              const player=k.includes("__")?k.split("__")[0]:k;
              const line=k.includes("__")?k.split("__")[1]:null;
              return(
                <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:"0.25rem"}}>
                  <span style={{color:"var(--muted)"}}>{displayName(player)}{line?<span style={{fontSize:"0.7rem",marginLeft:"0.3rem",color:"var(--purple)"}}>({line})</span>:null}</span>
                  <span style={{fontWeight:700,color:"var(--cyan)"}}>{p}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="reactions" style={{marginBottom:"0.75rem"}}>
          {Object.entries(bet.reactions||{}).filter(([,u])=>u.length).map(([emoji,users])=>(
            <button key={emoji} className={`reaction-btn ${users.includes(me)?"mine":""}`} onClick={()=>addReaction(emoji)}>
              {emoji}{users.length}
            </button>
          ))}
          <div className="add-reaction" onClick={()=>setShowPicker(v=>!v)}>+ React</div>
        </div>
        {showPicker&&(
          <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"0.75rem",background:"var(--bg3)",borderRadius:10,padding:"0.6rem"}}>
            {REACT_EMOJIS.map(e=><button key={e} className="reaction-btn" onClick={()=>addReaction(e)} style={{fontSize:"1.1rem"}}>{e}</button>)}
          </div>
        )}
        <div className="divider"/>

        {/* ── Auto-resolve (sports/weather) ── */}
        {bet.status==="active"&&bet.category==="auto"&&(
          <div style={{marginBottom:"1rem"}}>
            <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:"0.75rem"}}>
              📡 Live data: <span style={{color:"var(--cyan)"}}>🏟️ ESPN</span> for sports · <span style={{color:"var(--blue)"}}>🌤️ Open-Meteo</span> for weather · <span style={{color:"var(--purple)"}}>🤖 AI</span> for everything else.
            </div>
            {!aiResult
              ?<button className="btn bpu b-full" onClick={autoResolve} disabled={resolving}>
                 {resolving?"📡 Checking Live Data...":"📡 Check Result Now"}
               </button>
              :<>
                 <div className="chat-bubble" style={{background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.3)"}}>
                   <div className="chat-who" style={{color:"var(--purple)"}}>
                     {aiResult.source==="ESPN"?"🏟️ ESPN":aiResult.source==="Open-Meteo"?"🌤️ Open-Meteo":"🤖 AI + Web"} · confidence: {aiResult.confidence}
                   </div>
                   <div style={{fontWeight:700,marginBottom:"0.3rem"}}>{aiResult.resolved===false?"⏳ Not Yet":aiResult.winner||"Unknown"}</div>
                   <div style={{color:"var(--muted)",fontSize:"0.82rem"}}>{aiResult.summary}</div>
                 </div>
                 {/* FIX: "Accept Result" just records the winner — no settlement mention */}
                 <div className="row" style={{marginTop:"0.6rem"}}>
                   {aiResult.resolved!==false&&<button className="btn bs b-full" onClick={acceptAI}>✅ Confirm Winner</button>}
                   <button className="btn bg" onClick={()=>setAiResult(null)}>Retry</button>
                 </div>
               </>}
            <div className="divider"/>
          </div>
        )}

        {/* ── Manual outcome proposal ── */}
        {/* FIX: removed settlement language — this just agrees on who won */}
        {bet.status==="active"&&bet.category==="manual"&&!bet.proposedOutcome&&(
          <div>
            <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:"0.75rem"}}>
              Propose a winner — the other player(s) must agree before it's final.
            </div>
            <div className="fg">
              <label className="fl">Who Won?</label>
              <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
                {allPlayers.map(p=>(
                  <div key={p} className={`topt ${propWinner===p?"sel":""}`} style={{flex:"none",padding:"0.45rem 1rem",fontSize:"0.82rem"}} onClick={()=>setPropWinner(p)}>
                    {displayName(p)}
                  </div>
                ))}
              </div>
            </div>
            <div className="fg"><input className="fi" placeholder="What happened? (optional)" value={propNote} onChange={e=>setPropNote(e.target.value)}/></div>
            <button className="btn bp b-full" onClick={propose} disabled={!propWinner}>Propose Outcome →</button>
          </div>
        )}

        {bet.proposedOutcome&&(
          <div>
            <div className="chat-bubble" style={{background:"rgba(255,107,53,0.1)",border:"1px solid rgba(255,107,53,0.3)"}}>
              <div className="chat-who" style={{color:"var(--orange)"}}>📨 Proposed by {displayName(bet.proposedOutcome.proposer)}</div>
              <div style={{fontWeight:700}}>Winner: {displayName(bet.proposedOutcome.winner)}</div>
              {bet.proposedOutcome.description&&<div style={{color:"var(--muted)",fontSize:"0.82rem",marginTop:"0.25rem"}}>{bet.proposedOutcome.description}</div>}
            </div>
            {bet.proposedOutcome.proposer!==me
              ?<div className="row" style={{marginTop:"0.75rem"}}>
                 {/* FIX: button says "Agree" not "Accept & Settle" — settlement is handled separately in wallet */}
                 <button className="btn bs b-full" onClick={acceptOutcome}>✅ Agree — {displayName(bet.proposedOutcome.winner)} Won</button>
                 <button className="btn bd" onClick={()=>onUpdate({...bet,proposedOutcome:null})}>Dispute</button>
               </div>
              :<div style={{color:"var(--muted)",fontSize:"0.82rem",marginTop:"0.6rem",textAlign:"center"}}>
                 ⏳ Waiting for others to confirm…
               </div>
            }
          </div>
        )}

        {/* ── Dev: manual resolve button ── */}
        {bet.status==="active"&&(
          <div style={{marginTop:"0.75rem",paddingTop:"0.75rem",borderTop:"1px dashed rgba(139,92,246,0.2)"}}>
            <div style={{fontSize:"0.72rem",color:"var(--purple)",fontWeight:700,marginBottom:"0.4rem",textTransform:"uppercase",letterSpacing:"0.04em"}}>🧪 Test / Manual Override</div>
            <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
              {allPlayers.map(p=>(
                <button key={p} className="btn b-sm bpu" onClick={()=>{
                  onUpdate({...bet,status:"resolved",result:{winner:p,description:"Manually resolved for testing."},resolvedBy:"manual",proposedOutcome:null});
                  onClose();if(p===me)onWin?.();else onLose?.();
                }}>{displayName(p)} Wins</button>
              ))}
            </div>
          </div>
        )}

        <div className="divider" style={{marginTop:"1.25rem"}}/>
        <button className="btn bg b-full" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

/* ─────────────────────────── FEED TAB ─────────────────────────── */
function FeedTab({feed}){
  return(
    <div className="section">
      <div className="section-head">💬 Activity Feed</div>
      {feed.length===0
        ?<div className="empty"><div className="empty-icon">📭</div><h3>Nothing Yet</h3><p>Create a bet to get the party started!</p></div>
        :[...feed].reverse().map(f=>(
          <div key={f.id} className="feed-item">
            <div className="feed-meta"><span style={{fontSize:"1rem"}}>{f.emoji}</span><span style={{fontWeight:700,color:"var(--text)"}}>{f.actor}</span><span>·</span><span>{fmt(f.ts)}</span></div>
            <div className="feed-text">{f.text}</div>
          </div>
        ))
      }
    </div>
  );
}

/* ─────────────────────────── ACHIEVEMENTS TAB ─────────────────────────── */
function AchievementsTab({bets,me}){
  const stats=computeStats(bets,me);
  const unlocked=ACHIEVEMENTS.filter(a=>a.check(stats));
  const locked=ACHIEVEMENTS.filter(a=>!a.check(stats));
  return(
    <div className="section">
      <div className="section-head">🏅 Achievements <span style={{fontFamily:"var(--font-body)",fontSize:"0.82rem",color:"var(--muted)",fontWeight:500}}>{unlocked.length}/{ACHIEVEMENTS.length}</span></div>
      {stats.streak>1&&<div style={{marginBottom:"1.25rem"}}><span className="streak-badge">🔥 {stats.streak}-bet win streak!</span></div>}
      <div style={{marginBottom:"1.5rem"}}>
        <div style={{fontSize:"0.75rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.75rem",fontWeight:700}}>✅ Unlocked</div>
        {unlocked.length===0?<div style={{color:"var(--muted)",fontSize:"0.85rem"}}>Win your first bet to unlock achievements!</div>
          :<div className="ach-grid">{unlocked.map(a=><div key={a.id} className="ach-card unlocked"><div className="ach-emoji">{a.emoji}</div><div className="ach-name">{a.name}</div><div className="ach-desc">{a.desc}</div></div>)}</div>}
      </div>
      <div>
        <div style={{fontSize:"0.75rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.75rem",fontWeight:700}}>🔒 Locked</div>
        <div className="ach-grid">{locked.map(a=><div key={a.id} className="ach-card locked"><div className="ach-emoji">{a.emoji}</div><div className="ach-name">{a.name}</div><div className="ach-desc">{a.desc}</div></div>)}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────── WALLET TAB ─────────────────────────── */
// FIX: Wallet now has inline selectable bets per person; mark settled without opening detail
function WalletTab({bets,me,onUpdate}){
  const [selectedBetIds,setSelectedBetIds]=useState({});
  const [settleMethod,setSettleMethod]=useState({});

  // Build per-person resolved money bets
  const personBets={};
  bets.filter(b=>b.stakeType==="money"&&b.status==="resolved"&&b.stake).forEach(b=>{
    const others=[(b.creator!==me?b.creator:null),...(b.participants||[]).filter(p=>p!==me)].filter(Boolean);
    others.forEach(name=>{
      if(!personBets[name]) personBets[name]={unsettled:[],settled:[]};
      const bucket=b.settled?"settled":"unsettled";
      personBets[name][bucket].push(b);
    });
  });

  const unsettledPeople=Object.entries(personBets).filter(([,d])=>d.unsettled.length>0);
  const settledPeople=Object.entries(personBets).filter(([,d])=>d.settled.length>0);

  const netFor=(name,blist)=>blist.reduce((a,b)=>a+(b.result?.winner===me?b.stake:-b.stake),0);

  const toggleBet=(name,betId)=>{
    setSelectedBetIds(prev=>{
      const cur=prev[name]||{};
      return {...prev,[name]:{...cur,[betId]:!cur[betId]}};
    });
  };

  const markSelected=(name)=>{
    const sel=selectedBetIds[name]||{};
    const method=settleMethod[name]||"";
    const toSettle=personBets[name].unsettled.filter(b=>sel[b.id]);
    if(!toSettle.length) return;
    toSettle.forEach(b=>{
      onUpdate({...b,settled:true,settlementNote:method,settledAt:Date.now()});
    });
    setSelectedBetIds(prev=>({...prev,[name]:{}}));
  };

  const PersonSection=({name,data,settled})=>{
    const net=netFor(name,data);
    const list=data;
    const sel=selectedBetIds[name]||{};
    const anySelected=Object.values(sel).some(Boolean);

    return(
      <div style={{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:14,padding:"1.1rem",marginBottom:"0.85rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.85rem"}}>
          <Avatar name={name} color={COLORS[name.charCodeAt(0)%COLORS.length]} size={40}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:"0.95rem"}}>{name}</div>
            <div style={{fontSize:"0.75rem",color:"var(--muted)"}}>{list.length} bet{list.length!==1?"s":""}</div>
          </div>
          <div style={{fontFamily:"var(--font-head)",fontSize:"1.3rem",color:net>0?"var(--green)":net<0?"var(--pink)":"var(--muted)"}}>
            {net>0?"+":""}{fmtMoney(net)}
          </div>
        </div>

        {/* Individual bets — selectable for settlement */}
        {list.map(b=>{
          const iWon=b.result?.winner===me;
          const amt=iWon?b.stake:-b.stake;
          return(
            <div key={b.id}
              className={`wallet-card ${!settled&&sel[b.id]?"selected":""}`}
              style={{padding:"0.7rem 0.85rem",marginBottom:"0.4rem",cursor:settled?"default":"pointer"}}
              onClick={()=>!settled&&toggleBet(name,b.id)}>
              <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
                {!settled&&<div style={{width:18,height:18,borderRadius:4,border:`2px solid ${sel[b.id]?"var(--yellow)":"var(--border)"}`,background:sel[b.id]?"var(--yellow)":"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",color:"#06060e"}}>
                  {sel[b.id]?"✓":""}
                </div>}
                <div style={{flex:1}}>
                  <div style={{fontSize:"0.82rem",fontWeight:700,marginBottom:"0.15rem"}}>"{b.title.slice(0,50)}{b.title.length>50?"…":""}"</div>
                  <div style={{fontSize:"0.7rem",color:"var(--muted)"}}>{iWon?"You won":"You lost"} · {fmt(b.createdAt)}</div>
                  {settled&&b.settlementNote&&<div style={{fontSize:"0.7rem",color:"var(--green)",marginTop:"0.1rem"}}>✅ {b.settlementNote||"Settled"}</div>}
                </div>
                <div style={{fontFamily:"var(--font-head)",fontSize:"0.95rem",color:amt>0?"var(--green)":"var(--pink)",flexShrink:0}}>
                  {amt>0?"+":""}{fmtMoney(amt)}
                </div>
              </div>
            </div>
          );
        })}

        {!settled&&anySelected&&(
          <div style={{marginTop:"0.75rem",paddingTop:"0.75rem",borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:"0.75rem",color:"var(--muted)",marginBottom:"0.5rem",fontWeight:700,textTransform:"uppercase"}}>How was it settled?</div>
            <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"0.6rem"}}>
              {["💸 Venmo'd","💵 Cash","🍺 Bought drinks","🎯 Dare done","🤝 Other"].map(m=>(
                <div key={m} className={`topt ${settleMethod[name]===m?"sel":""}`}
                  style={{flex:"none",padding:"0.3rem 0.65rem",fontSize:"0.76rem"}}
                  onClick={()=>setSettleMethod(prev=>({...prev,[name]:prev[name]===m?"":m}))}>
                  {m}
                </div>
              ))}
            </div>
            <button className="btn bs b-full" onClick={()=>markSelected(name)}>
              ✅ Mark {Object.values(sel).filter(Boolean).length} Bet{Object.values(sel).filter(Boolean).length!==1?"s":""} as Settled
            </button>
          </div>
        )}
      </div>
    );
  };

  const totalUnsettledOwed=unsettledPeople.reduce((a,[name,d])=>a+Math.max(0,netFor(name,d.unsettled)),0);
  const totalUnsettledOwe=unsettledPeople.reduce((a,[name,d])=>a+Math.max(0,-netFor(name,d.unsettled)),0);

  return(
    <div className="section">
      <div className="section-head">💸 Wallet</div>
      <div className="row" style={{marginBottom:"1.75rem",flexWrap:"wrap"}}>
        <div style={{flex:1,background:"rgba(34,255,102,0.07)",border:"1px solid rgba(34,255,102,0.25)",borderRadius:14,padding:"1.1rem",textAlign:"center",minWidth:120}}>
          <div style={{color:"var(--muted)",fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>⚡ Owed to You</div>
          <div style={{fontFamily:"var(--font-head)",fontSize:"1.6rem",color:"var(--green)",marginTop:"0.35rem"}}>{fmtMoney(totalUnsettledOwed)}</div>
        </div>
        <div style={{flex:1,background:"rgba(255,45,120,0.07)",border:"1px solid rgba(255,45,120,0.25)",borderRadius:14,padding:"1.1rem",textAlign:"center",minWidth:120}}>
          <div style={{color:"var(--muted)",fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>⚡ You Owe</div>
          <div style={{fontFamily:"var(--font-head)",fontSize:"1.6rem",color:"var(--pink)",marginTop:"0.35rem"}}>{fmtMoney(totalUnsettledOwe)}</div>
        </div>
      </div>

      {unsettledPeople.length>0&&(
        <>
          <div className="wallet-section-head unsettled">⚡ Unsettled ({unsettledPeople.length} {unsettledPeople.length===1?"person":"people"})</div>
          <div style={{fontSize:"0.78rem",color:"var(--muted)",marginBottom:"0.85rem"}}>Select individual bets and mark them settled when done IRL.</div>
          {unsettledPeople.map(([name,d])=><PersonSection key={name} name={name} data={d.unsettled} settled={false}/>)}
        </>
      )}

      {unsettledPeople.length===0&&(
        <div className="empty" style={{padding:"2rem 1rem"}}>
          <div className="empty-icon">✅</div>
          <h3>All Square!</h3>
          <p>No outstanding debts. Clean slate.</p>
        </div>
      )}

      {settledPeople.length>0&&(
        <>
          <div className="wallet-section-head settled">✅ Settled History ({settledPeople.length})</div>
          {settledPeople.map(([name,d])=><PersonSection key={name} name={name} data={d.settled} settled={true}/>)}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────── LEADERBOARD TAB ─────────────────────────── */
function LeaderboardTab({bets,me}){
  const stats={};
  const add=n=>{if(!stats[n]) stats[n]={wins:0,losses:0,money:0,streak:0,maxStreak:0};};
  bets.filter(b=>b.status==="resolved").forEach(b=>{
    const all=[b.creator,...(b.participants||[])];
    all.forEach(add);
    const w=b.result?.winner;
    all.forEach(p=>{
      if(p===w){stats[p].wins++;stats[p].streak++;if(stats[p].streak>stats[p].maxStreak)stats[p].maxStreak=stats[p].streak;if(b.stakeType==="money")stats[p].money+=b.stake||0;}
      else{stats[p].losses++;stats[p].streak=0;}
    });
  });
  const rows=Object.entries(stats).sort((a,b)=>b[1].wins-a[1].wins||a[1].losses-b[1].losses);
  const RM=["🥇","🥈","🥉"];
  return(
    <div className="section">
      <div className="section-head">🏆 Leaderboard</div>
      {rows.length===0
        ?<div className="empty"><div className="empty-icon">🏆</div><h3>No Resolved Bets</h3><p>Finish some wagers to see standings!</p></div>
        :rows.map(([name,s],i)=>{
          const tot=s.wins+s.losses;
          const pct=tot?Math.round(s.wins/tot*100):0;
          return(
            <div key={name} className="lb-row" style={name===me?{borderColor:"rgba(255,224,58,0.35)",background:"rgba(255,224,58,0.04)"}:{}}>
              <div className="lb-rank">{RM[i]||`#${i+1}`}</div>
              <Avatar name={name} color={COLORS[name.charCodeAt(0)%COLORS.length]} size={38}/>
              <div className="lb-name">{name}{name===me&&<span style={{color:"var(--yellow)",fontSize:"0.72rem",marginLeft:"0.4rem"}}>(you)</span>}
                {s.maxStreak>=3&&<span style={{marginLeft:"0.4rem"}}>🔥</span>}
              </div>
              <div className="lb-stat"><div className="v"><span style={{color:"var(--green)"}}>{s.wins}W</span> · <span style={{color:"var(--pink)"}}>{s.losses}L</span></div><div className="l">Record</div></div>
              <div className="lb-stat"><div className="v" style={{color:"var(--cyan)"}}>{pct}%</div><div className="l">Win rate</div></div>
              {s.money>0&&<div className="lb-stat"><div className="v" style={{color:"var(--yellow)"}}>+${s.money}</div><div className="l">Earned</div></div>}
            </div>
          );
        })
      }
    </div>
  );
}

/* ─────────────────────────── PROFILE SETUP ─────────────────────────── */
function parseJwt(token){
  try{const b=token.split('.')[1];return JSON.parse(atob(b.replace(/-/g,'+').replace(/_/g,'/')));}
  catch{return null;}
}

function ProfileSetup({onComplete}){
  const [mode,setMode]=useState("choose");
  const [name,setName]=useState("");
  const [color,setColor]=useState(COLORS[0]);
  const googleRef=useRef(null);

  useEffect(()=>{
    if(mode!=="choose") return;
    const scriptId="google-gsi";
    if(!document.getElementById(scriptId)){
      const s=document.createElement("script");
      s.id=scriptId;s.src="https://accounts.google.com/gsi/client";s.async=true;
      s.onload=initGoogle;
      document.head.appendChild(s);
    } else { initGoogle(); }
  },[mode]);

  const initGoogle=()=>{
    if(!window.google||!googleRef.current) return;
    window.google.accounts.id.initialize({
      client_id:"612377430177-ok9v42p133i42ibg60tdlkmquqe9dbqr.apps.googleusercontent.com",
      callback:(resp)=>{
        const payload=parseJwt(resp.credential);
        if(!payload) return;
        const col=COLORS[payload.name.charCodeAt(0)%COLORS.length];
        onComplete({name:payload.given_name||payload.name,fullName:payload.name,email:payload.email,picture:payload.picture,color:col,provider:"google"});
      }
    });
    window.google.accounts.id.renderButton(googleRef.current,{theme:"outline",size:"large",width:320,text:"continue_with"});
  };

  if(mode==="manual") return(
    <div className="setup-wrap">
      <h1>Friendly<br/>Wagers</h1>
      <div className="setup-card">
        <div className="fg">
          <label className="fl">Your Name</label>
          <input className="fi" placeholder="What do your friends call you?" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&name.trim()&&onComplete({name:name.trim(),color})}/>
        </div>
        <div className="fg">
          <label className="fl">Pick Your Color</label>
          <div className="color-row">{COLORS.map(c=><div key={c} className={`cpick ${color===c?"chosen":""}`} style={{background:c}} onClick={()=>setColor(c)}/>)}</div>
        </div>
        <div style={{display:"flex",justifyContent:"center",margin:"0.5rem 0 1.25rem"}}>
          <Avatar name={name||"?"} color={color} size={56}/>
        </div>
        <div className="divider"/>
        <button className="btn bp b-full" disabled={!name.trim()} onClick={()=>onComplete({name:name.trim(),color})}>Let's Wager! 🎲</button>
        <button className="btn bg b-full" style={{marginTop:"0.5rem"}} onClick={()=>setMode("choose")}>← Back</button>
      </div>
    </div>
  );

  return(
    <div className="setup-wrap">
      <h1>Friendly<br/>Wagers</h1>
      <p style={{color:"var(--muted)",textAlign:"center",marginTop:"0.5rem"}}>The ultimate bet tracker for you & your crew 🎲</p>
      <div className="setup-card">
        <div style={{marginBottom:"1rem"}}>
          <div ref={googleRef} style={{display:"flex",justifyContent:"center",marginBottom:"0.75rem"}}/>
        </div>
        <div className="divider" style={{margin:"1rem 0"}}/>
        <div style={{textAlign:"center",color:"var(--muted)",fontSize:"0.82rem",marginBottom:"0.75rem"}}>or continue without an account</div>
        <button className="btn bg b-full" onClick={()=>setMode("manual")}>✏️ Enter name manually</button>
      </div>
    </div>
  );
}

/* ─────────────────────────── NOTIFICATIONS ─────────────────────────── */
function getNotifications(bets,me){
  const notifs=[];
  bets.forEach(b=>{
    const players=[b.creator,...(b.participants||[])];
    if(!players.includes(me)) return;
    if(b.status==="active"&&b.creator!==me&&players.includes(me)){
      notifs.push({id:b.id+"_new",betId:b.id,emoji:"🎲",title:`${b.creator} challenged you!`,sub:`"${b.title}"`,ts:b.createdAt});
    }
    if(b.proposedOutcome&&b.proposedOutcome.proposer!==me){
      notifs.push({id:b.id+"_prop",betId:b.id,emoji:"📨",title:`${b.proposedOutcome.proposer} proposed an outcome`,sub:`"${b.title}" — winner: ${b.proposedOutcome.winner}`,ts:Date.now()});
    }
    if(b.status==="resolved"&&!b.settled&&b.stakeType==="money"){
      notifs.push({id:b.id+"_settle",betId:b.id,emoji:"💸",title:"Unsettled money bet",sub:`"${b.title}"`,ts:b.createdAt});
    }
  });
  return notifs.sort((a,b)=>b.ts-a.ts);
}

/* ─────────────────────────── POLYFILL ─────────────────────────── */
if(typeof window!=="undefined"&&!window.storage){
  window.storage={
    get:async(k)=>{const v=localStorage.getItem(k);return v?{value:v}:null;},
    set:async(k,v)=>localStorage.setItem(k,v),
  };
}

/* ─────────────────────────── ROOT APP ─────────────────────────── */
export default function App(){
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("bets");
  const [bets,setBets]=useState(DEMO_BETS);
  const [feed,setFeed]=useState(DEMO_FEED);
  const [showCreate,setShowCreate]=useState(false);
  const [selectedBet,setSelectedBet]=useState(null);
  const [filter,setFilter]=useState("all");
  const [toasts,setToasts]=useState([]);
  const [showNotifs,setShowNotifs]=useState(false);
  const [readNotifIds,setReadNotifIds]=useState(new Set());
  const [devMode,setDevMode]=useState(false);
  const [povUser,setPovUser]=useState(null);

  useEffect(()=>{
    (async()=>{
      try{
        const u=await window.storage.get("fw_user3");if(u)setUser(JSON.parse(u.value));
        const b=await window.storage.get("fw_bets3");if(b)setBets(JSON.parse(b.value));
        const f=await window.storage.get("fw_feed3");if(f)setFeed(JSON.parse(f.value));
      }catch(e){}
    })();
  },[]);

  const saveUser=async u=>{setUser(u);try{await window.storage.set("fw_user3",JSON.stringify(u));}catch(e){}};
  const saveBets=async nb=>{setBets(nb);try{await window.storage.set("fw_bets3",JSON.stringify(nb));}catch(e){}};
  const saveFeed=async nf=>{setFeed(nf);try{await window.storage.set("fw_feed3",JSON.stringify(nf));}catch(e){}};

  const toast=(msg,type="ok")=>{const id=uid();setToasts(t=>[...t,{id,msg,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);};

  const realMe=user?.name||"Player";
  const me=povUser||realMe;

  // FIX: friends list EXCLUDES the current user (me) — so "You" is never a selectable option
  const friends=[...new Set(bets.flatMap(b=>[b.creator,...(b.participants||[])]).filter(n=>n!==me&&n!==realMe))];
  const allPlayers=[...new Set(bets.flatMap(b=>[b.creator,...(b.participants||[])]))];
  const avg=avgStake(bets,me);
  const stats=user?computeStats(bets,me):null;

  const notifications=getNotifications(bets,me);
  const unreadNotifs=notifications.filter(n=>!readNotifIds.has(n.id));
  const pendingCount=bets.filter(b=>(b.status==="pending"||b.proposedOutcome)&&(b.participants||[]).includes(me)).length;
  const unsettledCount=bets.filter(b=>b.status==="resolved"&&!b.settled&&b.stakeType==="money").length;

  const filteredBets=bets.filter(b=>{
    if(filter==="active") return b.status==="active";
    if(filter==="resolved") return b.status==="resolved";
    if(filter==="money") return b.stakeType==="money";
    if(filter==="group") return (b.participants||[]).length>1;
    if(filter==="recur") return b.recurring?.enabled;
    return true;
  });

  const handleCreate=bet=>{
    const nb=[bet,...bets]; saveBets(nb);
    const nf=[...feed,{id:uid(),type:"new_bet",actor:me,text:`challenged ${(bet.participants||[]).join(" & ")} to "${bet.title}"`,ts:Date.now(),emoji:"🎲"}];
    saveFeed(nf); toast("🎲 Wager placed! Challenge sent!");
  };

  const handleUpdate=updated=>{
    const nb=bets.map(b=>b.id===updated.id?updated:b); saveBets(nb);
    if(selectedBet?.id===updated.id) setSelectedBet(updated);
    if(updated.status==="resolved"&&updated.result){
      const isWin=updated.result?.winner===me;
      const nf=[...feed,{id:uid(),type:"resolved",actor:me,text:`${isWin?"won":"lost"} the bet — "${updated.title}" ${isWin?"🏆":"😭"}`,ts:Date.now(),emoji:isWin?"🏆":"😭"}];
      saveFeed(nf);
    }
  };

  const handleReact=(betId,emoji)=>{
    const bet=bets.find(b=>b.id===betId);if(!bet)return;
    const cur=bet.reactions||{};
    const users=cur[emoji]||[];
    const updated=users.includes(me)?users.filter(u=>u!==me):[...users,me];
    handleUpdate({...bet,reactions:{...cur,[emoji]:updated}});
  };

  const wins=bets.filter(b=>b.status==="resolved"&&b.result?.winner===me).length;
  const losses=bets.filter(b=>b.status==="resolved"&&b.result&&b.result.winner!==me).length;
  const activeCt=bets.filter(b=>b.status==="active").length;
  const atStake=bets.filter(b=>b.status==="active"&&b.stakeType==="money").reduce((a,b)=>a+(b.stake||0),0);

  if(!user) return <><style>{STYLE}</style><ProfileSetup onComplete={saveUser}/></>;

  const TABS=[
    {id:"bets",label:"Bets",dot:pendingCount>0},
    {id:"feed",label:"Feed 💬",dot:false},
    {id:"wallet",label:"Wallet 💸",dot:unsettledCount>0},
    {id:"leaderboard",label:"Board 🏆",dot:false},
    {id:"achievements",label:"🏅",dot:false},
  ];

  return(
    <>
      <style>{STYLE}</style>
      <div>
        <nav className="nav">
          <div className="nav-logo" onClick={()=>setTab("bets")}>🎲 Friendly Wagers</div>
          <div className="nav-tabs">
            {TABS.map(t=>(
              <button key={t.id} className={`nav-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
                {t.label}{t.dot&&<span className="notif-dot"/>}
              </button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <button onClick={()=>{setShowNotifs(v=>!v);setReadNotifIds(new Set(notifications.map(n=>n.id)));}}
              style={{position:"relative",background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:"1.2rem",padding:"0.25rem",lineHeight:1}}>
              🔔{unreadNotifs.length>0&&<span className="notif-badge">{unreadNotifs.length}</span>}
            </button>
            <button onClick={()=>{setDevMode(v=>!v);setPovUser(null);}}
              title="Toggle Dev/Test Mode"
              style={{background:devMode?"rgba(139,92,246,0.2)":"none",border:devMode?"1px solid var(--purple)":"none",borderRadius:7,cursor:"pointer",color:devMode?"var(--purple)":"var(--muted)",fontSize:"0.75rem",fontWeight:800,padding:"0.3rem 0.6rem"}}>
              {devMode?"🧪 DEV":"🧪"}
            </button>
            <div className="nav-right" onClick={()=>saveUser(null)} title="Click to reset profile">
              {user?.picture
                ?<img src={user.picture} style={{width:34,height:34,borderRadius:"50%",objectFit:"cover"}} alt={me}/>
                :<Avatar name={me} color={user?.color} size={34}/>}
            </div>
          </div>
        </nav>

        {showNotifs&&(
          <div className="notif-panel">
            <div style={{padding:"0.85rem 1rem",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"var(--font-head)",fontSize:"0.95rem",color:"var(--yellow)"}}>🔔 Notifications</span>
              <button onClick={()=>setShowNotifs(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:"1rem"}}>✕</button>
            </div>
            {notifications.length===0
              ?<div style={{padding:"1.5rem",textAlign:"center",color:"var(--muted)",fontSize:"0.85rem"}}>All caught up! 🎉</div>
              :notifications.map(n=>(
                <div key={n.id} className="notif-item" onClick={()=>{const b=bets.find(x=>x.id===n.betId);if(b){setSelectedBet(b);setShowNotifs(false);}}}>
                  <div className="notif-title">{n.emoji} {n.title}</div>
                  <div className="notif-sub">{n.sub}</div>
                </div>
              ))
            }
          </div>
        )}

        {devMode&&(
          <div className="dev-bar">
            <strong>🧪 DEV MODE</strong>
            <span style={{color:"var(--muted)"}}>View as:</span>
            <span className={`pov-pill ${!povUser?"active":""}`} onClick={()=>setPovUser(null)}>{realMe} (you)</span>
            {allPlayers.filter(p=>p!==realMe).map(p=>(
              <span key={p} className={`pov-pill ${povUser===p?"active":""}`} onClick={()=>setPovUser(p)}>{p}</span>
            ))}
          </div>
        )}

        {tab==="bets"&&(
          <>
            <div className="hero">
              <div className="hero-bg"/>
              <h1>Place Your Bets.</h1>
              <p>Challenge your crew. Settle debates. Collect glory.</p>
              <div className="stats-row">
                <div className="stat-chip">🔥 <span className="v">{activeCt}</span> Active</div>
                <div className="stat-chip"><span className="v" style={{color:"var(--green)"}}>{wins}W</span>&nbsp;–&nbsp;<span className="v" style={{color:"var(--pink)"}}>{losses}L</span></div>
                <div className="stat-chip">💵 <span className="v">${atStake.toFixed(0)}</span> at stake</div>
                {stats?.streak>1&&<div className="stat-chip">🔥 <span className="v" style={{color:"var(--orange)"}}>{stats.streak}</span>-streak</div>}
                <button className="btn bp" style={{borderRadius:50,padding:"0.45rem 1.3rem",fontSize:"0.85rem"}} onClick={()=>setShowCreate(true)}>+ New Wager</button>
              </div>
            </div>
            <div className="section">
              <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"1.25rem"}}>
                {[{id:"all",l:"All"},{id:"active",l:"🔥 Active"},{id:"resolved",l:"✅ Done"},{id:"money",l:"💵 Money"},{id:"group",l:"👥 Group"},{id:"recur",l:"🔁 Recurring"}].map(f=>(
                  <button key={f.id} className={`btn b-sm ${filter===f.id?"bp":"bg"}`} onClick={()=>setFilter(f.id)}>{f.l}</button>
                ))}
              </div>
              {filteredBets.length===0
                ?<div className="empty"><div className="empty-icon">🎲</div><h3>No Wagers Here</h3><p>Create a bet to kick things off!</p><button className="btn bp" style={{marginTop:"1.25rem"}} onClick={()=>setShowCreate(true)}>+ Create Wager</button></div>
                :<div className="bets-grid">{filteredBets.map(b=><BetCard key={b.id} bet={b} me={me} onClick={setSelectedBet} onReact={handleReact}/>)}</div>
              }
            </div>
          </>
        )}
        {tab==="feed"&&<FeedTab feed={feed}/>}
        {tab==="wallet"&&<WalletTab bets={bets} me={me} onUpdate={handleUpdate}/>}
        {tab==="leaderboard"&&<LeaderboardTab bets={bets} me={me}/>}
        {tab==="achievements"&&<AchievementsTab bets={bets} me={me}/>}

        {showCreate&&<CreateBetModal onClose={()=>setShowCreate(false)} onCreate={handleCreate} friends={friends} avg={avg} me={me}/>}
        {selectedBet&&(
          <BetDetailModal bet={selectedBet} me={me} onClose={()=>setSelectedBet(null)} onUpdate={handleUpdate}
            onWin={()=>{spawnConfetti();toast("🏆 YOU WON! Absolute legend.");}}
            onLose={()=>toast("😭 Rough one. Rematch?","err")}/>
        )}

        <div style={{position:"fixed",bottom:"1.5rem",right:"1.5rem",zIndex:9999,display:"flex",flexDirection:"column",gap:"0.4rem",alignItems:"flex-end"}}>
          {toasts.map(t=>(
            <div key={t.id} className="toast" style={{
              background:t.type==="err"?"rgba(255,45,120,0.14)":"rgba(34,255,102,0.12)",
              border:`1px solid ${t.type==="err"?"rgba(255,45,120,0.35)":"rgba(34,255,102,0.35)"}`,color:"var(--text)",
            }}>{t.msg}</div>
          ))}
        </div>

        {tab!=="bets"&&(
          <button onClick={()=>setShowCreate(true)} style={{
            position:"fixed",bottom:"1.5rem",left:"50%",transform:"translateX(-50%)",
            background:"var(--yellow)",color:"#06060e",border:"none",borderRadius:50,
            padding:"0.8rem 2rem",fontFamily:"var(--font-head)",fontSize:"0.95rem",cursor:"pointer",
            boxShadow:"0 4px 30px rgba(255,224,58,0.45)",animation:"float 3s ease-in-out infinite",zIndex:50,
          }}>+ New Wager</button>
        )}
      </div>
    </>
  );
}
