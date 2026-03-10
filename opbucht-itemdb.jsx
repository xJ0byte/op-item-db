import { useState, useEffect, useRef } from "react";

// ─── Fonts ──────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
document.head.appendChild(fontLink);

// ─── Global Styles ───────────────────────────────────────────────────────────
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080d10;
    --bg2: #0c1419;
    --bg3: #111c22;
    --bg4: #162028;
    --cyan: #00e5ff;
    --cyan2: #00b8cc;
    --cyan3: #007a8a;
    --cyan-glow: rgba(0,229,255,0.15);
    --cyan-glow2: rgba(0,229,255,0.08);
    --text: #e8f4f8;
    --text2: #8baab5;
    --text3: #4a6a78;
    --border: rgba(0,229,255,0.12);
    --border2: rgba(0,229,255,0.25);
    --gold: #ffd700;
    --red: #ff4444;
    --green: #00ff88;
    --orange: #ff8c00;
    --purple: #aa44ff;
    --r-common: #aaaaaa;
    --r-rare: #4488ff;
    --r-epic: #aa44ff;
    --r-legendary: #ffd700;
    --r-mythic: #ff4444;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'Rajdhani', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--cyan3); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--cyan2); }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 10px var(--cyan-glow), 0 0 20px var(--cyan-glow); }
    50% { box-shadow: 0 0 20px rgba(0,229,255,0.3), 0 0 40px rgba(0,229,255,0.2); }
  }
  @keyframes scan-line {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes flicker {
    0%, 95%, 100% { opacity: 1; } 96% { opacity: 0.7; } 97% { opacity: 1; } 98% { opacity: 0.5; } 99% { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes matrix-rain {
    0% { opacity: 0; transform: translateY(-20px); }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; transform: translateY(20px); }
  }
  .fade-in { animation: fade-in 0.4s ease forwards; }
  .slide-in { animation: slide-in 0.3s ease forwards; }
  input, select, textarea { font-family: 'Rajdhani', sans-serif; font-size: 15px; }
  button { font-family: 'Rajdhani', sans-serif; cursor: pointer; }
  .grid-bg {
    background-image: 
      linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
`;
document.head.appendChild(globalStyle);

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_RARITIES = [
  { id: "1", name: "Common", color: "#aaaaaa" },
  { id: "2", name: "Rare", color: "#4488ff" },
  { id: "3", name: "Epic", color: "#aa44ff" },
  { id: "4", name: "Legendary", color: "#ffd700" },
  { id: "5", name: "Mythic", color: "#ff4444" },
];
const MOCK_CRATES = [
  { id: "1", name: "Vote Crate", description: "Erhältlich durch Voten" },
  { id: "2", name: "OP Crate", description: "Seltene OP-Items" },
  { id: "3", name: "Legendary Crate", description: "Legendäre Items" },
  { id: "4", name: "Event Crate", description: "Event-exklusive Items" },
];
const MOCK_EFFECTS = [
  { id: "1", name: "Explosion", description: "Explodiert beim Treffer" },
  { id: "2", name: "Lightning Strike", description: "Blitz beim Treffer" },
  { id: "3", name: "Teleport", description: "Teleportiert den Gegner" },
  { id: "4", name: "Speed Boost", description: "Erhöht Geschwindigkeit" },
  { id: "5", name: "Fire Trail", description: "Hinterlässt Feuerspur" },
];
const MOCK_ENCHANTS = [
  "Sharpness","Smite","Bane of Arthropods","Efficiency","Fortune","Silk Touch",
  "Unbreaking","Mending","Protection","Blast Protection","Fire Protection",
  "Projectile Protection","Feather Falling","Thorns","Respiration","Aqua Affinity",
  "Looting","Fire Aspect","Knockback","Sweeping Edge","Power","Punch","Infinity",
  "Flame","Luck of the Sea","Lure","Depth Strider","Frost Walker","Soul Speed",
];
const MOCK_ITEM_TYPES = [
  "minecraft:diamond_sword","minecraft:netherite_sword","minecraft:netherite_pickaxe",
  "minecraft:diamond_pickaxe","minecraft:bow","minecraft:crossbow","minecraft:trident",
  "minecraft:netherite_axe","minecraft:diamond_axe","minecraft:netherite_helmet",
  "minecraft:netherite_chestplate","minecraft:netherite_leggings","minecraft:netherite_boots",
  "minecraft:totem_of_undying","minecraft:shield","minecraft:elytra","minecraft:diamond_hoe",
];
const MOCK_SIGNATURES = [
  { id: "1", name: "Forged by Notch", skinName: "Notch" },
  { id: "2", name: "Crafted by Herobrine", skinName: "Herobrine" },
  { id: "3", name: "Divine Blessing", skinName: null },
  { id: "4", name: "OPBUCHT Special", skinName: "Admin" },
];

let nextId = 10;
const INITIAL_ITEMS = [
  {
    id: "1", name: "Klingenbrecher", itemType: "minecraft:netherite_sword",
    rarity: "5", crate: "2", stars: 3,
    signatures: ["1"], effects: ["1","2"], 
    enchantments: [{ name: "Sharpness", level: 255 },{ name: "Unbreaking", level: 10 },{ name: "Mending", level: 1 }],
    uploaderId: "u1", uploaderName: "ShadowCraft_99", uploaderAvatar: "SC",
    status: "PUBLISHED", likes: 47, liked: false, comments: [
      { id: "c1", userId: "u2", username: "PixelKnight", avatar: "PK", message: "Das ist das krasseste Schwert das ich je gesehen habe!", createdAt: new Date(Date.now()-3600000) },
      { id: "c2", userId: "u3", username: "NightWalker", avatar: "NW", message: "Sharpness 255 ist absurd 😭", createdAt: new Date(Date.now()-7200000) },
    ],
    createdAt: new Date(Date.now()-86400000*2),
  },
  {
    id: "2", name: "Göttliche Spitzhacke", itemType: "minecraft:netherite_pickaxe",
    rarity: "4", crate: "3", stars: 3,
    signatures: ["4"], effects: ["4"], 
    enchantments: [{ name: "Efficiency", level: 255 },{ name: "Fortune", level: 100 },{ name: "Unbreaking", level: 10 }],
    uploaderId: "u2", uploaderName: "PixelKnight", uploaderAvatar: "PK",
    status: "PUBLISHED", likes: 31, liked: false, comments: [],
    createdAt: new Date(Date.now()-86400000*5),
  },
  {
    id: "3", name: "Totem der Ewigkeit", itemType: "minecraft:totem_of_undying",
    rarity: "5", crate: "4", stars: 2,
    signatures: ["2","3"], effects: ["3"],
    enchantments: [],
    uploaderId: "u3", uploaderName: "NightWalker", uploaderAvatar: "NW",
    status: "PUBLISHED", likes: 88, liked: false, comments: [
      { id: "c3", userId: "u1", username: "ShadowCraft_99", avatar: "SC", message: "Absoluter Chad Move dieses Item einzureichen!", createdAt: new Date(Date.now()-1800000) },
    ],
    createdAt: new Date(Date.now()-86400000),
  },
  {
    id: "4", name: "Sturmbogen", itemType: "minecraft:bow",
    rarity: "3", crate: "1", stars: 2,
    signatures: [], effects: ["2","5"],
    enchantments: [{ name: "Power", level: 100 },{ name: "Infinity", level: 1 }],
    uploaderId: "u1", uploaderName: "ShadowCraft_99", uploaderAvatar: "SC",
    status: "PENDING", likes: 0, liked: false, comments: [],
    createdAt: new Date(Date.now()-3600000),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getRarityColor(rarityId) {
  const map = { "1":"#aaaaaa","2":"#4488ff","3":"#aa44ff","4":"#ffd700","5":"#ff4444" };
  return map[rarityId] || "#aaaaaa";
}
function getRarityName(rarityId) {
  return MOCK_RARITIES.find(r=>r.id===rarityId)?.name || "Unknown";
}
function getCrateName(crateId) {
  return MOCK_CRATES.find(c=>c.id===crateId)?.name || "Unknown";
}
function getEffectNames(ids) {
  return ids.map(id => MOCK_EFFECTS.find(e=>e.id===id)?.name || id);
}
function getSigNames(ids) {
  return ids.map(id => MOCK_SIGNATURES.find(s=>s.id===id)?.name || id);
}
function formatDate(d) {
  const now = new Date(); const diff = now - d;
  if (diff < 60000) return "Gerade eben";
  if (diff < 3600000) return `vor ${Math.floor(diff/60000)}m`;
  if (diff < 86400000) return `vor ${Math.floor(diff/3600000)}h`;
  return `vor ${Math.floor(diff/86400000)}d`;
}
function itemTypeIcon(type) {
  if (type.includes("sword")) return "⚔️";
  if (type.includes("pickaxe")) return "⛏️";
  if (type.includes("bow")) return "🏹";
  if (type.includes("axe")) return "🪓";
  if (type.includes("helmet")||type.includes("chestplate")||type.includes("leggings")||type.includes("boots")) return "🛡️";
  if (type.includes("totem")) return "🗿";
  if (type.includes("elytra")) return "🪂";
  if (type.includes("trident")) return "🔱";
  if (type.includes("crossbow")) return "🏹";
  return "📦";
}

// ─── Components ──────────────────────────────────────────────────────────────

function Scanline() {
  return (
    <div style={{
      position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:9999,
      background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)",
      opacity:0.4
    }}/>
  );
}

function HexBg() {
  return (
    <div style={{
      position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:0,
      overflow:"hidden",opacity:0.4
    }}>
      {Array.from({length:20}).map((_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${Math.random()*100}%`,
          top:`${Math.random()*100}%`,
          width:Math.random()*300+50,
          height:Math.random()*300+50,
          border:"1px solid rgba(0,229,255,0.05)",
          borderRadius:"50%",
          transform:`rotate(${Math.random()*360}deg)`,
        }}/>
      ))}
    </div>
  );
}

function Logo() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
      <div style={{
        width:38,height:38,background:"linear-gradient(135deg,var(--cyan3),var(--cyan))",
        borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:"0 0 15px var(--cyan-glow)",fontSize:20,
        animation:"pulse-glow 3s ease-in-out infinite"
      }}>⚔️</div>
      <div>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:15,fontWeight:900,
          background:"linear-gradient(90deg,var(--cyan),#ffffff)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          letterSpacing:2,lineHeight:1}}>OPBUCHT</div>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:400,
          color:"var(--text3)",letterSpacing:4,lineHeight:1}}>ITEM DB</div>
      </div>
    </div>
  );
}

function Navbar({ user, onLogin, onLogout, onAdmin, onProfile }) {
  return (
    <nav style={{
      position:"sticky",top:0,zIndex:100,
      background:"rgba(8,13,16,0.92)",
      backdropFilter:"blur(20px)",
      borderBottom:"1px solid var(--border)",
      boxShadow:"0 2px 30px rgba(0,0,0,0.5)"
    }}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo />
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {user?.isAdmin && (
            <button onClick={onAdmin} style={{
              background:"rgba(255,140,0,0.1)",border:"1px solid rgba(255,140,0,0.3)",
              color:"#ff8c00",padding:"8px 16px",borderRadius:6,fontSize:13,fontWeight:600,
              fontFamily:"'Rajdhani',sans-serif",letterSpacing:1,
              transition:"all 0.2s"
            }} onMouseEnter={e=>{e.target.style.background="rgba(255,140,0,0.2)"}}
               onMouseLeave={e=>{e.target.style.background="rgba(255,140,0,0.1)"}}>
              ⚙ ADMIN
            </button>
          )}
          {user ? (
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={onProfile} style={{
                display:"flex",alignItems:"center",gap:8,
                background:"var(--bg3)",border:"1px solid var(--border)",
                borderRadius:8,padding:"6px 12px",cursor:"pointer",transition:"all 0.2s",
                color:"var(--text)"
              }} onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border2)"}}
                 onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)"}}>
                <div style={{
                  width:28,height:28,borderRadius:"50%",
                  background:"linear-gradient(135deg,var(--cyan3),var(--cyan))",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:11,fontWeight:700,color:"#000"
                }}>{user.avatar}</div>
                <span style={{fontSize:14,fontWeight:600}}>{user.username}</span>
              </button>
              <button onClick={onLogout} style={{
                background:"rgba(255,68,68,0.1)",border:"1px solid rgba(255,68,68,0.2)",
                color:"#ff4444",padding:"8px 14px",borderRadius:6,fontSize:13,fontWeight:600,
                fontFamily:"'Rajdhani',sans-serif",transition:"all 0.2s"
              }} onMouseEnter={e=>{e.target.style.background="rgba(255,68,68,0.2)"}}
                 onMouseLeave={e=>{e.target.style.background="rgba(255,68,68,0.1)"}}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={onLogin} style={{
              background:"linear-gradient(135deg,#5865f2,#7289da)",
              border:"none",color:"white",padding:"10px 20px",borderRadius:8,
              fontSize:14,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",
              letterSpacing:0.5,display:"flex",alignItems:"center",gap:8,
              boxShadow:"0 4px 15px rgba(88,101,242,0.3)",transition:"all 0.2s",
            }} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(88,101,242,0.4)"}}
               onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 15px rgba(88,101,242,0.3)"}}>
              <svg width="18" height="14" viewBox="0 0 71 55" fill="white">
                <path d="M60.1 4.9A58.5 58.5 0 0 0 45.5 0a40.2 40.2 0 0 0-1.8 3.6 54 54 0 0 0-16.3 0A38.9 38.9 0 0 0 25.6 0 58.4 58.4 0 0 0 11 4.9C1.6 19 -1 32.7.3 46.3a58.9 58.9 0 0 0 18 9.1 44.6 44.6 0 0 0 3.8-6.2 38.4 38.4 0 0 1-6-2.9c.5-.4 1-.7 1.5-1.1a41.9 41.9 0 0 0 35.8 0c.5.4 1 .8 1.5 1.1a38.3 38.3 0 0 1-6 2.9 44.3 44.3 0 0 0 3.9 6.2 58.7 58.7 0 0 0 17.9-9c1.5-15.8-2.6-29.4-10.6-41.4zM23.7 37.9c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.2 6.4-7.2 6.5 3.2 6.4 7.2c0 3.9-2.8 7.1-6.4 7.1zm23.6 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.2 6.4-7.2 6.5 3.2 6.4 7.2c0 3.9-2.8 7.1-6.4 7.1z"/>
              </svg>
              Login mit Discord
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{
      background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:12,
      padding:"20px 28px",display:"flex",alignItems:"center",gap:16,
      boxShadow:"0 4px 20px rgba(0,0,0,0.3)",flex:1,
      transition:"all 0.3s",cursor:"default"
    }} onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.boxShadow="0 4px 30px var(--cyan-glow)"}}
       onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.3)"}}>
      <div style={{
        width:48,height:48,background:"var(--cyan-glow2)",borderRadius:10,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
        border:"1px solid var(--border2)"
      }}>{icon}</div>
      <div>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:24,fontWeight:700,
          color:"var(--cyan)",lineHeight:1}}>{value}</div>
        <div style={{fontSize:13,color:"var(--text2)",marginTop:2,letterSpacing:0.5}}>{label}</div>
      </div>
    </div>
  );
}

function RarityBadge({ rarityId, small }) {
  const color = getRarityColor(rarityId);
  const name = getRarityName(rarityId);
  return (
    <span style={{
      background:`${color}22`,border:`1px solid ${color}55`,
      color,borderRadius:4,padding:small?"2px 8px":"4px 10px",
      fontSize:small?11:12,fontWeight:700,letterSpacing:0.5,whiteSpace:"nowrap"
    }}>{name.toUpperCase()}</span>
  );
}

function Stars({ count, max=3, onChange }) {
  return (
    <div style={{display:"flex",gap:4}}>
      {Array.from({length:max}).map((_,i)=>(
        <span key={i} onClick={()=>onChange&&onChange(i===count-1&&i===count-1?i:i+1)}
          style={{fontSize:20,cursor:onChange?"pointer":"default",
            color:i<count?"#ffd700":"var(--text3)",
            transition:"transform 0.1s",filter:i<count?"drop-shadow(0 0 4px #ffd700)":"none"
          }}
          onMouseEnter={e=>{if(onChange)e.target.style.transform="scale(1.3)"}}
          onMouseLeave={e=>{e.target.style.transform="scale(1)"}}>★</span>
      ))}
    </div>
  );
}

function ItemCard({ item, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const color = getRarityColor(item.rarity);
  return (
    <div onClick={()=>onOpen(item)} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{
        background:hovered?`linear-gradient(135deg,var(--bg3),${color}08)`:"var(--bg3)",
        border:`1px solid ${hovered?color+"44":"var(--border)"}`,
        borderRadius:12,padding:"20px",cursor:"pointer",
        transition:"all 0.25s",
        boxShadow:hovered?`0 8px 30px ${color}22`:"0 2px 10px rgba(0,0,0,0.3)",
        transform:hovered?"translateY(-3px)":"translateY(0)",
        animation:"fade-in 0.4s ease forwards",
        position:"relative",overflow:"hidden"
      }}>
      {hovered && <div style={{
        position:"absolute",top:0,left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${color},transparent)`
      }}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{
            width:40,height:40,background:`${color}22`,borderRadius:8,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
            border:`1px solid ${color}44`
          }}>{itemTypeIcon(item.itemType)}</div>
          <div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:700,
              color:"var(--text)",letterSpacing:0.5}}>{item.name}</div>
            <div style={{fontSize:11,color:"var(--text3)",marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>
              {item.itemType.replace("minecraft:","")}
            </div>
          </div>
        </div>
        <RarityBadge rarityId={item.rarity} small />
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <Stars count={item.stars} />
        <span style={{fontSize:11,color:"var(--text3)"}}>·</span>
        <span style={{fontSize:12,color:"var(--text2)"}}>📦 {getCrateName(item.crate)}</span>
      </div>
      {item.enchantments.length>0 && (
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
          {item.enchantments.slice(0,3).map((e,i)=>(
            <span key={i} style={{
              background:"rgba(170,68,255,0.1)",border:"1px solid rgba(170,68,255,0.2)",
              color:"#aa44ff",borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:600
            }}>{e.name} {e.level}</span>
          ))}
          {item.enchantments.length>3&&<span style={{fontSize:10,color:"var(--text3)"}}>+{item.enchantments.length-3}</span>}
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:20,height:20,borderRadius:"50%",
            background:"linear-gradient(135deg,var(--cyan3),var(--cyan))",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#000"
          }}>{item.uploaderAvatar}</div>
          <span style={{fontSize:12,color:"var(--text2)"}}>{item.uploaderName}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:12,color:"var(--text2)"}}>❤ {item.likes}</span>
          <span style={{fontSize:12,color:"var(--text3)"}}>{formatDate(item.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ search, setSearch, filters, setFilters }) {
  return (
    <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:12,padding:16}}>
      <div style={{display:"flex",gap:12,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:200,position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:16}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Item suchen..."
            style={{
              width:"100%",background:"var(--bg4)",border:"1px solid var(--border)",
              borderRadius:8,padding:"10px 12px 10px 36px",color:"var(--text)",
              fontSize:14,outline:"none",transition:"border 0.2s"
            }}
            onFocus={e=>e.target.style.borderColor="var(--cyan3)"}
            onBlur={e=>e.target.style.borderColor="var(--border)"}
          />
        </div>
        <Select value={filters.rarity} onChange={v=>setFilters({...filters,rarity:v})} options={[{value:"",label:"Alle Seltenheiten"},...MOCK_RARITIES.map(r=>({value:r.id,label:r.name}))]} placeholder="Seltenheit"/>
        <Select value={filters.crate} onChange={v=>setFilters({...filters,crate:v})} options={[{value:"",label:"Alle Crates"},...MOCK_CRATES.map(c=>({value:c.id,label:c.name}))]} placeholder="Crate"/>
        <Select value={filters.sort} onChange={v=>setFilters({...filters,sort:v})} options={[{value:"newest",label:"Neueste"},{value:"popular",label:"Beliebteste"},{value:"stars",label:"Beste Bewertung"}]} placeholder="Sortierung"/>
      </div>
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{
        background:"var(--bg4)",border:"1px solid var(--border)",
        borderRadius:8,padding:"10px 12px",color:value?"var(--text)":"var(--text3)",
        fontSize:13,outline:"none",cursor:"pointer",minWidth:140,
        transition:"border 0.2s"
      }}
      onFocus={e=>e.target.style.borderColor="var(--cyan3)"}
      onBlur={e=>e.target.style.borderColor="var(--border)"}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function MultiSelect({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();
  useEffect(()=>{
    const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);
  const filtered = options.filter(o=>o.label.toLowerCase().includes(q.toLowerCase()));
  const toggle=(v)=>{
    if(selected.includes(v))onChange(selected.filter(x=>x!==v));
    else onChange([...selected,v]);
  };
  return (
    <div ref={ref} style={{position:"relative"}}>
      <div onClick={()=>setOpen(!open)} style={{
        background:"var(--bg4)",border:`1px solid ${open?"var(--cyan3)":"var(--border)"}`,
        borderRadius:8,padding:"10px 12px",cursor:"pointer",minHeight:42,
        display:"flex",flexWrap:"wrap",gap:4,alignItems:"center"
      }}>
        {selected.length===0&&<span style={{color:"var(--text3)",fontSize:13}}>{label}</span>}
        {selected.map(v=>{
          const o=options.find(x=>x.value===v);
          return <span key={v} style={{background:"var(--cyan-glow2)",border:"1px solid var(--border2)",
            color:"var(--cyan)",borderRadius:4,padding:"1px 6px",fontSize:12}}>
            {o?.label}<span onClick={e=>{e.stopPropagation();toggle(v)}} style={{marginLeft:4,cursor:"pointer",color:"var(--text3)"}}>✕</span>
          </span>;
        })}
      </div>
      {open&&<div style={{
        position:"absolute",top:"100%",left:0,right:0,zIndex:50,
        background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:8,
        marginTop:4,maxHeight:200,overflowY:"auto",boxShadow:"0 8px 30px rgba(0,0,0,0.5)"
      }}>
        <div style={{padding:8}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Suchen..."
            style={{width:"100%",background:"var(--bg4)",border:"1px solid var(--border)",
              borderRadius:6,padding:"6px 10px",color:"var(--text)",fontSize:13,outline:"none"}}/>
        </div>
        {filtered.map(o=>(
          <div key={o.value} onClick={()=>toggle(o.value)} style={{
            padding:"8px 12px",cursor:"pointer",fontSize:13,
            background:selected.includes(o.value)?"var(--cyan-glow2)":"transparent",
            color:selected.includes(o.value)?"var(--cyan)":"var(--text)",
            transition:"background 0.15s",display:"flex",justifyContent:"space-between"
          }} onMouseEnter={e=>{if(!selected.includes(o.value))e.currentTarget.style.background="var(--bg4)"}}
             onMouseLeave={e=>{if(!selected.includes(o.value))e.currentTarget.style.background="transparent"}}>
            {o.label}{selected.includes(o.value)&&<span>✓</span>}
          </div>
        ))}
      </div>}
    </div>
  );
}

function EnchantList({ enchants, onChange }) {
  const [q, setQ] = useState("");
  const filtered = MOCK_ENCHANTS.filter(e=>e.toLowerCase().includes(q.toLowerCase())&&!enchants.find(x=>x.name===e));
  const add=(name)=>onChange([...enchants,{name,level:1}]);
  const remove=(i)=>onChange(enchants.filter((_,idx)=>idx!==i));
  const setLevel=(i,l)=>onChange(enchants.map((e,idx)=>idx===i?{...e,level:Math.min(255,Math.max(1,parseInt(l)||1))}:e));
  return (
    <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
        {enchants.map((e,i)=>(
          <div key={i} style={{
            background:"rgba(170,68,255,0.1)",border:"1px solid rgba(170,68,255,0.25)",
            borderRadius:6,padding:"4px 8px",display:"flex",alignItems:"center",gap:6
          }}>
            <span style={{color:"#aa44ff",fontSize:12,fontWeight:600}}>{e.name}</span>
            <input type="number" value={e.level} onChange={ev=>setLevel(i,ev.target.value)}
              min="1" max="255" style={{
                width:44,background:"var(--bg4)",border:"1px solid var(--border)",
                borderRadius:4,padding:"1px 4px",color:"var(--text)",fontSize:11,outline:"none"
              }}/>
            <span onClick={()=>remove(i)} style={{cursor:"pointer",color:"var(--text3)",fontSize:11}}>✕</span>
          </div>
        ))}
      </div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Verzauberung suchen..."
        style={{width:"100%",background:"var(--bg4)",border:"1px solid var(--border)",
          borderRadius:8,padding:"9px 12px",color:"var(--text)",fontSize:13,outline:"none",marginBottom:6}}/>
      {q&&<div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,maxHeight:150,overflowY:"auto"}}>
        {filtered.slice(0,8).map(e=>(
          <div key={e} onClick={()=>{add(e);setQ("")}} style={{
            padding:"7px 12px",cursor:"pointer",fontSize:13,color:"var(--text)",
            transition:"background 0.15s"
          }} onMouseEnter={ev=>ev.currentTarget.style.background="var(--bg4)"}
             onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>{e}</div>
        ))}
      </div>}
    </div>
  );
}

function Modal({ onClose, children, title, wide }) {
  useEffect(()=>{
    document.body.style.overflow="hidden";
    return()=>{document.body.style.overflow=""};
  },[]);
  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:200,
      background:"rgba(0,0,0,0.8)",backdropFilter:"blur(6px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:16
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:16,
        width:"100%",maxWidth:wide?900:640,maxHeight:"90vh",overflowY:"auto",
        boxShadow:"0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px var(--border)",
        animation:"fade-in 0.25s ease"
      }}>
        <div style={{
          display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"20px 24px",borderBottom:"1px solid var(--border)",
          position:"sticky",top:0,background:"var(--bg2)",zIndex:10
        }}>
          <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:16,fontWeight:700,
            color:"var(--cyan)",letterSpacing:1}}>{title}</h2>
          <button onClick={onClose} style={{
            background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:8,
            width:32,height:32,color:"var(--text2)",fontSize:16,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"
          }} onMouseEnter={e=>{e.target.style.borderColor="var(--red)";e.target.style.color="var(--red)"}}
             onMouseLeave={e=>{e.target.style.borderColor="var(--border)";e.target.style.color="var(--text2)"}}>✕</button>
        </div>
        <div style={{padding:24}}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, required, children, hint }) {
  return (
    <div style={{marginBottom:16}}>
      <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--text2)",
        marginBottom:6,letterSpacing:0.5,textTransform:"uppercase"}}>
        {label}{required&&<span style={{color:"var(--cyan)",marginLeft:4}}>*</span>}
      </label>
      {children}
      {hint&&<div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>{hint}</div>}
    </div>
  );
}

function CreateItemModal({ onClose, onSave, user }) {
  const [form, setForm] = useState({
    name:"",itemType:"",rarity:"",crate:"",stars:0,
    signatures:[],effects:[],enchantments:[],
    images:[],loreImages:[],ingameImages:[]
  });
  const [typeQ, setTypeQ] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const typeRef = useRef();
  useEffect(()=>{
    const h=(e)=>{if(typeRef.current&&!typeRef.current.contains(e.target))setTypeOpen(false)};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);
  const filteredTypes = MOCK_ITEM_TYPES.filter(t=>t.includes(typeQ.toLowerCase()));

  const handleSave=()=>{
    if(!form.name||!form.itemType||!form.rarity||!form.crate){
      alert("Bitte alle Pflichtfelder ausfüllen!"); return;
    }
    onSave({
      ...form, id:String(++nextId),
      uploaderId:"me", uploaderName:user.username, uploaderAvatar:user.avatar,
      status:"PENDING", likes:0, liked:false, comments:[],
      createdAt:new Date()
    });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="⚔ ITEM ERSTELLEN" wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"var(--cyan)",letterSpacing:2,
            textTransform:"uppercase",marginBottom:14,paddingBottom:8,
            borderBottom:"1px solid var(--border)"}}>BASIS INFORMATIONEN</div>

          <FormField label="Name" required>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
              placeholder="z.B. Klingenbrecher"
              style={{width:"100%",background:"var(--bg4)",border:"1px solid var(--border)",
                borderRadius:8,padding:"10px 12px",color:"var(--text)",fontSize:14,outline:"none"}}
              onFocus={e=>e.target.style.borderColor="var(--cyan3)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}/>
          </FormField>

          <FormField label="Item Type" required>
            <div ref={typeRef} style={{position:"relative"}}>
              <input value={form.itemType||typeQ} onChange={e=>{setTypeQ(e.target.value);setForm({...form,itemType:""});setTypeOpen(true)}}
                onFocus={()=>setTypeOpen(true)}
                placeholder="minecraft:diamond_sword"
                style={{width:"100%",background:"var(--bg4)",border:"1px solid var(--border)",
                  borderRadius:8,padding:"10px 12px",color:"var(--text)",fontSize:13,outline:"none",
                  fontFamily:"'JetBrains Mono',monospace"}}
                onBlur={e=>{e.target.style.borderColor="var(--border)"}}
              />
              {typeOpen&&filteredTypes.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,
                  background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:8,
                  marginTop:4,maxHeight:180,overflowY:"auto",boxShadow:"0 8px 30px rgba(0,0,0,0.5)"}}>
                  {filteredTypes.slice(0,10).map(t=>(
                    <div key={t} onClick={()=>{setForm({...form,itemType:t});setTypeQ(t);setTypeOpen(false)}}
                      style={{padding:"8px 12px",cursor:"pointer",fontSize:12,
                        fontFamily:"'JetBrains Mono',monospace",color:"var(--text)",transition:"background 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="var(--bg4)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      {itemTypeIcon(t)} {t}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <FormField label="Seltenheit" required>
              <select value={form.rarity} onChange={e=>setForm({...form,rarity:e.target.value})}
                style={{width:"100%",background:"var(--bg4)",border:"1px solid var(--border)",
                  borderRadius:8,padding:"10px 12px",color:form.rarity?"var(--text)":"var(--text3)",
                  fontSize:13,outline:"none"}}>
                <option value="">Seltenheit wählen</option>
                {MOCK_RARITIES.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </FormField>
            <FormField label="Crate" required>
              <select value={form.crate} onChange={e=>setForm({...form,crate:e.target.value})}
                style={{width:"100%",background:"var(--bg4)",border:"1px solid var(--border)",
                  borderRadius:8,padding:"10px 12px",color:form.crate?"var(--text)":"var(--text3)",
                  fontSize:13,outline:"none"}}>
                <option value="">Crate wählen</option>
                {MOCK_CRATES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Sterne Bewertung">
            <Stars count={form.stars} max={3} onChange={v=>setForm({...form,stars:v===form.stars?v-1:v})}/>
          </FormField>

          <div style={{fontSize:11,fontWeight:700,color:"var(--cyan)",letterSpacing:2,
            textTransform:"uppercase",marginBottom:14,paddingBottom:8,
            borderBottom:"1px solid var(--border)",marginTop:20}}>BILDER UPLOAD</div>
          <div style={{fontSize:12,color:"var(--text3)",padding:"12px",background:"var(--bg4)",
            borderRadius:8,border:"1px dashed var(--border)",textAlign:"center"}}>
            📎 PNG · JPG · WEBP · Max 5MB<br/>
            <span style={{color:"var(--text2)"}}>Item Bilder (2) · Lore Bilder (2) · Ingame Bilder (2)</span>
          </div>
        </div>

        <div>
          <div style={{fontSize:11,fontWeight:700,color:"var(--cyan)",letterSpacing:2,
            textTransform:"uppercase",marginBottom:14,paddingBottom:8,
            borderBottom:"1px solid var(--border)"}}>ERWEITERTE INFORMATIONEN</div>

          <FormField label="Signaturen">
            <MultiSelect label="Signaturen wählen..."
              options={MOCK_SIGNATURES.map(s=>({value:s.id,label:s.name+(s.skinName?` (${s.skinName})`:"")} ))}
              selected={form.signatures} onChange={v=>setForm({...form,signatures:v})}/>
          </FormField>

          <FormField label="Effekte">
            <MultiSelect label="Effekte wählen..."
              options={MOCK_EFFECTS.map(e=>({value:e.id,label:e.name}))}
              selected={form.effects} onChange={v=>setForm({...form,effects:v})}/>
          </FormField>

          <FormField label="Verzauberungen" hint="Maximaler Level: 255">
            <EnchantList enchants={form.enchantments} onChange={v=>setForm({...form,enchantments:v})}/>
          </FormField>
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:24,
        paddingTop:20,borderTop:"1px solid var(--border)"}}>
        <button onClick={onClose} style={{
          background:"var(--bg4)",border:"1px solid var(--border)",color:"var(--text2)",
          padding:"10px 20px",borderRadius:8,fontSize:14,fontWeight:600,
          fontFamily:"'Rajdhani',sans-serif",cursor:"pointer"}}>Abbrechen</button>
        <button onClick={handleSave} style={{
          background:"linear-gradient(135deg,var(--cyan3),var(--cyan2))",
          border:"none",color:"#000",padding:"10px 24px",borderRadius:8,
          fontSize:14,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",letterSpacing:0.5,
          cursor:"pointer",boxShadow:"0 4px 15px var(--cyan-glow)"}}>
          ⚔ ITEM SPEICHERN
        </button>
      </div>
    </Modal>
  );
}

function ItemDetailModal({ item, onClose, user, onLike, onComment, onPublish, onReject, onDelete }) {
  const [comment, setComment] = useState("");
  const color = getRarityColor(item.rarity);

  const handleComment = () => {
    if(!comment.trim()||!user) return;
    onComment(item.id, comment);
    setComment("");
  };

  return (
    <Modal onClose={onClose} title={`⚔ ${item.name}`} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div>
          <div style={{
            background:`linear-gradient(135deg,${color}11,${color}05)`,
            border:`1px solid ${color}33`,borderRadius:12,padding:20,marginBottom:16
          }}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{
                width:56,height:56,background:`${color}22`,borderRadius:10,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,
                border:`1px solid ${color}44`,boxShadow:`0 0 20px ${color}22`
              }}>{itemTypeIcon(item.itemType)}</div>
              <div>
                <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:700,color:"var(--text)"}}>{item.name}</h2>
                <code style={{fontSize:11,color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace"}}>{item.itemType}</code>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                ["Seltenheit", <RarityBadge rarityId={item.rarity}/>],
                ["Crate", <span style={{fontSize:13,color:"var(--text)"}}>{getCrateName(item.crate)}</span>],
                ["Bewertung", <Stars count={item.stars}/>],
                ["Status", <span style={{
                  fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:4,
                  background:item.status==="PUBLISHED"?"rgba(0,255,136,0.1)":item.status==="PENDING"?"rgba(255,140,0,0.1)":"rgba(255,68,68,0.1)",
                  color:item.status==="PUBLISHED"?"#00ff88":item.status==="PENDING"?"#ff8c00":"#ff4444",
                  border:`1px solid ${item.status==="PUBLISHED"?"rgba(0,255,136,0.3)":item.status==="PENDING"?"rgba(255,140,0,0.3)":"rgba(255,68,68,0.3)"}`
                }}>{item.status}</span>]
              ].map(([k,v],i)=>(
                <div key={i} style={{background:"var(--bg4)",borderRadius:8,padding:"10px 12px",border:"1px solid var(--border)"}}>
                  <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{k}</div>
                  {v}
                </div>
              ))}
            </div>
          </div>

          {item.enchantments.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Verzauberungen</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {item.enchantments.map((e,i)=>(
                  <span key={i} style={{background:"rgba(170,68,255,0.1)",border:"1px solid rgba(170,68,255,0.25)",
                    color:"#aa44ff",borderRadius:6,padding:"4px 10px",fontSize:12,fontWeight:600}}>
                    {e.name} <span style={{color:"#cc88ff"}}>L{e.level}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {item.effects.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Effekte</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {getEffectNames(item.effects).map((e,i)=>(
                  <span key={i} style={{background:"rgba(0,229,255,0.08)",border:"1px solid var(--border2)",
                    color:"var(--cyan)",borderRadius:6,padding:"4px 10px",fontSize:12,fontWeight:600}}>✨ {e}</span>
                ))}
              </div>
            </div>
          )}
          {item.signatures.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Signaturen</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {getSigNames(item.signatures).map((s,i)=>(
                  <span key={i} style={{background:"rgba(255,215,0,0.08)",border:"1px solid rgba(255,215,0,0.2)",
                    color:"#ffd700",borderRadius:6,padding:"4px 10px",fontSize:12,fontWeight:600}}>🖊 {s}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
            background:"var(--bg4)",borderRadius:10,padding:"12px 16px",border:"1px solid var(--border)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:30,height:30,borderRadius:"50%",
                background:"linear-gradient(135deg,var(--cyan3),var(--cyan))",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#000"
              }}>{item.uploaderAvatar}</div>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{item.uploaderName}</div>
                <div style={{fontSize:11,color:"var(--text3)"}}>{formatDate(item.createdAt)}</div>
              </div>
            </div>
            <button onClick={()=>onLike(item.id)} style={{
              background:item.liked?"rgba(255,68,68,0.2)":"var(--bg3)",
              border:`1px solid ${item.liked?"rgba(255,68,68,0.4)":"var(--border)"}`,
              color:item.liked?"var(--red)":"var(--text2)",
              padding:"8px 16px",borderRadius:8,cursor:user?"pointer":"not-allowed",
              fontSize:14,fontWeight:600,fontFamily:"'Rajdhani',sans-serif",transition:"all 0.2s",
              display:"flex",alignItems:"center",gap:6
            }}>❤ {item.likes}</button>
          </div>

          {user?.isAdmin && (
            <div style={{display:"flex",gap:8,marginTop:12}}>
              {item.status!=="PUBLISHED"&&<button onClick={()=>{onPublish(item.id);onClose();}} style={{
                flex:1,background:"rgba(0,255,136,0.1)",border:"1px solid rgba(0,255,136,0.3)",
                color:"var(--green)",padding:"8px",borderRadius:8,fontSize:13,fontWeight:700,
                fontFamily:"'Rajdhani',sans-serif",cursor:"pointer"}}>✓ VERÖFFENTLICHEN</button>}
              {item.status!=="REJECTED"&&<button onClick={()=>{onReject(item.id);onClose();}} style={{
                flex:1,background:"rgba(255,140,0,0.1)",border:"1px solid rgba(255,140,0,0.3)",
                color:"var(--orange)",padding:"8px",borderRadius:8,fontSize:13,fontWeight:700,
                fontFamily:"'Rajdhani',sans-serif",cursor:"pointer"}}>✗ ABLEHNEN</button>}
              <button onClick={()=>{onDelete(item.id);onClose();}} style={{
                background:"rgba(255,68,68,0.1)",border:"1px solid rgba(255,68,68,0.3)",
                color:"var(--red)",padding:"8px 12px",borderRadius:8,fontSize:13,fontWeight:700,
                fontFamily:"'Rajdhani',sans-serif",cursor:"pointer"}}>🗑</button>
            </div>
          )}
        </div>

        <div>
          <div style={{fontSize:11,fontWeight:700,color:"var(--cyan)",letterSpacing:2,
            textTransform:"uppercase",marginBottom:14,paddingBottom:8,borderBottom:"1px solid var(--border)"}}>
            KOMMENTARE ({item.comments.length})
          </div>
          <div style={{maxHeight:300,overflowY:"auto",marginBottom:16,display:"flex",flexDirection:"column",gap:10}}>
            {item.comments.length===0&&<div style={{color:"var(--text3)",fontSize:13,textAlign:"center",padding:20}}>
              Noch keine Kommentare. Sei der Erste! 💬
            </div>}
            {item.comments.map(c=>(
              <div key={c.id} style={{background:"var(--bg4)",borderRadius:10,padding:"12px",
                border:"1px solid var(--border)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:26,height:26,borderRadius:"50%",
                    background:"linear-gradient(135deg,var(--cyan3),var(--cyan))",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:10,fontWeight:700,color:"#000"}}>{c.avatar}</div>
                  <span style={{fontSize:13,fontWeight:600}}>{c.username}</span>
                  <span style={{fontSize:11,color:"var(--text3)",marginLeft:"auto"}}>{formatDate(c.createdAt)}</span>
                </div>
                <p style={{fontSize:13,color:"var(--text2)",lineHeight:1.5}}>{c.message}</p>
              </div>
            ))}
          </div>
          {user ? (
            <div>
              <textarea value={comment} onChange={e=>setComment(e.target.value)}
                placeholder="Schreibe einen Kommentar..."
                style={{width:"100%",background:"var(--bg4)",border:"1px solid var(--border)",
                  borderRadius:8,padding:"10px 12px",color:"var(--text)",fontSize:13,
                  resize:"vertical",minHeight:80,outline:"none",fontFamily:"'Rajdhani',sans-serif"}}
                onFocus={e=>e.target.style.borderColor="var(--cyan3)"}
                onBlur={e=>e.target.style.borderColor="var(--border)"}/>
              <button onClick={handleComment} style={{
                marginTop:8,width:"100%",background:"linear-gradient(135deg,var(--cyan3),var(--cyan2))",
                border:"none",color:"#000",padding:"10px",borderRadius:8,
                fontSize:14,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",cursor:"pointer"}}>
                💬 KOMMENTIEREN
              </button>
            </div>
          ) : (
            <div style={{background:"var(--bg4)",borderRadius:10,padding:16,textAlign:"center",
              border:"1px dashed var(--border)",color:"var(--text3)",fontSize:13}}>
              Logge dich ein um zu kommentieren
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function AdminDashboard({ items, onClose, onPublish, onReject, onDelete }) {
  const [tab, setTab] = useState("pending");
  const pending = items.filter(i=>i.status==="PENDING");
  const published = items.filter(i=>i.status==="PUBLISHED");
  const rejected = items.filter(i=>i.status==="REJECTED");

  const tabs = [
    {id:"pending",label:`⏳ PENDING (${pending.length})`},
    {id:"published",label:`✓ PUBLISHED (${published.length})`},
    {id:"rejected",label:`✗ REJECTED (${rejected.length})`},
    {id:"manage",label:"⚙ VERWALTUNG"},
  ];
  const shown = tab==="pending"?pending:tab==="published"?published:tab==="rejected"?rejected:[];

  return (
    <Modal onClose={onClose} title="⚙ ADMIN DASHBOARD" wide>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            background:tab===t.id?"linear-gradient(135deg,var(--cyan3),var(--cyan2))":"var(--bg4)",
            border:`1px solid ${tab===t.id?"transparent":"var(--border)"}`,
            color:tab===t.id?"#000":"var(--text2)",
            padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,
            fontFamily:"'Rajdhani',sans-serif",letterSpacing:0.5,cursor:"pointer"
          }}>{t.label}</button>
        ))}
      </div>

      {tab==="manage"?(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[
            {title:"Seltenheiten",items:MOCK_RARITIES.map(r=>({name:r.name,extra:<span style={{color:r.color}}>●</span>}))},
            {title:"Crates",items:MOCK_CRATES.map(c=>({name:c.name}))},
            {title:"Effekte",items:MOCK_EFFECTS.map(e=>({name:e.name}))},
            {title:"Signaturen",items:MOCK_SIGNATURES.map(s=>({name:s.name,extra:s.skinName?<span style={{color:"var(--text3)",fontSize:11}}>({s.skinName})</span>:null}))},
          ].map(section=>(
            <div key={section.title} style={{background:"var(--bg3)",borderRadius:10,padding:16,border:"1px solid var(--border)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:13,fontWeight:700,color:"var(--cyan)",letterSpacing:1}}>{section.title.toUpperCase()}</span>
                <button style={{background:"var(--cyan-glow2)",border:"1px solid var(--border2)",
                  color:"var(--cyan)",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",
                  fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>+ Hinzufügen</button>
              </div>
              {section.items.map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"7px 10px",background:"var(--bg4)",borderRadius:6,marginBottom:4,
                  border:"1px solid var(--border)"}}>
                  <span style={{fontSize:13,display:"flex",alignItems:"center",gap:6}}>{item.extra}{item.name}</span>
                  <div style={{display:"flex",gap:6}}>
                    <button style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:12}}>✏</button>
                    <button style={{background:"none",border:"none",color:"var(--red)",cursor:"pointer",fontSize:12}}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {shown.length===0&&<div style={{color:"var(--text3)",textAlign:"center",padding:30,fontSize:14}}>
            Keine Items in dieser Kategorie.
          </div>}
          {shown.map(item=>(
            <div key={item.id} style={{
              background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:10,
              padding:"14px 16px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"
            }}>
              <div style={{fontSize:22}}>{itemTypeIcon(item.itemType)}</div>
              <div style={{flex:1,minWidth:150}}>
                <div style={{fontWeight:700,fontSize:14}}>{item.name}</div>
                <code style={{fontSize:10,color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace"}}>{item.itemType}</code>
              </div>
              <RarityBadge rarityId={item.rarity} small/>
              <span style={{fontSize:12,color:"var(--text2)"}}>by {item.uploaderName}</span>
              <span style={{fontSize:11,color:"var(--text3)"}}>{formatDate(item.createdAt)}</span>
              <div style={{display:"flex",gap:6}}>
                {tab==="pending"&&<button onClick={()=>onPublish(item.id)} style={{
                  background:"rgba(0,255,136,0.1)",border:"1px solid rgba(0,255,136,0.3)",
                  color:"var(--green)",padding:"6px 12px",borderRadius:6,fontSize:12,fontWeight:700,
                  fontFamily:"'Rajdhani',sans-serif",cursor:"pointer"}}>✓ Veröffentlichen</button>}
                {tab!=="rejected"&&<button onClick={()=>onReject(item.id)} style={{
                  background:"rgba(255,140,0,0.1)",border:"1px solid rgba(255,140,0,0.3)",
                  color:"var(--orange)",padding:"6px 12px",borderRadius:6,fontSize:12,fontWeight:700,
                  fontFamily:"'Rajdhani',sans-serif",cursor:"pointer"}}>✗ Ablehnen</button>}
                <button onClick={()=>onDelete(item.id)} style={{
                  background:"rgba(255,68,68,0.1)",border:"1px solid rgba(255,68,68,0.3)",
                  color:"var(--red)",padding:"6px 10px",borderRadius:6,fontSize:12,cursor:"pointer"}}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

function ProfileModal({ user: profileUser, items, onClose }) {
  const userItems = items.filter(i=>i.uploaderName===profileUser.username&&i.status==="PUBLISHED");
  return (
    <Modal onClose={onClose} title={`👤 ${profileUser.username}`} wide>
      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:24,
        background:"var(--bg3)",borderRadius:12,padding:20,border:"1px solid var(--border)"}}>
        <div style={{
          width:64,height:64,borderRadius:"50%",
          background:"linear-gradient(135deg,var(--cyan3),var(--cyan))",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:24,fontWeight:700,color:"#000",
          boxShadow:"0 0 20px var(--cyan-glow)"
        }}>{profileUser.avatar}</div>
        <div>
          <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:20,fontWeight:700,color:"var(--text)"}}>{profileUser.username}</h2>
          {profileUser.isAdmin&&<span style={{background:"rgba(255,140,0,0.1)",border:"1px solid rgba(255,140,0,0.3)",
            color:"#ff8c00",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4}}>ADMIN</span>}
          <div style={{fontSize:13,color:"var(--text3)",marginTop:4}}>{userItems.length} Items eingereicht</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {userItems.map(item=>(
          <div key={item.id} style={{background:"var(--bg3)",border:"1px solid var(--border)",
            borderRadius:10,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:18}}>{itemTypeIcon(item.itemType)}</span>
              <span style={{fontWeight:700,fontSize:13}}>{item.name}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <RarityBadge rarityId={item.rarity} small/>
              <span style={{fontSize:12,color:"var(--text2)"}}>❤ {item.likes}</span>
            </div>
          </div>
        ))}
        {userItems.length===0&&<div style={{color:"var(--text3)",fontSize:13,padding:20}}>Keine veröffentlichten Items.</div>}
      </div>
    </Modal>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({rarity:"",crate:"",sort:"newest"});
  const [modal, setModal] = useState(null); // null | "create" | "detail" | "admin" | "profile"
  const [selectedItem, setSelectedItem] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type="success") => {
    setToast({msg, type});
    setTimeout(()=>setToast(null), 3000);
  };

  const handleLogin = () => {
    setUser({ username: "ShadowCraft_99", avatar: "SC", isAdmin: true, discordId: "123" });
    showToast("✓ Erfolgreich eingeloggt!");
  };
  const handleLogout = () => { setUser(null); showToast("Ausgeloggt", "info"); };

  const publicItems = items.filter(i => i.status === "PUBLISHED");
  const filtered = publicItems.filter(i => {
    if(search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.itemType.includes(search.toLowerCase())) return false;
    if(filters.rarity && i.rarity !== filters.rarity) return false;
    if(filters.crate && i.crate !== filters.crate) return false;
    return true;
  }).sort((a,b) => {
    if(filters.sort==="popular") return b.likes - a.likes;
    if(filters.sort==="stars") return b.stars - a.stars;
    return b.createdAt - a.createdAt;
  });

  const handleSaveItem = (item) => {
    setItems(prev=>[...prev, item]);
    showToast("Item eingereicht! Wartet auf Freigabe durch einen Admin.");
  };
  const handleLike = (id) => {
    if(!user) { showToast("Login erforderlich!", "error"); return; }
    setItems(prev=>prev.map(i=>i.id===id?{...i,likes:i.liked?i.likes-1:i.likes+1,liked:!i.liked}:i));
    if(selectedItem?.id===id) setSelectedItem(prev=>({...prev,likes:prev.liked?prev.likes-1:prev.likes+1,liked:!prev.liked}));
  };
  const handleComment = (id, msg) => {
    const c = {id:`c${Date.now()}`,userId:"me",username:user.username,avatar:user.avatar,message:msg,createdAt:new Date()};
    setItems(prev=>prev.map(i=>i.id===id?{...i,comments:[...i.comments,c]}:i));
    setSelectedItem(prev=>({...prev,comments:[...prev.comments,c]}));
  };
  const handlePublish = (id) => { setItems(prev=>prev.map(i=>i.id===id?{...i,status:"PUBLISHED"}:i)); showToast("✓ Item veröffentlicht!"); };
  const handleReject = (id) => { setItems(prev=>prev.map(i=>i.id===id?{...i,status:"REJECTED"}:i)); showToast("Item abgelehnt", "error"); };
  const handleDelete = (id) => { setItems(prev=>prev.filter(i=>i.id!==id)); showToast("Item gelöscht", "error"); };

  const allUsers = 1247;

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",position:"relative"}} className="grid-bg">
      <Scanline/>
      <HexBg/>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed",top:80,right:24,zIndex:300,
          background:toast.type==="error"?"rgba(255,68,68,0.9)":toast.type==="info"?"rgba(0,0,0,0.9)":"rgba(0,229,255,0.9)",
          color:toast.type==="info"?"var(--text)":"#000",
          padding:"12px 20px",borderRadius:10,fontSize:14,fontWeight:600,
          boxShadow:"0 8px 30px rgba(0,0,0,0.5)",
          animation:"slide-in 0.3s ease",fontFamily:"'Rajdhani',sans-serif"
        }}>{toast.msg}</div>
      )}

      <div style={{position:"relative",zIndex:1}}>
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout}
          onAdmin={()=>setModal("admin")}
          onProfile={()=>{setProfileData(user);setModal("profile");}}/>

        {/* Hero */}
        <div style={{
          maxWidth:1280,margin:"0 auto",padding:"60px 24px 40px",textAlign:"center"
        }}>
          <div style={{marginBottom:16}}>
            <span style={{
              background:"var(--cyan-glow2)",border:"1px solid var(--border2)",
              color:"var(--cyan)",borderRadius:20,padding:"4px 16px",
              fontSize:12,fontWeight:600,letterSpacing:2,textTransform:"uppercase"
            }}>Minecraft Community Datenbank</span>
          </div>
          <h1 style={{
            fontFamily:"'Orbitron',sans-serif",
            fontSize:"clamp(28px,5vw,56px)",fontWeight:900,lineHeight:1.1,
            marginBottom:16,
            background:"linear-gradient(180deg,#ffffff 0%,var(--cyan) 100%)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            animation:"flicker 8s ease infinite",letterSpacing:2
          }}>OPBUCHT<br/>ITEM DB</h1>
          <p style={{
            fontSize:16,color:"var(--text2)",maxWidth:560,margin:"0 auto 40px",
            lineHeight:1.7
          }}>
            Diese Website ermöglicht es der Community, OP-Items aus Minecraft zu dokumentieren und für alle zugänglich zu machen.
          </p>

          {/* Stats */}
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:48}}>
            <StatCard label="Registrierte Nutzer" value={allUsers.toLocaleString("de")} icon="👥"/>
            <StatCard label="Items in der Datenbank" value={publicItems.length} icon="⚔️"/>
          </div>

          {/* Search */}
          <div style={{maxWidth:860,margin:"0 auto 16px"}}>
            <SearchBar search={search} setSearch={setSearch} filters={filters} setFilters={setFilters}/>
          </div>
          <button onClick={()=>{if(!user){showToast("Login erforderlich!","error");return;}setModal("create");}} style={{
            background:"linear-gradient(135deg,var(--cyan3),var(--cyan2))",
            border:"none",color:"#000",padding:"12px 28px",borderRadius:10,
            fontSize:15,fontWeight:700,fontFamily:"'Orbitron',sans-serif",letterSpacing:1,
            cursor:"pointer",boxShadow:"0 4px 20px var(--cyan-glow)",transition:"all 0.2s",
            display:"inline-flex",alignItems:"center",gap:8,
            animation:"float 4s ease-in-out infinite"
          }} onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 30px rgba(0,229,255,0.4)"}}
             onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 4px 20px var(--cyan-glow)"}}>
            ⚔ ITEM ERSTELLEN
          </button>
        </div>

        {/* Items Grid */}
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px 80px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <span style={{fontSize:13,color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace"}}>
              {filtered.length} ITEMS GEFUNDEN
            </span>
          </div>
          {filtered.length===0?(
            <div style={{textAlign:"center",padding:"60px 20px",color:"var(--text3)"}}>
              <div style={{fontSize:48,marginBottom:16}}>🔍</div>
              <div style={{fontSize:16,fontFamily:"'Orbitron',sans-serif",letterSpacing:1}}>Keine Items gefunden</div>
              <div style={{fontSize:13,marginTop:8}}>Versuche einen anderen Suchbegriff</div>
            </div>
          ):(
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
              gap:16
            }}>
              {filtered.map((item,i)=>(
                <div key={item.id} style={{animationDelay:`${i*0.05}s`}}>
                  <ItemCard item={item} onOpen={(item)=>{setSelectedItem(item);setModal("detail");}}/>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal==="create"&&<CreateItemModal onClose={()=>setModal(null)} onSave={handleSaveItem} user={user}/>}
      {modal==="detail"&&selectedItem&&(
        <ItemDetailModal item={selectedItem} onClose={()=>setModal(null)}
          user={user} onLike={handleLike} onComment={handleComment}
          onPublish={handlePublish} onReject={handleReject} onDelete={handleDelete}/>
      )}
      {modal==="admin"&&<AdminDashboard items={items} onClose={()=>setModal(null)}
        onPublish={handlePublish} onReject={handleReject} onDelete={handleDelete}/>}
      {modal==="profile"&&profileData&&<ProfileModal user={profileData} items={items} onClose={()=>setModal(null)}/>}
    </div>
  );
}
