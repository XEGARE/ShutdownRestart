import { exec } from 'node:child_process'
import util from "node:util";

import Fastify from 'fastify'
const fastify = Fastify();

import config from './ShutdownRestart.json' with { type: "json" }

const execPromise = util.promisify(exec);

fastify.get('/shutdown/', async (request, reply) => {
    if(request.query.key != config.app.key)
    {
        return { status: 'fail', value: 'Доступ запрещен' };
    }
    else
    {
        let time = request.query.time;
        if(time)
        {
            if(process.platform === "win32")
            {
                if(time >= 0 && time <= 315360000)
                {
                    try
                    {
                        await execPromise(`shutdown /s /t ${time} /f`);
                        return { status: 'ok', value: `Компьютер выключится через ${declOfNum(time, ['секунду', 'секунды', 'секунд'])}` };
                    }
                    catch (error)
                    {
                        if(error.message.includes('(1190)'))
                        {
                            return { status: 'fail', value: 'Перезагрузка или выключение уже активировано' };
                        }
                        return { status: 'fail', value: 'Неизвестная ошибка' };
                    }
                }
                else
                {
                    return { status: 'fail', value: 'Некорректное время. Допустимый диапазон: 0-315360000 (10 лет)' };
                }
            }
            else
            {
                exec(`shutdown ${time}`);
                return { status: 'ok', value: `Компьютер выключится через ${declOfNum(time, ['секунду', 'секунды', 'секунд'])}` };
            }
        }
        else
        {
            return { status: 'fail', value: 'Время не передано' };
        }
    }
});

fastify.get('/restart/', async (request, reply) => {
    if(request.query.key != config.app.key)
    {
        return { status: 'fail', value: 'Доступ запрещен' };
    }
    else
    {
        let time = request.query.time;
        if(time)
        {
            if(process.platform === "win32")
            {
                if(time >= 0 && time <= 315360000)
                {
                    try
                    {
                        await execPromise(`shutdown /r /t ${time} /f`);
                        return { status: 'ok', value: `Компьютер перезагрузится через ${declOfNum(time, ['секунду', 'секунды', 'секунд'])}` };
                    }
                    catch (error)
                    {
                        if(error.message.includes('(1190)'))
                        {
                            return { status: 'fail', value: 'Перезагрузка или выключение уже активировано' };
                        }
                        return { status: 'fail', value: 'Неизвестная ошибка' };
                    }
                }
                else
                {
                    return { status: 'fail', value: 'Некорректное время. Допустимый диапазон: 0-315360000 (10 лет)' };
                }
            }
            else
            {
                exec(`shutdown -r ${time}`);
                return { status: 'ok', value: `Компьютер перезагрузится через ${declOfNum(time, ['секунду', 'секунды', 'секунд'])}` };
            }
        }
        else
        {
            return { status: 'fail', value: 'Время не передано' };
        }
    }
});

fastify.get('/cancel/', async (request, reply) => {
    if(request.query.key != config.app.key)
    {
        return { status: 'fail', value: 'Доступ запрещен' };
    }
    else
    {
        if(process.platform === "win32")
        {
            try
            {
                await execPromise('shutdown /a');
                return { status: 'ok', value: 'Действие отменено' };
            }
            catch (error)
            {
                if(error.message.includes('(1116)'))
                {
                    return { status: 'fail', value: 'Перезагрузка или выключение не активировано' };
                }
                return { status: 'fail', value: 'Неизвестная ошибка' };
            }
        }
        else
        {
            exec(`shutdown -c`);
            return { status: 'ok', value: 'Действие отменено' };
        }       
    }
});

fastify.get('*', async (request, reply) => {
    return { status: 'fail', value: 'Неизвестная команда' };
});

try
{
    await fastify.listen({ host: '0.0.0.0', port: config.app.port });
    console.log(`Сервер запущен по адресу http://127.0.0.1:${config.app.port}`);
}
catch (error)
{
    fastify.log.error(err);
    process.exit(1);
}

function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    const result = titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    return `${number} ${result}`;
}