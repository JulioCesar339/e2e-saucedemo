// pages/InventoryPage.ts
// Page Object del inventario (lista de productos tras hacer login)
// Fuente del patrón: https://playwright.dev/docs/pom

import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly productList: Locator;
  readonly sortDropdown: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    // Selector del contenedor que agrupa todos los productos
    this.productList = page.locator(".inventory_list");

    // Dropdown de ordenamiento (A-Z, Z-A, precio, etc.)
    this.sortDropdown = page.locator("[data-test='product-sort-container']");

    // Ícono del carrito en la barra superior
    this.cartIcon = page.locator(".shopping_cart_link");

    // Badge numérico sobre el ícono del carrito (ej: "2" cuando hay 2 items)
    this.cartBadge = page.locator(".shopping_cart_badge");
  }

  async goto() {
    // La página de inventario solo es accesible tras login exitoso
    await this.page.goto("/inventory.html");
  }

  async getProductNames(): Promise<string[]> {
    // locator().all() → devuelve un array de todos los elementos que coinciden
    const items = await this.page.locator(".inventory_item_name").all();

    // Promise.all → resuelve todas las promesas en paralelo (más rápido)
    // map + textContent → extrae el texto de cada elemento
    return Promise.all(
      items.map(async (item) => (await item.textContent()) ?? "")
    );
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
    // selectOption() → selecciona una opción del <select> por su valor (value="az")
    // Los valores exactos los obtenemos inspeccionando el HTML de SauceDemo
    await this.sortDropdown.selectOption(option);
  }

  async addToCartByName(productName: string) {
    // Buscamos el botón "Add to cart" que está dentro del mismo contenedor
    // que tiene el nombre del producto que queremos agregar.
    // :has-text() → selector de Playwright que filtra por texto visible
    await this.page
      .locator(".inventory_item", { hasText: productName })
      // Dentro de ese contenedor, buscamos el botón Add to cart
      .locator("button")
      .click();
  }

  async getCartCount(): Promise<number> {
    // isVisible() → devuelve true/false sin lanzar error si el elemento no existe
    const isVisible = await this.cartBadge.isVisible();

    if (!isVisible) return 0;
    // Si no hay badge, el carrito está vacío → retornamos 0

    const text = (await this.cartBadge.textContent()) ?? "0";
    // parseInt(text, 10) → convierte el string "2" al número 2 (base 10)
    return parseInt(text, 10);
  }

  async goToCart() {
    await this.cartIcon.click();
    // Navega a /cart.html haciendo clic en el ícono del carrito
  }
}
