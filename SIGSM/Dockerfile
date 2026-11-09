# Usar la imagen base de PHP con Apache
FROM php:8.2-apache

# Instalar extensiones necesarias (por ejemplo, mysqli)
RUN docker-php-ext-install pdo_mysql

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

# Copiar todo el contenido desde el contexto del Dockerfile al directorio de trabajo en el contenedor
COPY . .

# Configurar Apache para que use el archivo .htaccess
RUN a2enmod rewrite

# Crear la estructura de subidas dentro de API y asignar permisos permanentes
RUN mkdir -p /var/www/html/API/uploads/pdf/2026 && chown -R www-data:www-data /var/www/html/API/uploads && chmod -R 777 /var/www/html/API/uploads

# Asignar propietario al proyecto
RUN chown -R www-data:www-data /var/www/html 