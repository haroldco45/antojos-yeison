# Antojos de Yeison

App (PWA) para tomar pedidos de postres de fresa. Hecha por Vibras Positivas HM.

- **Cliente:** escoge productos y adiciones, llena sus datos y toca **Enviar pedido por WhatsApp**. Con ese único toque el pedido se abre en el WhatsApp del negocio (+57 312 609 8148) y queda grabado en la hoja de Google de Yeison.
- **Negocio:** "Acceso del negocio" (abajo en el menú, o el enlace `…/antojos-yeison/#negocio`) pide la clave y muestra el registro: pedidos de hoy, pendientes, vendido y estados Nuevo → Preparando → Entregado / Cancelado.

Publicada en: https://haroldco45.github.io/antojos-yeison/

## Conectar la hoja de Google (una sola vez)

1. Con la cuenta de Google de Yeison, crea una hoja nueva en Google Sheets, por ejemplo "Pedidos Antojos".
2. En la hoja: **Extensiones → Apps Script**. Borra lo que haya y pega el contenido de `apps-script/Code.gs`.
3. Cambia la clave en la línea `const CLAVE = "1234";` y guarda.
4. **Implementar → Nueva implementación →** tipo **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. Autoriza los permisos y copia la **URL de la aplicación web** (termina en `/exec`).
6. Pega esa URL en `config.js`, en `API: ""`, y súbelo al repositorio.

Listo: desde ese momento cada pedido queda en la pestaña **Pedidos** de la hoja.

Mientras `API` esté vacía, la app funciona en **modo demo** y guarda solo en el celular donde se abre.

> Si después cambias `Code.gs`, usa **Implementar → Administrar implementaciones → Editar → Versión nueva** para que la URL siga siendo la misma.
