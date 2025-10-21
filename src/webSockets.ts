import { Elysia, t } from 'elysia'
import { randomColorOKLCH } from './colors';

export interface Star
{
    id: string;
    x: number;
    y: number;
    color: string;
}

const DEFAULT_CHANNEL = 'test';
const stars: Record<string, Star> = {};
console.log('⭐ Stars cleared')

const webSocketsRoute = new Elysia()
.ws('/ws',
{
    body: t.Object(
    {
        channel: t.String(),
        payload: t.Any(),
    }),

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

    message(ws, message) 
    {
        const { channel, payload } = message;
        const { id, client } = payload;
        
        if (id === 'position')
        {
            const { x, y } = payload;
            stars[client].x = x;
            stars[client].y = y;

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

export default webSocketsRoute;