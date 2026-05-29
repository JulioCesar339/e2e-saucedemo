# E2E Automation Portfolio — SauceDemo

Suite de automatización E2E sobre [saucedemo.com](https://www.saucedemo.com),
un e-commerce público diseñado específicamente para practicar QA.

---

## 🧠 ¿Por qué cada tecnología?

| Tecnología | Motivo |
|---|---|
| **Playwright + TypeScript** | Estándar moderno para E2E: soporta múltiples navegadores, tiene auto-wait nativo (evita `sleep` frágiles) y TypeScript agrega tipado estático que previene errores en selectores y métodos |
| **Page Object Model (POM)** | Separa la lógica de los tests de la estructura del DOM. Si cambia un selector, solo se edita en un lugar y todos los tests se adaptan automáticamente |
| **pnpm** | Gestor de paquetes ~2x más rápido que npm. Usa hard links en un store global — cada paquete se descarga una sola vez y se reutiliza entre proyectos, ahorrando tiempo y espacio en disco |
| **k6** | Herramienta de performance testing en JavaScript. Simula múltiples usuarios simultáneos para medir tiempos de respuesta y detectar cuellos de botella bajo carga |
| **GitHub Actions** | CI/CD gratuito integrado en GitHub. Ejecuta los tests automáticamente en cada push y publica el reporte en GitHub Pages |

---

## 📊 Métricas del proyecto

| Métrica | Valor |
|---|---|
| Tests E2E | 11 |
| Tiempo de ejecución | ~37s |
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
├── .gitignore
└── .github/workflows/
    └── playwright.yml      ← Pipeline CI/CD
```

---

## 🚀 Cómo correr el proyecto

```bash
# 1. Clonar
git clone https://github.com/JulioCesar339/e2e-saucedemo.git
cd e2e-saucedemo

# 2. Instalar dependencias
pnpm install

# 3. Instalar navegador
pnpm exec playwright install chromium

# 4. Correr tests
pnpm exec playwright test

# 5. Ver reporte
pnpm exec playwright show-report

# 6. Correr test de carga
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
- ✅ Ordenar productos Z→A
- ✅ Ordenar por precio (menor → mayor)
- ✅ Agregar producto al carrito

### Checkout
- ✅ Flujo completo de compra (add → cart → checkout → confirm)
- ✅ Verificar precio total correcto
- ❌ Checkout sin datos de envío

---

Desarrollado por **Julio César Cabrera Hernández**
