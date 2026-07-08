import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 👇 Reemplaza con tus datos de Supabase
const SUPABASE_URL = "https://djgufncvbuaqnkggcqzj.supabase.co";
const SUPABASE_KEY = "sb_publishable_v-r7kNbr6LBWXzq2iNYwDA_nWCfbteW ";
const GROQ_KEY = "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";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SYSTEM_PROMPT = (apodo: string) =>
  `Eres Lumi, un asistente de apoyo emocional cálido, empático y accesible para personas de todas las edades. Tu inspiración es Baymax: eres gentil, paciente, nunca juzgas, y siempre priorizas el bienestar emocional de la persona.

El apodo de la persona con quien hablas es "${apodo}". Úsalo ocasionalmente para hacer la conversación más personal y cálida.

PERSONALIDAD:
- Hablas de forma simple, cálida y reconfortante
- Adaptas tu lenguaje según la edad aparente del usuario
- Nunca das diagnósticos médicos ni reemplazas a un profesional
- Cuando detectas algo serio, siempre sugieres buscar ayuda profesional con amor
- Usas emojis suaves (✨💛🌿) con moderación
- Primero escuchas, luego preguntas, luego acompañas

REGLAS:
- Nunca minimices los sentimientos del usuario
- Si alguien dice que está en peligro, proporciona líneas de crisis de inmediato
- Responde siempre en el idioma en que te hablen
- Máx 3-4 oraciones por turno
- No des consejos no solicitados; primero valida`;

const QUICK_PROMPTS = [
  { emoji: "😔", text: "Me siento triste" },
  { emoji: "😰", text: "Estoy ansioso/a" },
  { emoji: "😤", text: "Estoy enojado/a" },
  { emoji: "😴", text: "Me siento sin energía" },
  { emoji: "💬", text: "Solo quiero hablar" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "12px 16px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%", background: "#a78bfa",
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,.3)}50%{box-shadow:0 0 0 12px rgba(167,139,250,0)} }
      `}</style>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display:"flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom:12, animation:"fadeIn 0.3s ease-out" }}>
      {!isUser && (
        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#c4b5fd,#818cf8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, marginRight:8, flexShrink:0, alignSelf:"flex-end" }}>🌟</div>
      )}
      <div style={{ maxWidth:"75%", padding:"12px 16px", borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: isUser ? "linear-gradient(135deg,#818cf8,#a78bfa)" : "rgba(255,255,255,0.85)", color: isUser ? "#fff" : "#374151", fontSize:15, lineHeight:1.6, boxShadow: isUser ? "0 4px 15px rgba(129,140,248,.3)" : "0 2px 12px rgba(0,0,0,.06)" }}>
        {msg.content}
      </div>
    </div>
  );
}

function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      onAuth();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#eef2ff,#f5f3ff,#fdf4ff)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:20 }}>
      <div style={{ fontSize:48, marginBottom:8, animation:"float 3s ease-in-out infinite" }}>🌟</div>
      <h1 style={{ margin:"0 0 4px", color:"#4c1d95", fontSize:28, fontWeight:700 }}>Lumi</h1>
      <p style={{ margin:"0 0 32px", color:"#7c3aed", opacity:.7, fontSize:14 }}>Tu compañero emocional</p>

      <div style={{ width:"100%", maxWidth:360, background:"rgba(255,255,255,0.8)", backdropFilter:"blur(20px)", borderRadius:24, padding:28, boxShadow:"0 8px 40px rgba(139,92,246,.15)", border:"1px solid rgba(167,139,250,.2)" }}>
        <h2 style={{ margin:"0 0 20px", color:"#4c1d95", fontSize:18, fontWeight:600 }}>{isLogin ? "Bienvenido de vuelta 💛" : "Crear cuenta 🌿"}</h2>

        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" type="email"
          style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:"1.5px solid rgba(167,139,250,.3)", outline:"none", fontSize:15, marginBottom:12, background:"rgba(255,255,255,.8)", color:"#1f2937", boxSizing:"border-box" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password"
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:"1.5px solid rgba(167,139,250,.3)", outline:"none", fontSize:15, marginBottom:16, background:"rgba(255,255,255,.8)", color:"#1f2937", boxSizing:"border-box" }} />

        {error && <p style={{ color:"#dc2626", fontSize:13, marginBottom:12 }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#818cf8,#a78bfa)", color:"#fff", fontSize:15, fontWeight:600, cursor:loading ? "not-allowed" : "pointer", marginBottom:12 }}>
          {loading ? "..." : isLogin ? "Entrar" : "Registrarme"}
        </button>

        <p style={{ textAlign:"center", fontSize:13, color:"#6d28d9", cursor:"pointer", margin:0 }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Entra aquí"}
        </p>
      </div>
    </div>
  );
}

function ApodoScreen({ onSave }: { onSave: (apodo: string) => void }) {
  const [apodo, setApodo] = useState("");

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#eef2ff,#f5f3ff,#fdf4ff)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:20 }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🌟</div>
      <div style={{ width:"100%", maxWidth:360, background:"rgba(255,255,255,0.8)", backdropFilter:"blur(20px)", borderRadius:24, padding:28, boxShadow:"0 8px 40px rgba(139,92,246,.15)", border:"1px solid rgba(167,139,250,.2)", textAlign:"center" }}>
        <h2 style={{ color:"#4c1d95", margin:"0 0 8px", fontSize:20 }}>¡Hola! Soy Lumi 💛</h2>
        <p style={{ color:"#6d28d9", fontSize:14, margin:"0 0 24px", opacity:.8 }}>¿Cómo te gustaría que te llame?</p>
        <input value={apodo} onChange={e => setApodo(e.target.value)} placeholder="Tu apodo..." autoFocus
          onKeyDown={e => e.key === "Enter" && apodo.trim() && onSave(apodo.trim())}
          style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:"1.5px solid rgba(167,139,250,.3)", outline:"none", fontSize:15, marginBottom:16, background:"rgba(255,255,255,.8)", color:"#1f2937", boxSizing:"border-box", textAlign:"center" }} />
        <button onClick={() => apodo.trim() && onSave(apodo.trim())} disabled={!apodo.trim()}
          style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background: apodo.trim() ? "linear-gradient(135deg,#818cf8,#a78bfa)" : "rgba(167,139,250,.3)", color:"#fff", fontSize:15, fontWeight:600, cursor: apodo.trim() ? "pointer" : "not-allowed" }}>
          ¡Listo!
        </button>
      </div>
    </div>
  );
}

export default function LumiApp() {
  const [screen, setScreen] = useState<"auth" | "apodo" | "chat">("auth");
  const [userId, setUserId] = useState<string | null>(null);
  const [apodo, setApodo] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) initUser(data.session.user.id);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function initUser(uid: string) {
    setUserId(uid);
    const { data: profile } = await supabase.from("profiles").select("apodo").eq("id", uid).single();

    if (!profile?.apodo) {
      setScreen("apodo");
    } else {
      setApodo(profile.apodo);
      await loadHistory(uid, profile.apodo);
      setScreen("chat");
    }
  }

  async function loadHistory(uid: string, apodoNombre: string) {
    const { data } = await supabase.from("messages").select("role,content").eq("user_id", uid).order("created_at");
    if (data && data.length > 0) {
      setMessages(data as Message[]);
    } else {
      setMessages([{ role: "assistant", content: `Hola ${apodoNombre} 💛 Soy Lumi. Estoy aquí para escucharte, sin prisa y sin juicios. ¿Cómo te sientes hoy?` }]);
    }
  }

  async function handleAuth() {
    const { data } = await supabase.auth.getSession();
    if (data.session) initUser(data.session.user.id);
  }

  async function handleSaveApodo(nombre: string) {
    setApodo(nombre);
    await supabase.from("profiles").upsert({ id: userId, apodo: nombre });
    const bienvenida: Message = { role: "assistant", content: `¡Qué bonito nombre, ${nombre}! 🌟 Estoy aquí para escucharte cuando lo necesites. ¿Cómo te sientes hoy?` };
    setMessages([bienvenida]);
    await supabase.from("messages").insert({ user_id: userId, role: "assistant", content: bienvenida.content });
    setScreen("chat");
  }

  async function sendMessage(text?: string) {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMsg: Message = { role: "user", content: userText };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    await supabase.from("messages").insert({ user_id: userId, role: "user", content: userText });

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [
            { role: "system", content: SYSTEM_PROMPT(apodo) },
            ...newMessages,
          ],
        }),
      });
      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content ?? "Lo siento, intenta de nuevo 💛";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      await supabase.from("messages").insert({ user_id: userId, role: "assistant", content: reply });
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Hubo un problema. Intenta de nuevo 🌿" }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setScreen("auth");
    setMessages([]);
    setApodo("");
  }

  if (screen === "auth") return <AuthScreen onAuth={handleAuth} />;
  if (screen === "apodo") return <ApodoScreen onSave={handleSaveApodo} />;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#eef2ff,#f5f3ff,#fdf4ff)", display:"flex", flexDirection:"column", alignItems:"center", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:"20px 16px" }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}} @keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,.3)}50%{box-shadow:0 0 0 12px rgba(167,139,250,0)}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}`}</style>

      <div style={{ width:"100%", maxWidth:520, marginBottom:16, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#c4b5fd,#818cf8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, animation:"float 3s ease-in-out infinite", boxShadow:"0 4px 20px rgba(167,139,250,.4)" }}>🌟</div>
        <div>
          <h1 style={{ margin:0, fontSize:22, fontWeight:700, color:"#4c1d95" }}>Lumi</h1>
          <p style={{ margin:0, fontSize:13, color:"#7c3aed", opacity:.7 }}>Hola, {apodo} 💛</p>
        </div>
        <button onClick={handleLogout} style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:20, border:"1.5px solid rgba(167,139,250,.4)", background:"rgba(255,255,255,.7)", color:"#6d28d9", fontSize:12, cursor:"pointer" }}>Salir</button>
      </div>

      <div style={{ width:"100%", maxWidth:520, background:"rgba(255,255,255,.6)", backdropFilter:"blur(20px)", borderRadius:24, border:"1px solid rgba(167,139,250,.2)", boxShadow:"0 8px 40px rgba(139,92,246,.1)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ height:400, overflowY:"auto", padding:"20px 16px 8px" }}>
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && (
            <div style={{ display:"flex", justifyContent:"flex-start" }}>
              <div style={{ background:"rgba(255,255,255,.85)", borderRadius:"18px 18px 18px 4px" }}><TypingDots /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding:"8px 16px", display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none" }}>
          {QUICK_PROMPTS.map((p) => (
            <button key={p.text} onClick={() => sendMessage(p.text)} disabled={loading}
              style={{ flexShrink:0, padding:"7px 14px", borderRadius:20, border:"1.5px solid rgba(167,139,250,.4)", background:"rgba(255,255,255,.8)", color:"#6d28d9", fontSize:13, cursor:loading ? "not-allowed" : "pointer", whiteSpace:"nowrap" }}>
              {p.emoji} {p.text}
            </button>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, padding:"12px 16px 16px", borderTop:"1px solid rgba(167,139,250,.15)" }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
            placeholder="Escribe cómo te sientes..." rows={1} disabled={loading}
            style={{ flex:1, padding:"12px 16px", borderRadius:20, border:"1.5px solid rgba(167,139,250,.3)", outline:"none", fontSize:15, fontFamily:"inherit", resize:"none", background:"rgba(255,255,255,.8)", color:"#1f2937" }} />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            style={{ width:46, height:46, borderRadius:"50%", border:"none", background: loading || !input.trim() ? "rgba(167,139,250,.3)" : "linear-gradient(135deg,#818cf8,#a78bfa)", color:"#fff", fontSize:20, cursor: loading || !input.trim() ? "not-allowed" : "pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>➤</button>
        </div>
      </div>

      <p style={{ marginTop:16, fontSize:12, color:"#9ca3af", textAlign:"center", maxWidth:420, lineHeight:1.5 }}>
        Lumi es un apoyo emocional, no un profesional de salud mental.
      </p>
    </div>
  );
}