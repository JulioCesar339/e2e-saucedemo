// playwright.config.ts
// Fuente: https://playwright.dev/docs/test-configuration
// Este archivo es el punto central de configuración de Playwright.
// Aquí definimos: URL base, navegadores, timeouts y el setup global.

import { defineConfig, devices } from "@playwright/test";
// defineConfig → función de Playwright que valida y autocompleta la config
// devices → catálogo de dispositivos predefinidos (Desktop Chrome, iPhone, etc.)

export default defineConfig({
  // --- Dónde están los tests ---
  testDir: "./tests",
  // Playwright buscará archivos *.spec.ts dentro de esta carpeta

  // --- Paralelismo ---
  fullyParallel: true,
  // Corre todos los tests en paralelo para reducir el tiempo total de ejecución

  // --- Fallas en CI ---
  forbidOnly: !!process.env.CI,
  // En CI (GitHub Actions), si alguien dejó un test.only() por error, falla el pipeline

  // --- Reintentos ---
  retries: process.env.CI ? 2 : 0,
  // En CI reintenta 2 veces antes de marcar un test como fallido (por flakiness de red)
  // En local no reintenta para dar feedback inmediato

  // --- Workers (hilos) ---
  workers: process.env.CI ? 1 : undefined,
  // En CI usamos 1 worker para evitar condiciones de carrera
  // En local Playwright elige automáticamente según los núcleos disponibles

  // --- Reporte HTML ---
  reporter: "html",
  // Genera un reporte visual en playwright-report/ que se publica en GitHub Pages

  // --- Setup Global ---
  globalSetup: "./global-setup.ts",
  // Se ejecuta UNA vez antes de todos los tests (ej: verificar que el sitio está up)

  // --- Configuración compartida por todos los tests ---
  use: {
    baseURL: "https://www.saucedemo.com",
    // URL base: permite usar page.goto('/') en lugar de la URL completa

    trace: "on-first-retry",
    // Graba un trace (video + snapshots) solo cuando un test falla y se reintenta
    // Útil para depurar sin grabar todo el tiempo

    screenshot: "only-on-failure",
    // Captura screenshot automáticamente solo cuando un test falla

    video: "on-first-retry",
    // Graba video solo en el primer reintento de un test fallido
  },

  // --- Proyectos (navegadores) ---
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      // Spread operator: aplica todas las config de Desktop Chrome (viewport, UA, etc.)
    },
  ],
});
