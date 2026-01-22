interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

class CacheService {
    private cache: Map<string, CacheEntry<unknown>>;
    private defaultTTL: number;

    constructor(defaultTTL: number = 5 * 60 * 1000) {
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
        this.startCleanup();
    }

    set<T>(key: string, value: T, ttl?: number): void {
        const expiresAt = Date.now() + (ttl || this.defaultTTL);
        this.cache.set(key, { data: value, expiresAt });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return false;
        }

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    private startCleanup(): void {
        setInterval(() => {
            const now = Date.now();
            for (const [key, entry] of this.cache.entries()) {
                if (now > entry.expiresAt) {
                    this.cache.delete(key);
                }
            }
        }, 60 * 1000);
    }

    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}

export const cache = new CacheService();

export const CACHE_KEYS = {
    USER_PROFILE: (userId: string) => `user:profile:${userId}`,
    USER_STATS: (userId: string) => `user:stats:${userId}`,
    TASK_LIST: (userId: string, query: string) => `task:list:${userId}:${query}`,
    TASK_DETAIL: (userId: string, taskId: string) => `task:detail:${userId}:${taskId}`,
    NOTIFICATION_LIST: (userId: string, query: string) => `notification:list:${userId}:${query}`,
    DASHBOARD_STATS: 'dashboard:stats',
} as const;

export const CACHE_TTL = {
    SHORT: 1 * 60 * 1000,
    MEDIUM: 5 * 60 * 1000,
    LONG: 15 * 60 * 1000,
    VERY_LONG: 30 * 60 * 1000,
} as const;
