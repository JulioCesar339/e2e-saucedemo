// tests/k6/load-test.js
// Test de carga sobre SauceDemo con k6
// Fuente: https://k6.io/docs/
//
// ¿Por qué k6?
// k6 ejecuta scripts JavaScript para simular múltiples usuarios (VUs = Virtual Users)
// haciendo requests HTTP simultáneos. Mide tiempos de respuesta, errores y throughput.
// A diferencia de Playwright (que testea la UI), k6 testea directamente los endpoints HTTP.

import http from "k6/http";
// k6/http → módulo nativo de k6 para hacer requests HTTP

import { check, sleep } from "k6";
// check  → función para hacer aserciones dentro del test de carga
// sleep  → pausa entre requests para simular comportamiento real de un usuario

import { Rate } from "k6/metrics";
// Rate → métrica personalizada para trackear una tasa (ej: % de errores)

// --- Métrica personalizada ---
const errorRate = new Rate("error_rate");
// Creamos una métrica "error_rate" que trackea el % de requests fallidos
// Aparecerá en el output final de k6 como una métrica adicional

// --- Configuración del escenario de carga ---
export const options = {
  // Fuente: https://k6.io/docs/using-k6/options/
  stages: [
    { duration: "30s", target: 10  },
    // Rampa de subida: en 30 segundos llegamos de 0 a 10 usuarios simultáneos

    { duration: "1m",  target: 50  },
    // Carga sostenida: mantenemos 50 usuarios durante 1 minuto

    { duration: "30s", target: 0   },
    // Rampa de bajada: en 30 segundos reducimos de 50 a 0 usuarios
  ],

  thresholds: {
    // Fuente: https://k6.io/docs/using-k6/thresholds/
    // Criterios de pase/fallo del test — si se superan, k6 sale con código de error

    http_req_duration: ["p(95)<500"],
    // El percentil 95 de los tiempos de respuesta debe ser < 500ms
    // p(95)<500 significa: "el 95% de las requests deben responder en menos de 500ms"

    error_rate: ["rate<0.01"],
    // La tasa de error debe ser menor al 1%
    // rate<0.01 → menos del 1% de requests pueden fallar
  },
};

// --- Función principal del test ---
// k6 ejecuta esta función una vez por cada VU (usuario virtual) en cada iteración
export default function () {

  // -----------------------------------------------
  // PASO 1: Request al login (simula un usuario autenticándose)
  // -----------------------------------------------
  const loginPayload = JSON.stringify({
    username: "standard_user",
    password: "secret_sauce",
  });
  // JSON.stringify() → convierte el objeto a string JSON para enviarlo en el body

  const loginHeaders = { "Content-Type": "application/json" };
  // Content-Type: application/json → le indica al servidor que enviamos JSON

  // NOTA: SauceDemo es una SPA (Single Page App) que no tiene un endpoint POST /login real.
  // Testeamos las páginas HTML directamente con GET para medir tiempos de carga.

  // -----------------------------------------------
  // PASO 2: GET a la página principal (login page)
  // -----------------------------------------------
  const loginRes = http.get("https://www.saucedemo.com/");
  // http.get() → hace un GET HTTP y retorna un objeto Response con status, body, timings

  // check() → evalúa condiciones sobre la respuesta y las registra como pass/fail
  const loginOk = check(loginRes, {
    "login page status 200": (r) => r.status === 200,
    // Verificamos que la página cargó correctamente (HTTP 200 OK)

    "login page carga en < 2s": (r) => r.timings.duration < 2000,
    // r.timings.duration → tiempo total de la request en milisegundos
  });

  // Registramos si hubo error (check devuelve false si alguna condición falló)
  errorRate.add(!loginOk);
  // !loginOk → true si hubo fallo, false si todo pasó
  // Rate.add(true) incrementa el contador de errores

  sleep(1);
  // Esperamos 1 segundo entre requests para simular el tiempo que un humano
  // tardaría en leer la página antes de interactuar (think time)

  // -----------------------------------------------
  // PASO 3: GET a la página de inventario
  // -----------------------------------------------
  const inventoryRes = http.get("https://www.saucedemo.com/inventory.html");

  const inventoryOk = check(inventoryRes, {
    "inventory page status 200": (r) => r.status === 200,
    "inventory page carga en < 2s": (r) => r.timings.duration < 2000,
  });

  errorRate.add(!inventoryOk);

  sleep(1);
  // Pausa de 1s entre páginas — simula el tiempo de navegación del usuario

  // -----------------------------------------------
  // PASO 4: GET a la página del carrito
  // -----------------------------------------------
  const cartRes = http.get("https://www.saucedemo.com/cart.html");

  const cartOk = check(cartRes, {
    "cart page status 200": (r) => r.status === 200,
    "cart page carga en < 2s": (r) => r.timings.duration < 2000,
  });

  errorRate.add(!cartOk);

  sleep(1);
}
