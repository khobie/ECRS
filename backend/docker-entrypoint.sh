#!/bin/sh
set -e

cd /var/www/html

# Render sets RENDER_EXTERNAL_URL automatically
if [ -n "$RENDER_EXTERNAL_URL" ] && [ -z "$APP_URL" ]; then
  export APP_URL="$RENDER_EXTERNAL_URL"
fi

mkdir -p database storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
touch database/database.sqlite
chmod -R 775 storage bootstrap/cache database

php artisan package:discover --ansi
php artisan migrate --force
php artisan db:seed --force || true
php artisan config:cache

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
