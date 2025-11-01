const express = require('express');
const client = require('prom-client');

const app = express();
const register = new client.Registry();

// Автоматический сбор стандартных метрик (CPU, Memory, Event Loop)
client.collectDefaultMetrics({ register });

// Создаём кастомные метрики
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [10, 50, 100, 200, 500, 1000, 2000]
});
register.registerMetric(httpRequestDuration);

// Middleware для измерения времени запроса
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDuration.labels(req.method, req.path, res.statusCode).observe(duration);
  });
  next();
});

// Эндпоинт метрик
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Эндпоинт health для healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Основное приложение
app.get('/', (req, res) => {
  res.send('Hello DevOps!');
});

// Эндпоинт для генерации ошибок (для демонстрации логирования)
app.get('/error', (req, res) => {
  console.error('ERROR: Test error generated for logging demonstration');
  console.error('ERROR: Stack trace simulation - File not found: /nonexistent/file.txt');
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: 'This is a test error for logging',
    timestamp: new Date().toISOString()
  });
});

// Эндпоинт для генерации предупреждений
app.get('/warn', (req, res) => {
  console.warn('WARN: High memory usage detected');
  res.json({ warning: 'Warning logged' });
});


app.get('/info', (req, res) => {
  console.log('INFO: Test info log');
  res.json({ message: 'Info logged' });
});

app.listen(8080, () => console.log('Server running on :8080'));