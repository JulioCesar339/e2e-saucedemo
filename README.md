# E2E Automation Portfolio — SauceDemo

Suite de automatización E2E sobre [saucedemo.com](https://www.saucedemo.com),
un e-commerce público diseñado específicamente para practicar QA.

---

## 🧠 ¿Por qué cada tecnología?

| Tecnología | Motivo |
|---|---|
| **Playwright + TypeScript** | Playwright es el estándar moderno para E2E: soporta múltiples navegadores, tiene auto-wait nativo (evita `sleep` frágiles) y TypeScript agrega tipado estático que previene errores en los selectores y métodos |
| **Page Object Model (POM)** | Separa la lógica de los tests de la estructura del DOM. Si cambia un selector, solo se edita en un lugar (la Page) y todos los tests se adaptan automáticamente |
| **k6** | Herramienta de performance testing en JavaScript. Simula múltiples usuarios simultáneos para medir tiempos de respuesta y detectar cuellos de botella bajo carga |
| **GitHub Actions** | CI/CD gratuito integrado en GitHub. Ejecuta los tests automáticamente en cada push y publica el reporte en GitHub Pages |

---

## 📊 Métricas del proyecto

| Métrica | Valor |
|---|---|
| Tests E2E | 18 |
| Tiempo de ejecución | < 10 segundos |
| Páginas cubiertas | Login, Inventory, Cart, Checkout |
| Tasa de error bajo carga | 0% con 50 usuarios simultáneos |
| Pipeline CI/CD | Automático en cada push |

---

## 🗂️ Estructura

```
e2e-saucedemo/
├── pages/                  ← Page Objects (una clase por página)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── login.spec.ts       ← Tests de autenticación
│   ├── inventory.spec.ts   ← Tests de productos
│   ├── checkout.spec.ts    ← Tests de flujo de compra
│   └── k6/
│       └── load-test.js    ← Test de carga
├── playwright.config.ts    ← Configuración global de Playwright
├── global-setup.ts         ← Setup previo a los tests
└── .github/workflows/
    └── playwright.yml      ← Pipeline CI/CD
```

---

## 🚀 Cómo correr el proyecto

```bash
# 1. Clonar
git clone https://github.com/TU_USUARIO/e2e-saucedemo.git
cd e2e-saucedemo

# 2. Instalar dependencias
npm install
npx playwright install chromium

# 3. Correr tests
npx playwright test

# 4. Ver reporte
npx playwright show-report

# 5. Correr test de carga
k6 run tests/k6/load-test.js
```

---

## 🧪 Casos de prueba

### Login
- ✅ Login con credenciales válidas
- ❌ Login con contraseña incorrecta
- ❌ Login con usuario bloqueado
- ❌ Login con campos vacíos

### Inventario
- ✅ Lista de productos visible tras login
- ✅ Ordenar productos A→Z y Z→A
- ✅ Ordenar por precio (menor → mayor)
- ✅ Agregar producto al carrito

### Checkout
- ✅ Flujo completo de compra (add → cart → checkout → confirm)
- ❌ Checkout sin datos de envío
- ✅ Verificar precio total
