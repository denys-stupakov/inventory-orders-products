import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'inventory-secret-key-2024';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGIN, credentials: true },
});

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// ── In-memory DB ──────────────────────────────────────────────
let products = [
  { id: 1, serialNumber: 12345678, isNew: 1, photo: '', title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', type: 'Monitors', specification: 'Specification 1', guarantee: { start: '2017-04-06 00:00:00', end: '2025-08-06 00:00:00' }, price: [{ value: 100, symbol: 'USD', isDefault: 0 }, { value: 2500, symbol: 'UAH', isDefault: 1 }], order: 1, date: '2017-09-06 00:00:00' },
  { id: 2, serialNumber: 12345678, isNew: 0, photo: '', title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', type: 'Monitors', specification: 'Specification 2', guarantee: { start: '2017-04-06 00:00:00', end: '2025-08-06 00:00:00' }, price: [{ value: 100, symbol: 'USD', isDefault: 0 }, { value: 2500, symbol: 'UAH', isDefault: 1 }], order: 1, date: '2017-09-06 00:00:00' },
  { id: 3, serialNumber: 12345678, isNew: 1, photo: '', title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', type: 'Laptops', specification: 'Specification 3', guarantee: { start: '2017-04-06 00:00:00', end: '2025-08-06 00:00:00' }, price: [{ value: 150, symbol: 'USD', isDefault: 0 }, { value: 3900, symbol: 'UAH', isDefault: 1 }], order: 2, date: '2017-09-06 00:00:00' },
  { id: 4, serialNumber: 12345678, isNew: 0, photo: '', title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', type: 'Laptops', specification: 'Specification 4', guarantee: { start: '2017-04-06 00:00:00', end: '2025-08-06 00:00:00' }, price: [{ value: 150, symbol: 'USD', isDefault: 0 }, { value: 3900, symbol: 'UAH', isDefault: 1 }], order: 2, date: '2017-09-06 00:00:00' },
  { id: 5, serialNumber: 12345678, isNew: 1, photo: '', title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', type: 'Monitors', specification: 'Specification 5', guarantee: { start: '2017-04-06 00:00:00', end: '2025-08-06 00:00:00' }, price: [{ value: 200, symbol: 'USD', isDefault: 0 }, { value: 5200, symbol: 'UAH', isDefault: 1 }], order: 3, date: '2017-09-06 00:00:00' },
  { id: 6, serialNumber: 12345678, isNew: 0, photo: '', title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', type: 'Phones', specification: 'Specification 6', guarantee: { start: '2017-04-06 00:00:00', end: '2025-08-06 00:00:00' }, price: [{ value: 80, symbol: 'USD', isDefault: 0 }, { value: 2080, symbol: 'UAH', isDefault: 1 }], order: 3, date: '2017-09-06 00:00:00' },
];

let orders = [
  { id: 1, title: 'Длинное предлинное длиннючее название прихода', date: '2017-04-06 00:00:00', description: 'desc' },
  { id: 2, title: 'Длинное название прихода', date: '2017-09-06 00:00:00', description: 'desc' },
  { id: 3, title: 'Длинное предлинное длиннючее название прихода', date: '2017-06-06 00:00:00', description: 'desc' },
  { id: 4, title: 'Длинное предлинное название прихода', date: '2017-02-06 00:00:00', description: 'desc' },
];

const users = [
  { id: 1, email: 'admin@inventory.com', password: 'admin123', name: 'Admin User' },
  { id: 2, email: 'denys@inventory.com', password: 'denys123', name: 'Denys Stupakov' },
];

const getOrdersWithProducts = () =>
  orders.map((o) => ({ ...o, products: products.filter((p) => p.order === o.id) }));

// ── Auth middleware ───────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ── Auth routes ───────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

// ── Orders routes ─────────────────────────────────────────────
app.get('/api/orders', authMiddleware, (_req, res) => {
  res.json(getOrdersWithProducts());
});

app.post('/api/orders', authMiddleware, (req, res) => {
  const { title, date, description } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'title and date are required' });
  const newOrder = { id: Date.now(), title, date, description: description || '' };
  orders.push(newOrder);
  const withProducts = { ...newOrder, products: [] };
  io.emit('order:created', withProducts);
  res.status(201).json(withProducts);
});

app.delete('/api/orders/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  orders = orders.filter((o) => o.id !== id);
  products = products.filter((p) => p.order !== id);
  io.emit('order:deleted', id);
  res.json({ ok: true });
});

// ── Products routes ───────────────────────────────────────────
app.get('/api/products', authMiddleware, (_req, res) => {
  res.json(products);
});

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  products = products.filter((p) => p.id !== id);
  io.emit('product:deleted', id);
  res.json({ ok: true });
});

// ── Socket.io — active sessions counter ──────────────────────
let activeSessions = 0;

io.on('connection', (socket) => {
  activeSessions++;
  io.emit('sessions:update', activeSessions);

  socket.on('disconnect', () => {
    activeSessions--;
    io.emit('sessions:update', activeSessions);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
