# Inventory App — Orders & Products SPA

React + TypeScript SPA для управления приходами и продуктами.

## Стек технологий

- **React 18** + **TypeScript**
- **Redux Toolkit** — глобальное состояние
- **React Router v6** — роутинг с анимированными переходами
- **Bootstrap 5** — CSS-фреймворк
- **date-fns** — форматирование дат
- **animate.css** — анимации
- **localStorage** (Web Storage) — персистентное хранение состояния
- **BroadcastChannel API** — счётчик активных вкладок
- **Vite** — сборщик

## Установка и запуск

```bash
npm install
npm run dev
# Открыть http://localhost:5173
```

## Сборка для продакшна

```bash
npm run build
```

## Docker

```bash
docker build -t inventory-app .
docker run -p 8080:80 inventory-app
```

## Структура проекта

```
src/
├── components/
│   ├── Layout.tsx       # Header + Sidebar
│   └── DeleteModal.tsx  # Модальное окно подтверждения
├── pages/
│   ├── OrdersPage.tsx   # Страница приходов
│   └── ProductsPage.tsx # Страница продуктов
├── store/
│   ├── index.ts         # Redux store
│   └── appSlice.ts      # Redux slice
├── styles/global.css    # BEM стили
├── data.ts              # Mock данные
├── types.ts             # TypeScript типы
└── App.tsx              # Роутинг
```
