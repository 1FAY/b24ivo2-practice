import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  thresholds: {
    http_req_failed: ['rate<=0.001'],  // Не более 0.1% ошибок
    http_req_duration: ['p(95)<=200'], // P95 latency <= 200ms
  },
  stages: [
    { duration: '30s', target: 20 },   // Разогрев: 20 RPS за 30 сек
    { duration: '1m', target: 50 },    // Увеличиваем до 50 RPS
    { duration: '2m', target: 100 },   // Пиковая нагрузка: 100 RPS
    { duration: '1m', target: 0 },     // Спад
  ],
};

const BASE = __ENV.BASE_URL || 'http://localhost';

export default function () {
  let res = http.get(`${BASE}/`);
  check(res, { 'status 200': r => r.status === 200 });
  
  let h = http.get(`${BASE}/health`);
  check(h, { 'health ok': r => r.status === 200 });
  
  sleep(1);
}
