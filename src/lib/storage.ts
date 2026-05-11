const SCHEMA_VERSION = 1;

type StorageKey =
  | "mcq_attempts"
  | "mcq_attempt_details"
  | "mcq_progress"
  | "mcq_stats"
  | "mcq_schema_version"
  | "mcq_sessions"
  | "mcq_daily_log"
  | "mcq_early_dev_dismissed";

class StorageEngine {
  private static instance: StorageEngine;
  private writeQueue: Map<StorageKey, unknown> = new Map();
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly DEBOUNCE_MS = 300;

  static get(): StorageEngine {
    if (!StorageEngine.instance) {
      StorageEngine.instance = new StorageEngine();
    }
    return StorageEngine.instance;
  }

  getVersion(): number {
    try {
      const raw = localStorage.getItem("mcq_schema_version");
      return raw ? parseInt(raw, 10) : 0;
    } catch {
      return 0;
    }
  }

  setVersion(v: number): void {
    localStorage.setItem("mcq_schema_version", String(v));
  }

  migrate(): void {
    const current = this.getVersion();
    if (current >= SCHEMA_VERSION) return;
    this.setVersion(SCHEMA_VERSION);
  }

  get<T>(key: StorageKey, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      this.remove(key);
      return fallback;
    }
  }

  set<T>(key: StorageKey, value: T): void {
    this.writeQueue.set(key, value);
    this.scheduleFlush();
  }

  setImmediate<T>(key: StorageKey, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full — ignore silently, data is non-critical
    }
  }

  remove(key: StorageKey): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  }

  private scheduleFlush(): void {
    if (this.debounceTimer) return;
    this.debounceTimer = setTimeout(() => this.flush(), this.DEBOUNCE_MS);
  }

  private flush(): void {
    this.debounceTimer = null;
    const queue = new Map(this.writeQueue);
    this.writeQueue.clear();
    queue.forEach((value, key) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage full — skip
      }
    });
  }

  flushImmediate(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.flush();
  }
}

export const storage = StorageEngine.get();

export function initStorage(): void {
  storage.migrate();
}
