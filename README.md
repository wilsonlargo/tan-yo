# tan-yo v0.2.2

Aplicación web estática. Ejecutar `python3 -m http.server 8000` y visitar localhost:8000. En Vercel usar HTTPS, framework Other, sin compilación. Permitir cámara y encuadrar la impresión completa. La aplicación compara patrones de la imagen impresa, no utiliza un modelo de identificación de personas.

El motor compara puntos locales, parches normalizados y consistencia geométrica con 21 referencias (7 impresiones, 3 orientaciones). Se necesitan dos coincidencias consecutivas en cámara. Se mantienen los marcadores de prueba anteriores. Las imágenes originales no se distribuyen en este ZIP, excepto el logo; references.json contiene descriptores visuales derivados, accesibles al cliente, no es almacenamiento privado ni anonimización garantizada.

Al actualizar una copia anterior, eliminar los siete JPEG del directorio img (conservar logo.jpeg); si estaban en Git, usar git rm. El historial anterior puede conservarlos. Si hay despliegues previos públicos, también pueden seguir accesibles. Para contenidos sensibles revisar permisos y despliegues anteriores.

Pruebas locales del algoritmo: 7/7 originales, 7/7 con escala .65, brillo .8 y desenfoque .6; 6/7 con esos cambios y rotación 8 grados. Xiomy rotada fue rechazada. No se han validado cámaras reales, rendimiento móvil ni despliegue. No hay dependencia externa.
