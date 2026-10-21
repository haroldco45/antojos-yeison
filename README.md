# Antojos de Yeison

App (PWA) para tomar pedidos de postres de fresa. Hecha por Vibras Positivas HM.

Publicada en: https://haroldco45.github.io/antojos-yeison/

## Cómo funciona

1. **El cliente** escoge productos y adiciones, llena sus datos y toca **Enviar pedido por WhatsApp**.
   El pedido llega al WhatsApp del negocio (+57 312 609 8148). Al final del mensaje va un enlace con el pedido adentro.
2. **Yeison** toca ese enlace en su celular. La app abre y el pedido queda guardado en su **Registro**
   (la primera vez pide la clave del negocio). Si toca el mismo enlace dos veces, no se duplica.
3. En el Registro ve los pedidos de hoy, los pendientes y lo vendido, y los pasa de
   Nuevo → Preparando → Entregado (o Cancelado).

No usa base de datos ni hoja de Google: el registro vive en el celular de Yeison.
Por eso tiene **Descargar copia** y **Restaurar copia** en el Registro; conviene sacar una copia cada semana.

## Configuración

Todo está en `config.js`: el WhatsApp de pedidos, la clave del negocio y la dirección de la app.
La clave solo evita que un cliente entre por curiosidad al modo negocio; los pedidos guardados
están en el celular de Yeison, no en internet.
