# Используем официальный образ Bun
FROM oven/bun:1 as base

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы зависимостей
COPY package.json bun.lock* ./

# Устанавливаем зависимости
RUN bun install --frozen-lockfile

# Копируем исходный код
COPY . .

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 bunjs

# Меняем владельца файлов
RUN chown -R bunjs:bunjs /usr/src/app
USER bunjs

# Открываем порт
EXPOSE 3000

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Запускаем приложение
CMD ["bun", "run", "src/index.ts"]