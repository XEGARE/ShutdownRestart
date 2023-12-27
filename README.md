# ShutdownRestart
Удалённая перезагрузка/отключение ПК

## Подготовка
1. Отредактировать конфиг **ShutdownRestart.json**

2. Установить зависимости:
```
npm i
```

3. Запускаем скрипт:
```
npm start
```
или
```
node app.js
```

## Ссылки
### Выключение:
```
http://127.0.0.1:{port}/shutdown/?key={secret}&time={ВРЕМЯ}
```

### Перезагрузка:
```
http://127.0.0.1:{port}/restart/?key={secret}&time={ВРЕМЯ}
```

### Отменить:
```
http://127.0.0.1:{port}/cancel/?key={secret}
```