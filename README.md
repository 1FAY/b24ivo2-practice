# Задание 1
## 1) Получить и открыть проект

1. Склонировать репозиторий
```bash
git clone https://github.com/1FAY/b24ivo2-practice2.git
```
2.  Перейти в папку практики
   ```bash
   cd b24ivo2-practice2
   ```

## 2) Настроить переменные окружения

Открыть `.env` и указать порты, либо оставить по умолчанию:

```env
HOST_PORT=8080 
REDIS_PORT=6379
```

> Эти переменные будут использоваться в `docker-compose.yml`.

## 3) Собрать и запустить проект

В корне проекта выполнить:
```bash
docker compose up -d --build
```

**Что должно произойти**

- Сборка образа для `web`.
    
- Старт трёх сервисов: `web`, `redis`, `redis-commander`.
    

**Проверка**

```bash
docker compose ps
# Состояние web/redis/redis-commander = Up (healthy)
```

## 4) Проверить работу сервисов (используются порты по умолчанию)

1. Открыть сайт: [http://localhost:8080](http://localhost:8080)  
    При каждом обновлении — число посещений растёт.
    
2. Открыть Redis UI: [http://localhost:8081](http://localhost:8081)  
    Найти ключ `visits` и посмотреть его значение.
    
3. Проверить health endpoint:
    

```bash
curl -f http://localhost:8080/health 
# ожидаем {"status":"ok"}
```
или открыть в браузере: 
http://localhost:8080/health 

# Задание 2
Самостоятельно изучи и подключи к существующему проекту два новых сервиса управления и визуализации, не нарушая работу уже имеющегося стека.

В существующий `docker-compose.yml` добавь:

- `portainer`,
    
- `grafana`.
