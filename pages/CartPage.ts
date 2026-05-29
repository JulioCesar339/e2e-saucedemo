// pages/CartPage.ts
// Page Object del carrito de compras (/cart.html)

import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    // Contenedor de cada producto en el carrito
    this.cartItems = page.locator(".cart_item");

    // Botón que lleva al formulario de envío
    this.checkoutButton = page.locator("[data-test='checkout']");

    // Todos los botones "Remove" (uno por producto)
    this.removeButtons = page.locator("[data-test^='remove']");
    // data-test^='remove' → atributo que EMPIEZA con 'remove' (remove-sauce-labs-backpack, etc.)
  }

  async getItemCount(): Promise<number> {
    // count() → devuelve cuántos elementos coinciden con el locator
    return await this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    const items = await this.page.locator(".inventory_item_name").all();
    return Promise.all(
      items.map(async (item) => (await item.textContent()) ?? "")
    );
  }

  async goToCheckout() {
    await this.checkoutButton.click();
    // Navega a /checkout-step-one.html
  }
}
