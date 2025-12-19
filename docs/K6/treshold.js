export const thresholds = {
  http_req_failed: ['rate<0.01'],       // <1% error
  http_req_duration: ['p(95)<1000'],    // p95 < 1s
};
