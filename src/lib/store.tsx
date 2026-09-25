"use client";

/**
 * Client-side content store for the CMS.
 *
 * The public site is server-rendered from `src/data/portfolio.ts` (good for SEO
 * and first paint). After hydration this provider fetches the shared override
 * saved on the server (Vercel Blob, via /api/portfolio) and layers it on top,
 * so admin edits show up on EVERY device — not just the browser that made them.
 *
 * Saves are pushed back to the server (admin session required); uploaded images
 * live as separate blobs and the saved JSON only references their URLs.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import basePortfolio from "@/data/portfolio";
import { fetchPortfolio, savePortfolio } from "@/lib/api";
import type { Portfolio } from "@/types/portfolio";

type Updater = Portfolio | ((prev: Portfolio) => Portfolio);

interface PortfolioContextValue {
  /** The live portfolio data (base + saved edits). */
  data: Portfolio;
  /** True once the server override has been applied (post-hydration). */
  ready: boolean;
  /** Update + persist the portfolio. Accepts a new object or an updater fn. */
  update: (updater: Updater) => void;
  /** Clear all saved edits and restore the original content (all devices). */
  reset: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

const LOCAL_STORAGE_KEY = "phat-portfolio-override";

/** Shallow-merge saved edits over the base so new base keys still appear. */
function mergeBase(saved: Partial<Portfolio>): Portfolio {
  return { ...basePortfolio, ...saved };
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Seed with base data so server and first client render match (no hydration
  // mismatch); the server override or local storage override is applied in the effect below.
  const [data, setData] = useState<Portfolio>(basePortfolio);
  const [ready, setReady] = useState(false);

  // Skip the very first persist (it would just echo back what we loaded).
  const dirty = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPortfolio()
      .then((saved) => {
        if (!alive) return;
        if (saved) {
          setData(mergeBase(saved));
        } else {
          // Fallback to localStorage if server Blob is not configured
          try {
            const local = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (local) {
              setData(mergeBase(JSON.parse(local)));
            }
          } catch {}
        }
      })
      .catch(() => {
        if (!alive) return;
        try {
          const local = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (local) {
            setData(mergeBase(JSON.parse(local)));
          }
        } catch {}
      })
      .finally(() => {
        if (alive) setReady(true);
      });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        if (e.newValue) {
          try {
            setData(mergeBase(JSON.parse(e.newValue)));
          } catch {}
        } else {
          setData(basePortfolio);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      alive = false;
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Debounced persist to the server & instant persist to localStorage
  useEffect(() => {
    if (!ready || !dirty.current) return;

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {}

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      savePortfolio(data).then((ok) => {
        if (!ok) console.warn("Dữ liệu đã được lưu vào LocalStorage (Server Blob chưa cấu hình).");
      });
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, ready]);

  const update = useCallback((updater: Updater) => {
    dirty.current = true;
    setData((prev) => (typeof updater === "function" ? updater(prev) : updater));
  }, []);

  const reset = useCallback(() => {
    dirty.current = true;
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
    setData(basePortfolio);
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, ready, update, reset }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within a PortfolioProvider");
  return ctx;
}

/**
 * Applies editable favicon / OG image to the document head on the client.
 * (SSR keeps the defaults from `metadata` for crawlers.)
 */
export function DynamicHead() {
  const { data, ready } = usePortfolio();
  useEffect(() => {
    if (!ready) return;
    const { name, role } = data.person;
    if (name) document.title = role ? `${name} — ${role}` : name;
    const favicon = data.site?.favicon;
    if (favicon) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = favicon;
    }
    const og = data.site?.ogImage;
    if (og) {
      let meta = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", "og:image");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", og);
    }
  }, [data.site, data.person.name, data.person.role, ready]);
  return null;
}
