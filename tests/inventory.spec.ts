// tests/inventory.spec.ts
// Tests del inventario de productos (lista principal tras login)
//
// Cubrimos:
//   ✅ Productos visibles tras login
//   ✅ Ordenar A→Z y Z→A
//   ✅ Ordenar por precio (menor → mayor)
//   ✅ Agregar producto al carrito (badge actualiza)

import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

// Credenciales reutilizadas — en un proyecto real estarían en un .env
const VALID_USER     = "standard_user";
const VALID_PASSWORD = "secret_sauce";

test.describe("Inventario de productos", () => {

  // beforeEach realiza el login antes de cada test,
  // ya que el inventario solo es accesible tras autenticarse
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASSWORD);
    // Después del login, SauceDemo redirige automáticamente a /inventory.html
  });

  // -----------------------------------------------
  // TEST 1: Productos visibles
  // -----------------------------------------------
  test("debería mostrar la lista de productos", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const names = await inventoryPage.getProductNames();
    // getProductNames() → retorna un array con los nombres de todos los productos

    expect(names.length).toBeGreaterThan(0);
    // toBeGreaterThan(0) → verifica que hay al menos 1 producto en la lista

    expect(names).toContain("Sauce Labs Backpack");
    // Verificamos que un producto conocido de SauceDemo está en la lista
  });

  // -----------------------------------------------
  // TEST 2: Ordenar A→Z (por defecto) y Z→A
  // -----------------------------------------------
  test("debería ordenar productos de Z→A", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy("za");
    // sortBy("za") → selecciona "Name (Z to A)" en el dropdown

    const names = await inventoryPage.getProductNames();

    // [...names].sort().reverse() → crea una copia ordenada Z→A para comparar
    // No modificamos `names` directamente para no mutar el array original
    const sorted = [...names].sort().reverse();

    expect(names).toEqual(sorted);
    // toEqual() → verifica que los dos arrays tienen exactamente los mismos valores
    // en el mismo orden (deep equality)
  });

  // -----------------------------------------------
  // TEST 3: Ordenar por precio (menor → mayor)
  // -----------------------------------------------
  test("debería ordenar productos por precio de menor a mayor", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy("lohi");
    // "lohi" → valor del option "Price (low to high)" en el select de SauceDemo

    // Obtenemos todos los precios visibles en pantalla
    const priceLocators = await page.locator(".inventory_item_price").all();
    const prices = await Promise.all(
      priceLocators.map(async (el) => {
        const text = (await el.textContent()) ?? "0";
        // text será "$7.99", "$9.99", etc. — quitamos el símbolo "$" antes de parsear
        return parseFloat(text.replace("$", ""));
        // parseFloat() → convierte "7.99" al número 7.99
      })
    );

    // Verificamos que cada precio es menor o igual al siguiente
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
      // toBeLessThanOrEqual → aserción numérica de Playwright/Jest
    }
  });

  // -----------------------------------------------
  // TEST 4: Agregar producto al carrito
  // -----------------------------------------------
  test("debería actualizar el badge del carrito al agregar un producto", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Verificamos que el badge empieza en 0 (sin items)
    expect(await inventoryPage.getCartCount()).toBe(0);

    await inventoryPage.addToCartByName("Sauce Labs Backpack");
    // addToCartByName() → busca el botón "Add to cart" del producto por nombre

    // El badge debe mostrar "1" después de agregar un producto
    expect(await inventoryPage.getCartCount()).toBe(1);
  });
});
