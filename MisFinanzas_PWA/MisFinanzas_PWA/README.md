# Mis Finanzas — versión web instalable (PWA)

Esta es una adaptación web inicial inspirada en el proyecto SwiftUI `MisFinanzas_iOS.zip`. No es una conversión automática del código Swift: reconstruye las funciones principales en HTML, CSS y JavaScript para poder usarla desde Windows y Safari en iPhone.

## Funciones incluidas
- Resumen de ingresos, gastos, balance mensual y deuda pendiente.
- Crear, editar y borrar gastos e ingresos.
- Pagos fijos con estado pagado/pendiente por mes.
- Deudas con registro de abonos.
- Metas de ahorro con aportes.
- Guardado local en el navegador (`localStorage`).
- Exportar/importar copia de seguridad JSON.
- Manifest y service worker para instalación y uso sin conexión después de la primera carga.

## Cómo probar en Windows
La PWA necesita servirse por `localhost` o HTTPS; no abras simplemente `index.html` con doble clic para probar la instalación.

1. Descomprime la carpeta.
2. Instala Visual Studio Code y la extensión **Live Server**, o instala Node.js y usa un servidor local.
3. En VS Code, abre la carpeta `MisFinanzas_PWA`, haz clic derecho en `index.html` y elige **Open with Live Server**.
4. Para probar en tu PC, abre la URL local que muestre Live Server.

## Cómo abrirla en iPhone
El iPhone necesita que la app esté publicada en una URL HTTPS accesible. Una vez desplegada:
1. Abre la URL en Safari en el iPhone.
2. Pulsa Compartir.
3. Selecciona **Añadir a pantalla de inicio** y confirma.

## Publicar gratis con GitHub Pages
1. Crea/inicia sesión en GitHub y crea un repositorio nuevo.
2. Sube los archivos de esta carpeta al repositorio (no la carpeta ZIP dentro del repositorio; sube los archivos directamente).
3. En el repositorio abre **Settings → Pages**.
4. En “Build and deployment”, selecciona “Deploy from a branch”, la rama `main` y carpeta `/ (root)`, y guarda.
5. Espera a que GitHub Pages publique la web y abre la URL HTTPS generada en Safari en tu iPhone.

## Importante sobre los datos
Los datos se guardan en el navegador del dispositivo, no se sincronizan automáticamente entre Windows y iPhone y pueden perderse si se borra el almacenamiento del navegador. Usa **Exportar copia** con frecuencia y guarda el JSON en un lugar seguro. No introduzcas claves bancarias ni datos de acceso. Esta versión inicial no tiene autenticación ni servidor.
