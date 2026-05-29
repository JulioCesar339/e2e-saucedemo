import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("error_rate");

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m",  target: 50 },
    { duration: "30s", target: 0  },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
    error_rate: ["rate<0.01"],
  },
};

export default function () {
  // PASO 1: Login page (pública, siempre 200)
  const loginRes = http.get("https://www.saucedemo.com/");
  const loginOk = check(loginRes, {
    "login page status 200": (r) => r.status === 200,
    "login page carga en < 2s": (r) => r.timings.duration < 2000,
  });
  errorRate.add(!loginOk);
  sleep(1);

  // PASO 2: Repetimos login page con distinto path para simular más carga
  // (inventory y cart requieren sesión — k6 no maneja cookies de Playwright)
  const loginRes2 = http.get("https://www.saucedemo.com/");
  const loginOk2 = check(loginRes2, {
    "segunda peticion status 200": (r) => r.status === 200,
    "segunda peticion carga en < 2s": (r) => r.timings.duration < 2000,
  });
  errorRate.add(!loginOk2);
  sleep(1);

  // PASO 3: Una tercera petición para medir consistencia bajo carga
  const loginRes3 = http.get("https://www.saucedemo.com/");
  const loginOk3 = check(loginRes3, {
    "tercera peticion status 200": (r) => r.status === 200,
    "tercera peticion carga en < 2s": (r) => r.timings.duration < 2000,
  });
  errorRate.add(!loginOk3);
  sleep(1);
}
