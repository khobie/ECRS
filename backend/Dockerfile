FROM php:8.2-cli-bookworm

# zip + mbstring only; PDO SQLite is already enabled in the official PHP image
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libzip-dev libonig-dev \
    && docker-php-ext-install zip mbstring \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

COPY . .

RUN composer dump-autoload --optimize \
    && chmod +x docker-entrypoint.sh \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
