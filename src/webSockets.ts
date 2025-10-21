/**
 * @fileoverview WebSocket маршруты для управления галактикой звёзд
 * @description Обрабатывает подключения клиентов, синхронизацию позиций звёзд и real-time коммуникацию
 */

import { Elysia, t } from 'elysia'
import { randomColorOKLCH } from './colors';

/**
 * Интерфейс для представления звезды в галактике
 * @interface Star
 */
export interface Star
{
    /** Уникальный идентификатор звезды (соответствует ID клиента) */
    id: string;
    /** Координата X звезды на плоскости */
    x: number;
    /** Координата Y звезды на плоскости */
    y: number;
    /** Цвет звезды в формате OKLCH */
    color: string;
}

/**
 * Канал по умолчанию для WebSocket сообщений
 * @constant {string}
 */
const DEFAULT_CHANNEL = 'test';

/**
 * Хранилище всех активных звёзд в галактике
 * @description Ключ - ID клиента, значение - объект звезды
 * @type {Record<string, Star>}
 */
const stars: Record<string, Star> = {};
console.log('⭐ Stars cleared')

/**
 * WebSocket маршрут для обработки подключений к галактике звёзд
 * @description Настраивает WebSocket endpoint с валидацией сообщений и обработчиками событий
 */
const webSocketsRoute = new Elysia()
.ws('/ws',
{
    /**
     * Схема валидации для входящих WebSocket сообщений
     * @description Все сообщения должны содержать канал и полезную нагрузку
     */
    body: t.Object(
    {
        /** Канал для маршрутизации сообщения */
        channel: t.String(),
        /** Полезная нагрузка сообщения (любой тип данных) */
        payload: t.Any(),
    }),

    /**
     * Обработчик открытия WebSocket соединения
     * @description Инициализирует нового клиента, назначает цвет, подписывает на канал
     * и синхронизирует состояние с существующими звёздами
     */
    open(ws)
    {
        const clientId = ws.id;
        const color = randomColorOKLCH();

        ws.subscribe(DEFAULT_CHANNEL);
        ws.send(
        {
            channel: DEFAULT_CHANNEL,
            payload:
            {
                id: 'connect',
                clientId, color
            }
        });

        Object.keys(stars).forEach((id) =>
        {
            const star = stars[id];
            ws.send(
            {
                channel: DEFAULT_CHANNEL,
                payload:
                {
                    ...star,
                    id: 'new',
                    clientId: star.id
                }
            });
        })

        ws.publish(DEFAULT_CHANNEL, 
        {
            channel: DEFAULT_CHANNEL,
            payload:
            {
                id: 'new',
                clientId, color
            }
        });

        stars[clientId] = { id: clientId, x: 0, y: 0, color };

        console.log('👽 Connected client:', clientId);
        console.log('⭐ Stars:', Object.keys(stars).length);
    },

    /**
     * Обработчик входящих WebSocket сообщений
     * @description Обрабатывает различные типы сообщений от клиентов
     */
    message(ws, message) 
    {
        const { channel, payload } = message;
        const { id, client } = payload;
        
        // Обработка обновления позиции звезды
        if (id === 'position')
        {
            const { x, y } = payload;
            stars[client].x = x;
            stars[client].y = y;

            // Рассылка обновления позиции всем подключенным клиентам
            ws.publish(DEFAULT_CHANNEL, 
            {
                channel: DEFAULT_CHANNEL,
                payload:
                {
                    id: 'position',
                    clientId: client, x, y
                }
            })

            console.log('🏓 Position updated:', { x, y });
            return;
        }
    },

    /**
     * Обработчик закрытия WebSocket соединения
     * @description Уведомляет других клиентов об отключении и очищает данные клиента
     */
    close(ws, code, reason) 
    {
        const clientId = ws.id;

        ws.publish(DEFAULT_CHANNEL, 
        {
            channel: DEFAULT_CHANNEL,
            payload:
            {
                id: 'disconnect',
                clientId
            }
        })

        ws.unsubscribe(DEFAULT_CHANNEL);
        delete stars[clientId];

        console.log('💀 Disconnected client:', clientId);
        console.log('⭐ Stars:', Object.keys(stars).length);
    },
})

/**
 * Экспорт настроенного WebSocket маршрута
 * @description Готовый к использованию Elysia плагин с WebSocket функциональностью
 * для управления галактикой звёзд
 */
export default webSocketsRoute;