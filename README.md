# tan-yo v0.3.1

Aplicación web estática. Ejecutar `python3 -m http.server 8000` y visitar localhost:8000. En Vercel usar HTTPS, framework Other, sin compilación. Permitir cámara y encuadrar la impresión completa. La aplicación compara patrones de la imagen impresa, no utiliza un modelo de identificación de personas.

El motor compara puntos locales, parches normalizados y consistencia geométrica con 21 referencias (7 impresiones, 3 orientaciones). Se necesitan dos coincidencias consecutivas en cámara. Se mantienen los marcadores de prueba anteriores. Las imágenes originales no se distribuyen en este ZIP, excepto el logo; references.json contiene descriptores visuales derivados, accesibles al cliente, no es almacenamiento privado ni anonimización garantizada.

Al actualizar una copia anterior, eliminar los siete JPEG del directorio img (conservar logo.jpeg); si estaban en Git, usar git rm. El historial anterior puede conservarlos. Si hay despliegues previos públicos, también pueden seguir accesibles. Para contenidos sensibles revisar permisos y despliegues anteriores.

Pruebas locales del algoritmo: 7/7 originales, 7/7 con escala .65, brillo .8 y desenfoque .6; 6/7 con esos cambios y rotación 8 grados. Xiomy rotada fue rechazada. No se han validado cámaras reales, rendimiento móvil ni despliegue. No hay dependencia externa.

## Audio
Conservar la carpeta son del proyecto local. Archivos: gordo.ogg, necho.ogg, juan.ogg, ceci.ogg, xiomy.ogg, ado.ogg, tati.ogg. Opcionalmente agregar MP3 con el mismo nombre para navegadores incompatibles. Los audios reales no se incluyen en este ZIP. La reproducción automática se intenta al reconocer una imagen; si el navegador la bloquea, usar los controles.

## Audios alternativos
Se detectan automáticamente archivos base y sufijos -1 a -9 (OGG o MP3), mediante solicitudes HEAD. Si hay varios sin escuchar, se ofrecen opciones. Si queda exactamente uno pendiente, se intenta reproducir automáticamente. Se marca escuchado únicamente al terminar; el historial queda en localStorage del navegador. Si todos fueron escuchados, se ofrecen nuevamente. No se reproducen archivos seguidos sin decisión del visitante. Conservar son/ local.
