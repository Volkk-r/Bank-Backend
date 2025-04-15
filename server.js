const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Данные
const accounts = [
  { id: 1, name: 'Зарплата', balance: 20000 },
  { id: 2, name: 'Фриланс', balance: 455 }
];

const transactions = [
  { id: 1, name: 'Яндекс', amount: -2500, date: '2025-03-04', status: 'success' },
  { id: 2, name: 'Газпром', amount: 2500, date: '2025-03-04', status: 'success' },
  { id: 3, name: 'Страйп', amount: 800, date: '2025-03-03', status: 'success' },
  { id: 4, name: 'ВК', amount: 1700, date: '2025-03-03', status: 'success' },
  { id: 5, name: 'Кион', amount: 0, date: '2025-03-03', status: 'pending' },
  { id: 6, name: 'Тинькофф', amount: -987, date: '2025-03-03', status: 'success' },
  { id: 7, name: 'Amazon', amount: -3000, date: '2025-02-25', status: 'success' },
  { id: 8, name: 'Apple Pay', amount: 5000, date: '2025-02-20', status: 'success' },
  { id: 9, name: 'Netflix', amount: -999, date: '2025-02-18', status: 'success' },
  { id: 10, name: 'Spotify', amount: -799, date: '2025-02-10', status: 'success' },
  { id: 11, name: 'Uber', amount: -1200, date: '2025-02-05', status: 'success' }
];

let invoices = [
  { id: 'MS-415646', date: '2020-03-01', amount: 180 },
  { id: 'RV-126749', date: '2021-02-10', amount: 250 },
  { id: 'FB-215262', date: '2020-04-05', amount: 560 },
  { id: 'QW-103578', date: '2019-06-25', amount: 120 },
  { id: 'AR-803481', date: '2019-03-01', amount: 300 }
];

let paymentMethods = [
  { id: 1, type: 'Visa', number: '7812 2139 0823 XXXX' },
  { id: 2, type: 'Mastercard', number: '5243 9123 5678 XXXX' }
];

// API маршруты
app.get('/accounts', (req, res) => res.json(accounts));
app.get('/transactions', (req, res) => res.json(transactions));
app.get('/invoices', (req, res) => res.json(invoices));
app.get('/payment-methods', (req, res) => res.json(paymentMethods));

// Добавление нового способа оплаты
app.post('/payment-methods', (req, res) => {
  const { type, number } = req.body;
  if (!type || !number) {
    return res.status(400).json({ message: 'Укажите type и number' });
  }
  const newMethod = { id: paymentMethods.length + 1, type, number };
  paymentMethods.push(newMethod);
  res.status(201).json(newMethod);
});

// Изменение способа оплаты
app.put('/payment-methods/:id', (req, res) => {
  const { id } = req.params;
  const { type, number } = req.body;
  const method = paymentMethods.find(m => m.id === parseInt(id));
  if (!method) {
    return res.status(404).json({ message: 'Способ оплаты не найден' });
  }
  if (type) method.type = type;
  if (number) method.number = number;
  res.json(method);
});

// Фильтрация транзакций по диапазону дат
app.get('/transactions/filter', (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Укажите startDate и endDate' });
  }

  const filteredTransactions = transactions.filter(transaction => {
    return transaction.date >= startDate && transaction.date <= endDate;
  });

  res.json(filteredTransactions);
});

// Удаление счета
app.delete('/invoices/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = invoices.length;
  invoices = invoices.filter(invoice => invoice.id !== id);
  
  if (invoices.length < initialLength) {
    res.json({ message: 'Счёт удалён', id });
  } else {
    res.status(404).json({ message: 'Счёт не найден' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
