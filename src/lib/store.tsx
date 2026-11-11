import { useI18n } from "./i18n";
import { play } from "./sound";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const DEFAULT_ACCENT = "#3be8ff";
const KEY = "mm.state.v2";

export interface User {
  name: string;
  email: string;
  country: string;
  since: number;
}

export interface Brief {
  id: string;
  createdAt: number;
  serviceId: string;
  cat: string;
  color: string;
  weeks: number;
  complexity: number;
  budget: string;
  answers: Record<string, string | number | string[]>;
  stack: string[];
}

export interface Message {
  id: string;
  ref: string;
  createdAt: number;
  name: string;
  email: string;
  topic: string;
  budget: string;
  body: string;
}

export interface Toast {
  id: string;
  text: string;
  tone: "ok" | "info" | "warn" | "heart";
  action?: { label: string; run: () => void };
}

interface Persisted {
  favorites: string[];
  user: User | null;
  briefs: Brief[];
  messages: Message[];
  accent: string;
  badges: string[];
  seen: string[];
  quizBest: number;
}

const initial: Persisted = { favorites: [], user: null, briefs: [], messages: [], accent: DEFAULT_ACCENT, badges: [], seen: [], quizBest: 0 };

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const p = JSON.parse(raw) as Partial<Persisted>;
    return {
      favorites: Array.isArray(p.favorites) ? p.favorites : [],
      user: p.user ?? null,
      briefs: Array.isArray(p.briefs) ? p.briefs : [],
      messages: Array.isArray(p.messages) ? p.messages : [],
      accent: typeof p.accent === "string" ? readableAccent(p.accent) : DEFAULT_ACCENT,
      badges: Array.isArray(p.badges) ? p.badges : [],
      seen: Array.isArray(p.seen) ? p.seen : [],
      quizBest: typeof p.quizBest === "number" ? p.quizBest : 0,
    };
  } catch {
    return initial;
  }
}

export const uid = () => Math.random().toString(36).slice(2, 9);

const toRgb = (hex: string) => {
  const m = hex.replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m.padEnd(6, "0").slice(0, 6);
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255] as [number, number, number];
};

const luminance = ([r, g, b]: [number, number, number]) => {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

/** Keeps any custom accent bright enough to read on the midnight canvas. */
export function readableAccent(hex: string): string {
  if (!/^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hex)) return DEFAULT_ACCENT;
  let [r, g, b] = toRgb(hex);
  let guard = 0;
  while (luminance([r, g, b]) < 0.25 && guard < 24) {
    r = Math.round(r + (255 - r) * 0.09);
    g = Math.round(g + (255 - g) * 0.09);
    b = Math.round(b + (255 - b) * 0.09);
    guard++;
  }
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

type Ctx = {
  favorites: string[];
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => boolean;
  clearFavs: () => void;
  restoreFavs: (ids: string[]) => void;
  user: User | null;
  register: (u: Omit<User, "since">) => void;
  updateUser: (u: Partial<User>) => void;
  logout: () => void;
  briefs: Brief[];
  addBrief: (b: Brief) => void;
  removeBrief: (id: string) => void;
  messages: Message[];
  addMessage: (m: Message) => void;
  removeMessage: (id: string) => void;
  accent: string;
  setAccent: (c: string) => void;
  toasts: Toast[];
  toast: (text: string, tone?: Toast["tone"], action?: Toast["action"]) => void;
  dismissToast: (id: string) => void;
  route: "site" | "dashboard";
  setRoute: (r: "site" | "dashboard") => void;
  dashTab: string;
  setDashTab: (t: string) => void;
  draft: { topic: string; body: string } | null;
  setDraft: (d: { topic: string; body: string } | null) => void;
  detail: { kind: "service" | "project"; id: string } | null;
  openDetail: (kind: "service" | "project", id: string) => void;
  closeDetail: () => void;
  wizardSeed: string | null;
  setWizardSeed: (id: string | null) => void;
  badges: string[];
  seen: string[];
  quizBest: number;
  unlockBadge: (id: string) => boolean;
  markSeen: (id: string) => void;
  setQuizBest: (n: number) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  chatSeed: string | null;
  askBot: (q: string) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [state, setState] = useState<Persisted>(() => (typeof window === "undefined" ? initial : load()));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [route, setRoute] = useState<"site" | "dashboard">("site");
  const [dashTab, setDashTab] = useState("overview");
  const [draft, setDraft] = useState<{ topic: string; body: string } | null>(null);
  const [detail, setDetail] = useState<{ kind: "service" | "project"; id: string } | null>(null);
  const [wizardSeed, setWizardSeed] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState<string | null>(null);
  const timers = useRef<Record<string, number>>({});
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode */
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.style.setProperty("--color-accent", state.accent);
  }, [state.accent]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      Object.values(map).forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const toast = useCallback((text: string, tone: Toast["tone"] = "ok", action?: Toast["action"]) => {
    const id = uid();
    setToasts((prev) => [...prev.slice(-3), { id, text, tone, action }]);
    timers.current[id] = window.setTimeout(
      () => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        delete timers.current[id];
      },
      action ? 7000 : 4200,
    );
  }, []);

  const isFav = useCallback((id: string) => stateRef.current.favorites.includes(id), []);

  const toggleFav = useCallback((id: string) => {
    const nowFav = !stateRef.current.favorites.includes(id);
    setState((prev) => ({
      ...prev,
      favorites: nowFav ? [...prev.favorites, id] : prev.favorites.filter((f) => f !== id),
    }));
    return nowFav;
  }, []);

  const clearFavs = useCallback(() => setState((p) => ({ ...p, favorites: [] })), []);
  const restoreFavs = useCallback(
    (ids: string[]) =>
      setState((p) => ({ ...p, favorites: Array.from(new Set([...p.favorites, ...ids])) })),
    [],
  );

  const register = useCallback((u: Omit<User, "since">) => {
    setState((p) => ({ ...p, user: { ...u, since: p.user?.since ?? Date.now() } }));
  }, []);

  const updateUser = useCallback((u: Partial<User>) => {
    setState((p) => (p.user ? { ...p, user: { ...p.user, ...u } } : p));
  }, []);

  const logout = useCallback(() => setState((p) => ({ ...p, user: null })), []);

  const addBrief = useCallback((b: Brief) => setState((p) => ({ ...p, briefs: [b, ...p.briefs] })), []);

  const removeBrief = useCallback((id: string) => {
    const list = stateRef.current.briefs;
    const index = list.findIndex((b) => b.id === id);
    const found = list[index];
    setState((p) => ({ ...p, briefs: p.briefs.filter((b) => b.id !== id) }));
    return found ? { found, index } : null;
  }, []);

  const restoreBrief = useCallback((b: Brief, index: number) => {
    setState((p) => {
      if (p.briefs.some((x) => x.id === b.id)) return p;
      const next = [...p.briefs];
      next.splice(Math.min(index, next.length), 0, b);
      return { ...p, briefs: next };
    });
  }, []);

  const removeBriefWithUndo = useCallback(
    (id: string) => {
      const removed = removeBrief(id);
      if (removed) pendingRestore.current = () => restoreBrief(removed.found, removed.index);
    },
    [removeBrief, restoreBrief],
  );

  const pendingRestore = useRef<(() => void) | null>(null);

  const addMessage = useCallback((m: Message) => setState((p) => ({ ...p, messages: [m, ...p.messages] })), []);

  const removeMessage = useCallback((id: string) => {
    const found = stateRef.current.messages.find((m) => m.id === id);
    setState((p) => ({ ...p, messages: p.messages.filter((m) => m.id !== id) }));
    if (found) pendingRestore.current = () => setState((p) => ({ ...p, messages: [found, ...p.messages] }));
  }, []);

  const setAccent = useCallback((c: string) => setState((p) => ({ ...p, accent: readableAccent(c) })), []);

  const unlockBadge = useCallback(
    (id: string) => {
      if (stateRef.current.badges.includes(id)) return false;
      setState((p) => (p.badges.includes(id) ? p : { ...p, badges: [...p.badges, id] }));
      play("badge");
      toast(`${t("badge.unlocked")} · ${t("badge." + id)}`, "ok");
      return true;
    },
    [t, toast],
  );

  const markSeen = useCallback((id: string) => {
    setState((p) => (p.seen.includes(id) ? p : { ...p, seen: [...p.seen, id] }));
  }, []);

  const setQuizBest = useCallback((n: number) => {
    setState((p) => (n > p.quizBest ? { ...p, quizBest: n } : p));
  }, []);

  const askBot = useCallback((q: string) => {
    setChatSeed(q);
    setChatOpen(true);
  }, []);

  useEffect(() => {
    if (state.favorites.length >= 3) unlockBadge("fav");
    if (state.seen.length >= 3) unlockBadge("explore");
    if (state.briefs.length >= 1) unlockBadge("brief");
  }, [state.favorites.length, state.seen.length, state.briefs.length, unlockBadge]);
  const openDetail = useCallback(
    (kind: "service" | "project", id: string) => {
      setDetail({ kind, id });
      if (kind === "project") markSeen(id);
      play("whoosh");
    },
    [markSeen],
  );
  const closeDetail = useCallback(() => setDetail(null), []);

  const undoLast = useCallback(() => {
    pendingRestore.current?.();
    pendingRestore.current = null;
  }, []);

  const value = useMemo<Ctx & { undoLast: () => void }>(
    () => ({
      favorites: state.favorites,
      isFav,
      toggleFav,
      clearFavs,
      restoreFavs,
      user: state.user,
      register,
      updateUser,
      logout,
      briefs: state.briefs,
      addBrief,
      removeBrief: removeBriefWithUndo,
      messages: state.messages,
      addMessage,
      removeMessage,
      accent: state.accent,
      setAccent,
      toasts,
      toast,
      dismissToast,
      route,
      setRoute,
      dashTab,
      setDashTab,
      draft,
      setDraft,
      detail,
      openDetail,
      closeDetail,
      wizardSeed,
      setWizardSeed,
      undoLast,
      badges: state.badges,
      seen: state.seen,
      quizBest: state.quizBest,
      unlockBadge,
      markSeen,
      setQuizBest,
      paletteOpen,
      setPaletteOpen,
      chatOpen,
      setChatOpen,
      chatSeed,
      askBot,
    }),
    [
      state,
      isFav,
      toggleFav,
      clearFavs,
      restoreFavs,
      register,
      updateUser,
      logout,
      addBrief,
      removeBriefWithUndo,
      addMessage,
      removeMessage,
      setAccent,
      toasts,
      toast,
      dismissToast,
      route,
      dashTab,
      draft,
      detail,
      openDetail,
      closeDetail,
      wizardSeed,
      undoLast,
      unlockBadge,
      markSeen,
      setQuizBest,
      paletteOpen,
      chatOpen,
      chatSeed,
      askBot,
    ],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx) as (Ctx & { undoLast: () => void }) | null;
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}