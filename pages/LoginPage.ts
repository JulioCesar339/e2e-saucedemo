// pages/LoginPage.ts
// Patrón: Page Object Model (POM)
// Fuente: https://playwright.dev/docs/pom
//
// ¿Por qué POM?
// En lugar de repetir `page.fill('#user-name', ...)` en cada test,
// encapsulamos TODOS los selectores y acciones de esta página en una clase.
// Si SauceDemo cambia el id del campo, solo editamos aquí.

import { Page, Locator } from "@playwright/test";
// Page    → tipo de Playwright que representa una pestaña del navegador
// Locator → tipo que representa un elemento del DOM (con auto-wait incorporado)

export class LoginPage {
  // --- Propiedades: un Locator por cada elemento interactuable ---
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Guardamos la referencia a la página para usarla en los métodos

    // page.locator() → crea un Locator usando un selector CSS o atributo
    // Los data-test son los selectores más estables (no cambian con el estilo)
    this.usernameInput = page.locator("[data-test='username']");
    this.passwordInput = page.locator("[data-test='password']");
    this.loginButton   = page.locator("[data-test='login-button']");
    this.errorMessage  = page.locator("[data-test='error']");
    // data-test='error' → el contenedor de mensajes de error de SauceDemo
  }

  // --- Métodos: acciones que se pueden hacer en esta página ---

  async goto() {
    // Navega a la URL base definida en playwright.config.ts (saucedemo.com)
    await this.page.goto("/");
    // '/' → relativo a baseURL, equivale a https://www.saucedemo.com/
  }

  async login(username: string, password: string) {
    // fill() → limpia el campo y escribe el texto (equivale a clear + type)
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    // click() → hace clic en el botón; Playwright espera automáticamente
    // que el elemento sea visible y habilitado antes de hacer clic
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    // textContent() → devuelve el texto visible del elemento
    // ?? "" → si textContent retorna null, devolvemos string vacío
    return (await this.errorMessage.textContent()) ?? "";
  }
}
