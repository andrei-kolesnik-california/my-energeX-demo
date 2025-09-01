import json
import os
import redis
from django.conf import settings

_redis = redis.Redis.from_url(getattr(settings, 'REDIS_URL', os.getenv('REDIS_URL', 'redis://redis:6379/0')), decode_responses=True)

TTL_SECONDS = 90
ALL_KEY = "posts:all"
ONE_KEY = "posts:{}"

def get_json(key: str):
    data = _redis.get(key)
    return json.loads(data) if data else None

def set_json(key: str, value, ttl: int = TTL_SECONDS):
    _redis.setex(key, ttl, json.dumps(value, default=str))

def del_key(key: str):
    _redis.delete(key)

def key_exists(key: str) -> bool:
    return _redis.exists(key) == 1
