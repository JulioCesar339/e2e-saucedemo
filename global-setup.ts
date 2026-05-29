// global-setup.ts
// Fuente: https://playwright.dev/docs/test-global-setup-teardown
// Este archivo se ejecuta UNA sola vez antes de toda la suite de tests.
// Su propósito: verificar que el sitio esté disponible antes de correr los tests,
// evitando falsos negativos por problemas de red o caídas del servidor.

import { chromium } from "@playwright/test";
// chromium → navegador de Playwright para hacer la verificación inicial

async function globalSetup() {
  // Lanzamos un navegador temporal solo para verificar disponibilidad
  const browser = await chromium.launch();
  // chromium.launch() → abre una instancia headless (sin ventana visible)

  const page = await browser.newPage();
  // newPage() → abre una nueva pestaña dentro del navegador

  try {
    // Intentamos navegar a SauceDemo con un timeout de 10 segundos
    await page.goto("https://www.saucedemo.com", { timeout: 10000 });
    // timeout: 10000 → si no carga en 10s, lanza un error

    console.log("✅ SauceDemo disponible — iniciando tests");
    // Confirmación visual en la consola de CI/CD
  } catch {
    // Si el sitio no responde, detenemos toda la suite con un mensaje claro
    throw new Error(
      "❌ SauceDemo no disponible. Verifica tu conexión a internet."
    );
  } finally {
    // finally → se ejecuta siempre, haya error o no
    await browser.close();
    // Cerramos el navegador temporal para liberar memoria
  }
}

export default globalSetup;
// Playwright necesita que el globalSetup sea el export default del archivo
