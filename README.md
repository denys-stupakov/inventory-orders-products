# Inventory App — Orders & Products SPA

SPA-додаток для управління приходами та продуктами. Тестове завдання dZENcode (рівень Junior+).

## Стек технологій

### Frontend
| Технологія | Версія | Призначення |
|---|---|---|
| React | 19 | UI бібліотека |
| TypeScript | 6 | Типізація |
| Redux Toolkit | 2 | Глобальний стан + async thunks |
| React Router | 7 | Роутинг з анімаціями |
| Axios | 1 | HTTP-запити до REST API |
| socket.io-client | 4 | WebSocket — лічильник активних сесій |
| react-i18next | — | Інтернаціоналізація (UK/EN) |
| recharts | — | Графіки (BarChart) |
| Bootstrap 5 | — | CSS Framework |
| animate.css | — | Анімації переходів |
| date-fns | — | Форматування дат |
| Vite | 8 | Збірник (Lazy Loading chunks) |

### Backend
| Технологія | Призначення |
|---|---|
| Express | REST API |
| Socket.io | WebSocket сервер |
| jsonwebtoken | JWT авторизація |

### Якість
| Інструмент | Призначення |
|---|---|
| vitest | Unit тести (16 тестів) |
| @testing-library/react | Тестування компонентів |
| ESLint + TypeScript | Лінтер |
| Docker | Контейнеризація |

## Функціональність

- **Авторизація**: JWT Login / Logout, PrivateRoute, токен у localStorage
- **Приходи**: список, деталі, сума в USD/UAH, дата у 2 форматах, видалення з попапом, **форма створення з валідацією**
- **Групи**: групування продуктів за типом
- **Продукти**: таблиця, фільтр за типом і специфікацією
- **Графік**: BarChart кількості продуктів по приходах (кнопка 📊)
- **i18n**: перемикач мов UK/EN у хедері
- **WebSocket**: реальний лічильник активних вкладок через Socket.io
- **Web Storage**: стан зберігається у localStorage між сесіями

## Встановлення та запуск

```bash
# Клонувати репозиторій
git clone <repo-url>
cd inventory-vite

# Встановити залежності
npm install

# Запустити frontend + backend одночасно
npm run start
# або окремо:
npm run server   # backend  — http://localhost:3001
npm run dev      # frontend — http://localhost:5173
```

## Тести

```bash
npm run test        # запуск один раз
npm run test:watch  # режим watch
```

## Docker

```bash
docker build -t inventory-app .
docker run -p 8080:80 inventory-app
```

## Demo-акаунти

| Email | Пароль |
|---|---|
| admin@inventory.com | admin123 |
| denys@inventory.com | denys123 |

## Структура проекту

```
├── server/
│   └── index.js          # Express + Socket.io + JWT REST API
├── src/
│   ├── api/
│   │   └── index.ts      # Axios instance + API functions
│   ├── components/
│   │   ├── Layout.tsx    # Header + Sidebar (i18n, socket.io, logout)
│   │   ├── DeleteModal.tsx
│   │   ├── OrderForm.tsx  # Форма створення приходу з валідацією
│   │   └── PrivateRoute.tsx
│   ├── i18n/
│   │   ├── index.ts      # i18next setup
│   │   └── locales/      # uk.json, en.json
│   ├── pages/
│   │   ├── LoginPage.tsx  # JWT login з валідацією
│   │   ├── OrdersPage.tsx # Приходи + Chart
│   │   ├── GroupsPage.tsx
│   │   └── ProductsPage.tsx
│   ├── store/
│   │   ├── index.ts      # Redux store + localStorage persist
│   │   └── appSlice.ts   # Reducers + async thunks
│   ├── tests/
│   │   ├── appSlice.test.ts
│   │   ├── loginValidation.test.ts
│   │   └── orderFormValidation.test.ts
│   ├── styles/global.css # BEM стилі
│   ├── data.ts           # Mock дані (fallback)
│   ├── types.ts          # TypeScript типи
│   └── App.tsx           # Роутинг + React.lazy + Suspense
├── Dockerfile
└── README.md
```

## Реалізовані вимоги Junior+

| Вимога | Статус |
|---|---|
| TypeScript | ✅ |
| Global State (Redux Toolkit) | ✅ |
| Routing (React Router) | ✅ |
| Animations (animate.css, CSS) | ✅ |
| WebSocket (Socket.io) | ✅ |
| REST API (Axios) | ✅ |
| JWT Auth | ✅ |
| Web Storage (localStorage) | ✅ |
| Lazy Loading (React.lazy) | ✅ |
| i18n (react-i18next) | ✅ |
| Charts (recharts) | ✅ |
| Form + Validation | ✅ |
| Unit Tests (vitest, 16 тестів) | ✅ |
| Bootstrap | ✅ |
| BEM CSS | ✅ |
| Docker | ✅ |
| Git | ✅ |
