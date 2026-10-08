import { useEffect, useRef, useState } from "react";
import { ArrowUp, Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { refineChat } from "@/lib/actions";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function getSpeech(): (new () => SpeechRec) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function ChatPanel() {
  const messages = useApp((s) => s.messages);
  const busy = useApp((s) => s.busy);
  const doc = useApp((s) => s.doc);
  const applyQuestionPatch = useApp((s) => s.applyQuestionPatch);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRec | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function send(value?: string) {
    const v = (value ?? text).trim();
    if (!v || busy) return;
    setText("");
    void refineChat(v);
  }

  function toggleMic() {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const Ctor = getSpeech();
    if (!Ctor) {
      useApp.getState().setError("Voice isn’t supported in this browser — type the part instead.");
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (ev) => {
      const said = ev.results[0]?.[0]?.transcript ?? "";
      if (said) send(said);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Refinement</p>
        <p className="mt-1 text-sm text-muted">
          {doc ? `Never assume. ${doc.name} — ask until it’s right.` : "Never assume. Ask until it’s right."}
        </p>
      </div>
      <div ref={scroller} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-2">
        {messages.length === 0 && !doc ? (
          <p className="text-sm text-muted">
            Describe a part, or drop a sketch. Example: “80 × 50 × 10 plate with four M3 holes.”
          </p>
        ) : null}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[92%] rounded-md px-3 py-2 text-sm leading-relaxed",
                m.role === "user" ? "bg-accent text-accent-fg" : "bg-surface-subtle text-fg",
              )}
            >
              {m.text}
              {m.questions && m.questions.length > 0 ? (
                <div className="mt-3 flex flex-col gap-3">
                  {m.questions.map((q) => (
                    <div key={q.id}>
                      <p className="text-sm font-medium">{q.prompt}</p>
                      {q.why ? <p className="mt-0.5 text-xs text-muted">{q.why}</p> : null}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {q.options.map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            disabled={Boolean(q.answered) || busy}
                            onClick={() => {
                              if (opt.patch) applyQuestionPatch(opt.patch, opt.reply, q.id);
                              else void refineChat(opt.reply);
                            }}
                            className="h-9 rounded-full px-3 text-xs text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)] disabled:opacity-40"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {busy ? (
          <p className="shimmer rounded-sm px-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Reading the sketch
          </p>
        ) : null}
      </div>
      <form
        className="flex items-end gap-2 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <Button
          type="button"
          size="icon"
          variant={listening ? "default" : "outline"}
          onClick={toggleMic}
          aria-label={listening ? "Stop listening" : "Speak a description"}
        >
          {listening ? <Square /> : <Mic />}
        </Button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={doc ? "Make the hole 8 mm…" : "Describe a part…"}
          className="h-11 min-w-0 flex-1 rounded-sm bg-surface-subtle px-3 text-sm text-fg placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="icon" disabled={busy || !text.trim()} aria-label="Send">
          <ArrowUp />
        </Button>
      </form>
    </div>
  );
}
