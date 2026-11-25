# tan-yo v0.3.1

Aplicación web estática. Ejecutar `python3 -m http.server 8000` y visitar localhost:8000. En Vercel usar HTTPS, framework Other, sin compilación. Permitir cámara y encuadrar la impresión completa. La aplicación compara patrones de la imagen impresa, no utiliza un modelo de identificación de personas.

El motor compara puntos locales, parches normalizados y consistencia geométrica con 21 referencias (7 impresiones, 3 orientaciones). Se necesitan dos coincidencias consecutivas en cámara. Se mantienen los marcadores de prueba anteriores. Las imágenes originales no se distribuyen en este ZIP, excepto el logo; references.json contiene descriptores visuales derivados, accesibles al cliente, no es almacenamiento privado ni anonimización garantizada.

Al actualizar una copia anterior, eliminar los siete JPEG del directorio img (conservar logo.jpeg); si estaban en Git, usar git rm. El historial anterior puede conservarlos. Si hay despliegues previos públicos, también pueden seguir accesibles. Para contenidos sensibles revisar permisos y despliegues anteriores.

Pruebas locales del algoritmo: 7/7 originales, 7/7 con escala .65, brillo .8 y desenfoque .6; 6/7 con esos cambios y rotación 8 grados. Xiomy rotada fue rechazada. No se han validado cámaras reales, rendimiento móvil ni despliegue. No hay dependencia externa.

## Audio
Conservar la carpeta son del proyecto local. Archivos: gordo.ogg, necho.ogg, juan.ogg, ceci.ogg, xiomy.ogg, ado.ogg, tati.ogg. Opcionalmente agregar MP3 con el mismo nombre para navegadores incompatibles. Los audios reales no se incluyen en este ZIP. La reproducción automática se intenta al reconocer una imagen; si el navegador la bloquea, usar los controles.

## Audios alternativos
Se detectan automáticamente archivos base y sufijos -1 a -9 (OGG o MP3), mediante solicitudes HEAD. Si hay varios sin escuchar, se ofrecen opciones. Si queda exactamente uno pendiente, se intenta reproducir automáticamente. Se marca escuchado únicamente al terminar; el historial queda en localStorage del navegador. Si todos fueron escuchados, se ofrecen nuevamente. No se reproducen archivos seguidos sin decisión del visitante. Conservar son/ local.


## Novedades v0.3.2

- Soporte para videos MP4/WebM además de audios OGG/MP3/WAV/M4A.
- Detección automática por nombre base del archivo en `son/`.
- Ejemplo: `baile.mp4`, `baile-1.mp4`, `necho.ogg`, `necho-1.ogg`.
- Si una imagen tiene un solo contenido, se abre automáticamente. Si tiene varios, la app pregunta cuál reproducir.
- Incluye un video de prueba: `son/baile.mp4`.

**Importante:** la lógica de contenido para `baile` está lista, pero su reconocimiento por cámara dependerá de que la imagen `baile` exista también dentro de tus referencias visuales. En esta versión no pude agregar esa referencia porque la imagen `baile` no fue adjuntada aquí.

## v0.3.3
Dos referencias visuales de baile incorporadas. Se corrige la cancelación accidental de la búsqueda multimedia y se conserva el historial anterior. No se reconoce por nombre de archivo.

## v0.3.4
Añadida referencia visual moda. Busca son/moda.ogg, son/moda.mp4 y variantes numeradas.

## v0.3.5
Baile incluye el Short de YouTube mQuUApUJyvk, que sustituye a baile.mp4. Los audios baile.ogg, baile-1.ogg y demás sufijos siguen disponibles, así como videos locales numerados. El video externo puede requerir pulsar reproducir o abrir YouTube; se marca como visto manualmente.

## v0.3.6

- Nueva referencia visual Comida, con variantes de orientación. Busca `son/comida.ogg`, `son/comida-1.ogg`, `son/comida.mp4` y otras variantes compatibles.
- Se conservan las referencias y contenidos anteriores.
