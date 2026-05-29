// tests/login.spec.ts
// Tests de autenticación sobre SauceDemo
// Fuente de credenciales de prueba: https://www.saucedemo.com (visibles en la página)
//
// Cubrimos 4 escenarios:
//   ✅ Login exitoso con credenciales válidas
//   ❌ Login con contraseña incorrecta
//   ❌ Login con usuario bloqueado (locked_out_user)
//   ❌ Login con campos vacíos

import { test, expect } from "@playwright/test";
// test   → función para definir un caso de prueba
// expect → función para hacer aserciones (verificar resultados esperados)

import { LoginPage } from "../pages/LoginPage";
// Importamos el Page Object que encapsula todos los selectores del login

// Credenciales de SauceDemo (públicas, visibles en la propia página)
const VALID_USER     = "standard_user";
const VALID_PASSWORD = "secret_sauce";

// --- Grupo de tests relacionados con login ---
test.describe("Login", () => {
  // test.describe() → agrupa tests bajo un mismo nombre en el reporte HTML

  let loginPage: LoginPage;
  // Declaramos loginPage fuera del beforeEach para que sea accesible en todos los tests

  test.beforeEach(async ({ page }) => {
    // beforeEach → se ejecuta antes de CADA test del grupo
    // { page } → fixture de Playwright: una nueva pestaña limpia por cada test
    loginPage = new LoginPage(page);
    await loginPage.goto();
    // Navegamos a saucedemo.com antes de cada test para partir desde cero
  });

  // -----------------------------------------------
  // TEST 1: Login exitoso
  // -----------------------------------------------
  test("debería loguearse con credenciales válidas", async ({ page }) => {
    await loginPage.login(VALID_USER, VALID_PASSWORD);
    // Llamamos al método login() del Page Object (no repetimos los selectores aquí)

    // Verificamos que la URL cambió a /inventory.html (página de productos)
    await expect(page).toHaveURL(/inventory/);
    // toHaveURL() → aserción de Playwright que verifica la URL actual
    // /inventory/ → expresión regular: la URL debe contener "inventory"
  });

  // -----------------------------------------------
  // TEST 2: Contraseña incorrecta
  // -----------------------------------------------
  test("debería mostrar error con contraseña incorrecta", async () => {
    await loginPage.login(VALID_USER, "wrong_password");

    const error = await loginPage.getErrorMessage();
    // Obtenemos el texto del mensaje de error a través del Page Object

    expect(error).toContain("Username and password do not match");
    // toContain() → verifica que el string incluye el texto esperado
    // (más flexible que toEqual, que requiere coincidencia exacta)
  });

  // -----------------------------------------------
  // TEST 3: Usuario bloqueado
  // -----------------------------------------------
  test("debería mostrar error con usuario bloqueado", async () => {
    await loginPage.login("locked_out_user", VALID_PASSWORD);
    // locked_out_user → credencial especial de SauceDemo para simular usuario bloqueado

    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Sorry, this user has been locked out");
  });

  // -----------------------------------------------
  // TEST 4: Campos vacíos
  // -----------------------------------------------
  test("debería mostrar error con campos vacíos", async () => {
    await loginPage.login("", "");
    // Enviamos el formulario con strings vacíos

    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Username is required");
    // SauceDemo valida primero el campo username antes que el password
  });
});
