// tests/checkout.spec.ts
// Tests del flujo completo de compra: login → add to cart → checkout → confirm
//
// Cubrimos:
//   ✅ Flujo completo de compra (happy path)
//   ✅ Precio total correcto (subtotal + tax)
//   ❌ Checkout sin rellenar datos de envío

import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

const VALID_USER     = "standard_user";
const VALID_PASSWORD = "secret_sauce";

// Fixture de login reutilizable para todos los tests del grupo
// En lugar de repetir el código de login en cada test, lo centralizamos en beforeEach
test.describe("Checkout", () => {

  // Declaramos las páginas en el scope del describe para usarlas en todos los tests
  let inventoryPage : InventoryPage;
  let cartPage      : CartPage;
  let checkoutPage  : CheckoutPage;

  test.beforeEach(async ({ page }) => {
    // 1. Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASSWORD);

    // 2. Instanciamos las demás páginas después del login
    inventoryPage = new InventoryPage(page);
    cartPage      = new CartPage(page);
    checkoutPage  = new CheckoutPage(page);

    // 3. Agregamos un producto para tener algo en el carrito
    await inventoryPage.addToCartByName("Sauce Labs Backpack");
    // Precio conocido del Backpack en SauceDemo: $29.99
  });

  // -----------------------------------------------
  // TEST 1: Flujo completo de compra (happy path)
  // -----------------------------------------------
  test("debería completar el flujo de compra exitosamente", async () => {
    // Paso 1: Ir al carrito
    await inventoryPage.goToCart();

    // Paso 2: Verificar que el carrito tiene 1 item
    expect(await cartPage.getItemCount()).toBe(1);

    // Paso 3: Iniciar checkout
    await cartPage.goToCheckout();
    // goToCheckout() hace clic en el botón "Checkout" → /checkout-step-one.html

    // Paso 4: Rellenar datos de envío
    await checkoutPage.fillShippingInfo("Julio", "Cabrera", "06600");
    // fillShippingInfo() → rellena first name, last name, postal code y hace clic en Continue

    // Paso 5: Confirmar el pedido
    await checkoutPage.finish();
    // finish() hace clic en "Finish" → /checkout-complete.html

    // Paso 6: Verificar mensaje de confirmación
    const confirmation = await checkoutPage.getConfirmationText();
    expect(confirmation).toContain("Thank you for your order");
    // SauceDemo muestra "Thank you for your order!" en la página de confirmación
  });

  // -----------------------------------------------
  // TEST 2: Verificar precio total
  // -----------------------------------------------
  test("debería mostrar el precio total correcto", async () => {
    await inventoryPage.goToCart();
    await cartPage.goToCheckout();
    await checkoutPage.fillShippingInfo("Julio", "Cabrera", "06600");

    // En el Step 2 (resumen) verificamos el precio
    const total = await checkoutPage.getTotalPrice();
    // SauceDemo calcula: subtotal $29.99 + tax $2.40 = $32.39
    expect(total).toContain("32.39");
    // toContain() → buscamos el número dentro del string "Total: $32.39"
  });

  // -----------------------------------------------
  // TEST 3: Error al no rellenar datos de envío
  // -----------------------------------------------
  test("debería mostrar error si se omiten los datos de envío", async () => {
    await inventoryPage.goToCart();
    await cartPage.goToCheckout();

    // Intentamos continuar sin llenar ningún campo
    await checkoutPage.fillShippingInfo("", "", "");
    // Pasamos strings vacíos → el formulario debería validar y mostrar error

    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain("First Name is required");
    // SauceDemo valida primero el campo First Name
  });
});
