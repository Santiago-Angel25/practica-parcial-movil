# E-Commerce: gestión de órdenes de compra

Aplicación móvil híbrida creada con Ionic y Angular para consultar, filtrar y facturar órdenes de compra.

## 🚀 Requisitos previos

- **Node.js** compatible con Angular 22: versión **22.22.3 o superior de la serie 22**, **24.15.0 o superior de la serie 24**, o **26.x**.
- **npm**, incluido con Node.js.
- El proyecto usa Angular **22.2.3**, Ionic Angular **9** y TypeScript **6.0.x**. Las versiones exactas están registradas en `package-lock.json`.

Consulta la [tabla oficial de compatibilidad de Angular](https://angular.dev/reference/versions) si necesitas verificar tu versión de Node.js.

---

## 🛠️ Instalación y ejecución

1. **Instalar las dependencias**

   Abre el proyecto en Visual Studio Code y selecciona **Terminal > New Terminal**. Asegúrate de que la terminal esté en la carpeta que contiene `package.json` y ejecuta:

   ```powershell
   npm ci
   ```

2. **Iniciar el servidor de desarrollo**

   En esa misma terminal, ejecuta:

   ```powershell
   npm start -- --port 8100
   ```

   La aplicación estará disponible en [http://localhost:8100](http://localhost:8100). Para revisar la vista móvil, abre las herramientas del navegador con **F12** y activa la emulación de dispositivo.

3. **Abrir la aplicación**

   Mantén abierta la terminal mientras usas la aplicación y entra a [http://localhost:8100](http://localhost:8100) desde el navegador.

---

## 🧱 Compilación y pruebas

- **Compilar para producción:**

  ```powershell
  npm run build
  ```

- **Ejecutar las pruebas configuradas:**

  ```powershell
  npm test
  ```

---

## 📱 Funcionalidades implementadas

1. **Dashboard adaptable:** encabezado Ionic, tarjetas de resumen y distribución con `ion-grid`.
2. **Consulta HTTP:** `ApiService` obtiene publicaciones desde `https://jsonplaceholder.typicode.com/posts` y las adapta al modelo `Order`.
3. **Datos de prueba:** monto y stock se generan localmente porque el endpoint de publicaciones no entrega datos de órdenes ni inventario.
4. **Filtro por monto en tiempo real:** campos numéricos para monto mínimo y máximo; al iniciar, los campos vacíos muestran todas las órdenes.
5. **Lista de órdenes:** muestra título, monto, avatar con ícono de carrito e indicador de stock. El badge es rojo cuando el stock es menor que 5.
6. **Factura en modal:** presenta subtotal, IVA del 19 % y total. Al confirmar, descuenta una unidad y muestra un `ToastController` durante 2,5 segundos; si el stock está agotado, muestra un `AlertController`.

---

## 🏛️ Estructura del proyecto

```text
practica/
├── angular.json
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── main.ts
    ├── global.scss
    ├── service/
    │   └── api.service.ts
    └── app/
        ├── app.component.html
        ├── app.component.ts
        ├── app.routes.ts
        └── home/
            ├── home.page.html
            ├── home.page.scss
            └── home.page.ts
```
