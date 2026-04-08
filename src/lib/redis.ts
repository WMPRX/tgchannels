import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) return null;
  try {
    const client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
    });
    client.on('error', (err) => {
      console.error('Redis error:', err.message);
    });
    return client;
  } catch {
    console.warn('Redis connection failed, caching disabled');
    return null;
  }
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis ?? undefined;
}

export async function redisGet(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

export async function redisSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (!redis) return;
  try {
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, value);
    } else {
      await redis.set(key, value);
    }
  } catch {
    // silently fail
  }
}

export async function redisExists(key: string): Promise<boolean> {
  if (!redis) return false;
  try {
    const result = await redis.exists(key);
    return result === 1;
  } catch {
    return false;
  }
}

export default redis;
