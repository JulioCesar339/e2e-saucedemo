// pages/CheckoutPage.ts
// Page Object del flujo de checkout (2 pasos: datos de envío → confirmación)

import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;

  // --- Step 1: Formulario de datos de envío ---
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // --- Step 2: Resumen del pedido ---
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly totalPrice: Locator;

  // --- Confirmación ---
  readonly confirmationHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1 — campos del formulario de envío
    this.firstNameInput  = page.locator("[data-test='firstName']");
    this.lastNameInput   = page.locator("[data-test='lastName']");
    this.postalCodeInput = page.locator("[data-test='postalCode']");
    this.continueButton  = page.locator("[data-test='continue']");
    this.errorMessage    = page.locator("[data-test='error']");

    // Step 2 — resumen de precios
    this.finishButton = page.locator("[data-test='finish']");
    this.itemTotal    = page.locator(".summary_subtotal_label");
    // .summary_subtotal_label → muestra "Item total: $X.XX"
    this.tax          = page.locator(".summary_tax_label");
    this.totalPrice   = page.locator(".summary_total_label");

    // Página de confirmación
    this.confirmationHeader = page.locator(".complete-header");
    // .complete-header → muestra "Thank you for your order!"
  }

  async fillShippingInfo(firstName: string, lastName: string, postalCode: string) {
    // Llenamos los 3 campos del formulario de envío
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
    // Al hacer clic en Continue avanzamos al Step 2 (resumen)
  }

  async getTotalPrice(): Promise<string> {
    // textContent() devuelve "Total: $X.XX" — lo retornamos tal cual para
    // que el test haga la aserción exacta sobre el formato esperado
    return (await this.totalPrice.textContent()) ?? "";
  }

  async finish() {
    await this.finishButton.click();
    // Navega a /checkout-complete.html con el mensaje de confirmación
  }

  async getConfirmationText(): Promise<string> {
    return (await this.confirmationHeader.textContent()) ?? "";
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? "";
  }
}
