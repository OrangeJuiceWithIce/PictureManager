package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
)

var (
	Client *redis.Client
	Ctx    = context.Background()
)

func InitRedis() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("[InitRedis]failed to load .env:%v\n", err)
	}

	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")
	redisPassword := os.Getenv("REDIS_PASSWORD")

	Client = redis.NewClient(&redis.Options{
		Addr:         fmt.Sprintf("%s:%s", redisHost, redisPort),
		Password:     redisPassword,
		DB:           0,
		PoolSize:     20,
		MinIdleConns: 5,
		MaxRetries:   3,
		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
	})

	_, err = Client.Ping(Ctx).Result()
	if err != nil {
		log.Printf("[InitRedis]failed to connect to Redis:%v", err)
	} else {
		log.Println("[InitRedis]Successfully connected to Redis")
	}
}

func AcquireLock(key string, expiration time.Duration) (bool, error) {
	return Client.SetNX(Ctx, "lock:"+key, "1", expiration).Result()
}

func ReleaseLock(key string) error {
	return Client.Del(Ctx, "lock:"+key).Err()
}

func SetCache(key string, value string, expiration time.Duration) error {
	return Client.Set(Ctx, "cache:"+key, value, expiration).Err()
}

func GetCache(key string) (string, error) {
	return Client.Get(Ctx, "cache:"+key).Result()
}

func DeleteCache(key string) error {
	return Client.Del(Ctx, "cache:"+key).Err()
}

func SetCacheJSON(key string, value interface{}, expiration time.Duration) error {
	jsonData, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return Client.Set(Ctx, "cache:"+key, jsonData, expiration).Err()
}

func GetCacheJSON(key string, dest interface{}) error {
	data, err := Client.Get(Ctx, "cache:"+key).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(data), dest)
}

func WithLock(key string, expiration time.Duration, fn func() error) error {
	maxRetries := 10
	retryInterval := 100 * time.Millisecond

	for i := 0; i < maxRetries; i++ {
		acquired, err := AcquireLock(key, expiration)
		if err != nil {
			return err
		}
		if acquired {
			defer ReleaseLock(key)
			return fn()
		}
		time.Sleep(retryInterval)
	}
	return fmt.Errorf("[WithLock]failed to acquire lock")
}

func DeleteCachePattern(pattern string) error {
	iter := Client.Scan(Ctx, 0, "cache:"+pattern+"*", 100).Iterator()
	for iter.Next(Ctx) {
		if err := Client.Del(Ctx, iter.Val()).Err(); err != nil {
			return err
		}
	}
	return iter.Err()
}
