import { Order, Product } from './types';

export const initialProducts: Product[] = [
  {
    id: 1,
    serialNumber: 12345678,
    isNew: 1,
    photo: '',
    title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
    type: 'Monitors',
    specification: 'Specification 1',
    guarantee: {
      start: '2017-04-06 00:00:00',
      end: '2025-08-06 00:00:00',
    },
    price: [
      { value: 100, symbol: 'USD', isDefault: 0 },
      { value: 2500, symbol: 'UAH', isDefault: 1 },
    ],
    order: 1,
    date: '2017-09-06 00:00:00',
  },
  {
    id: 2,
    serialNumber: 12345678,
    isNew: 0,
    photo: '',
    title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
    type: 'Monitors',
    specification: 'Specification 2',
    guarantee: {
      start: '2017-04-06 00:00:00',
      end: '2025-08-06 00:00:00',
    },
    price: [
      { value: 100, symbol: 'USD', isDefault: 0 },
      { value: 2500, symbol: 'UAH', isDefault: 1 },
    ],
    order: 1,
    date: '2017-09-06 00:00:00',
  },
  {
    id: 3,
    serialNumber: 12345678,
    isNew: 1,
    photo: '',
    title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
    type: 'Laptops',
    specification: 'Specification 3',
    guarantee: {
      start: '2017-04-06 00:00:00',
      end: '2025-08-06 00:00:00',
    },
    price: [
      { value: 150, symbol: 'USD', isDefault: 0 },
      { value: 3900, symbol: 'UAH', isDefault: 1 },
    ],
    order: 2,
    date: '2017-09-06 00:00:00',
  },
  {
    id: 4,
    serialNumber: 12345678,
    isNew: 0,
    photo: '',
    title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
    type: 'Laptops',
    specification: 'Specification 4',
    guarantee: {
      start: '2017-04-06 00:00:00',
      end: '2025-08-06 00:00:00',
    },
    price: [
      { value: 150, symbol: 'USD', isDefault: 0 },
      { value: 3900, symbol: 'UAH', isDefault: 1 },
    ],
    order: 2,
    date: '2017-09-06 00:00:00',
  },
  {
    id: 5,
    serialNumber: 12345678,
    isNew: 1,
    photo: '',
    title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
    type: 'Monitors',
    specification: 'Specification 5',
    guarantee: {
      start: '2017-04-06 00:00:00',
      end: '2025-08-06 00:00:00',
    },
    price: [
      { value: 200, symbol: 'USD', isDefault: 0 },
      { value: 5200, symbol: 'UAH', isDefault: 1 },
    ],
    order: 3,
    date: '2017-09-06 00:00:00',
  },
  {
    id: 6,
    serialNumber: 12345678,
    isNew: 0,
    photo: '',
    title: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
    type: 'Phones',
    specification: 'Specification 6',
    guarantee: {
      start: '2017-04-06 00:00:00',
      end: '2025-08-06 00:00:00',
    },
    price: [
      { value: 80, symbol: 'USD', isDefault: 0 },
      { value: 2080, symbol: 'UAH', isDefault: 1 },
    ],
    order: 3,
    date: '2017-09-06 00:00:00',
  },
];

export const initialOrders: Order[] = [
  {
    id: 1,
    title: 'Длинное предлинное длиннючее название прихода',
    date: '2017-04-06 00:00:00',
    description: 'desc',
    products: initialProducts.filter((p) => p.order === 1),
  },
  {
    id: 2,
    title: 'Длинное название прихода',
    date: '2017-09-06 00:00:00',
    description: 'desc',
    products: initialProducts.filter((p) => p.order === 2),
  },
  {
    id: 3,
    title: 'Длинное предлинное длиннючее название прихода',
    date: '2017-06-06 00:00:00',
    description: 'desc',
    products: initialProducts.filter((p) => p.order === 3),
  },
  {
    id: 4,
    title: 'Длинное предлинное название прихода',
    date: '2017-02-06 00:00:00',
    description: 'desc',
    products: [],
  },
];
