import { exec } from 'node:child_process'

import Fastify from 'fastify'
const fastify = Fastify();

import config from './ShutdownRestart.json' with { type: "json" }

fastify.get('/shutdown/', async (request, reply) => {
  if(request.query.key != config.app.key)
  {
    return { status: 'fail', value: 'Доступ запрещен!' };
  }
  else
  {
    if(request.query.time)
    {
      if(process.platform === "win32")
      {
        exec(`shutdown /s /t ${request.query.time}`);
      }
      else
      {
        exec(`shutdown ${request.query.time}`);
      }

      return { status: 'ok', value: 'Выключение активировано!' };
    }
    else
    {
      return { status: 'fail', value: 'Время не передано!' };
    }
  }
});

fastify.get('/restart/', async (request, reply) => {
  if(request.query.key != config.app.key)
  {
    return { status: 'fail', value: 'Доступ запрещен!' };
  }
  else
  {
    if(request.query.time)
    {
      if(process.platform === "win32")
      {
        exec(`shutdown /r /t ${request.query.time}`);
      }
      else
      {
        exec(`shutdown -r ${request.query.time}`);
      }

      return { status: 'ok', value: 'Перезагрузка активирована!' };
    }
    else
    {
      return { status: 'fail', value: 'Время не передано!' };
    }
  }
});

fastify.get('/cancel/', async (request, reply) => {
  if(request.query.key != config.app.key)
  {
    return { status: 'fail', value: 'Доступ запрещен!' };
  }
  else
  {
    if(process.platform === "win32")
    {
      exec(`shutdown /a`);
    }
    else
    {
      exec(`shutdown -c`);
    }

    return { status: 'ok', value: 'Действие отменено!' };
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