# tan-yo 0.1.0
Web estática sin dependencias ni base de datos. Cinco marcadores geométricos provisionales (no son QR). Reconocimiento local experimental.

## Probar
Ejecutar `python3 -m http.server 8000` en esta carpeta y abrir http://localhost:8000. En teléfonos usar HTTPS (Vercel). Imprimir los símbolos desde la aplicación, conservar el borde blanco y usar unos 5 cm. Buena luz y vista frontal. También se puede cargar una foto o abrir la experiencia con Probar. El audio requiere pulsar reproducir.

## Publicar
Crear repositorio vacío tan-yo en GitHub y subir los archivos de esta carpeta a su raíz. Importar en Vercel, Framework Preset Other, sin comando de build ni directorio de salida personalizado. No requiere variables de entorno.

## Editar
content.js contiene los contenidos. Tipos: audio, video (añadir src), animation, question, reveal, link. markers.js contiene los patrones. No incluye administrador persistente ni reconocimiento de ilustraciones libres. El detector experimental requiere pruebas físicas y no está diseñado para inclinaciones extremas o sombras fuertes. El audio y enlace son provisionales.

## v0.2.0
Primer grupo de imágenes en `img/`, logo y nombres en `photos.js`. El escáner experimental compara la apariencia completa de la fotografía impresa (no identifica personas ni usa modelos biométricos). Enfocar de frente, con la imagen centrada, visible completa y con los mismos márgenes que el archivo original. La comparación es sensible a perspectiva, recortes, rotación y reflejos; puede rechazar imágenes o confundirlas. Los botones Probar permiten verificar las experiencias sin cámara. Los marcadores anteriores se conservan. Las fotos están incluidas en el sitio estático: obtener autorización antes de publicar, incluso con repositorio privado si el sitio es público. No subir imágenes de visitantes; el procesamiento es local.
