const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

// Путь к файлу с данными
const dataPath = path.join(__dirname, "data", "ips.json");

// Функция для загрузки данных из файла
function loadDataFromFile() {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading data from file:", err);
    return [];
  }
}

// Функция для сохранения данных в файл
function saveDataToFile(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log("Data saved to file successfully");
    return true;
  } catch (err) {
    console.error("Error saving data to file:", err);
    return false;
  }
}

// Инициализация данных при старте
let ipAddresses = loadDataFromFile();

// Вспомогательная функция для определения подозрительной активности
function isSuspicious(ip) {
  const suspiciousIndicators = [
    ip.requestCount > 1000,
    ip.failedLogins > 50,
    ip.uniqueEndpoints > 100,
    ip.requestsPerMinute > 60,
    ip.suspiciousPatterns > 5,
  ];

  const suspiciousScore = suspiciousIndicators.filter(Boolean).length;
  ip.suspiciousScore = suspiciousScore;
  ip.isSuspicious = suspiciousScore >= 2;

  return ip;
}

// GET: Получение всех IP адресов
app.get("/api/ips", (req, res) => {
  const ipsWithStatus = ipAddresses.map(isSuspicious);
  res.json(ipsWithStatus);
});

// GET: Получение конкретного IP по ID
app.get("/api/ips/:id", (req, res) => {
  const ip = ipAddresses.find((ip) => ip.id === parseInt(req.params.id));
  if (!ip) {
    return res.status(404).json({ error: "IP адрес не найден" });
  }
  res.json(isSuspicious(ip));
});

// POST: Добавление нового IP адреса
app.post("/api/ips", (req, res) => {
  const newIp = {
    id: ipAddresses.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  ipAddresses.push(newIp);
  saveDataToFile(ipAddresses);
  res.status(201).json(isSuspicious(newIp));
});

// PUT: Обновление IP адреса
app.put("/api/ips/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = ipAddresses.findIndex((ip) => ip.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "IP адрес не найден" });
  }

  ipAddresses[index] = {
    ...ipAddresses[index],
    ...req.body,
    id: ipAddresses[index].id,
    updatedAt: new Date().toISOString(),
  };

  saveDataToFile(ipAddresses);
  res.json(isSuspicious(ipAddresses[index]));
});

// DELETE: Удаление IP адреса
app.delete("/api/ips/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = ipAddresses.findIndex((ip) => ip.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "IP адрес не найден" });
  }

  ipAddresses.splice(index, 1);
  saveDataToFile(ipAddresses);
  res.status(204).send();
});

// GET: Статистика по подозрительным IP
app.get("/api/statistics", (req, res) => {
  const ipsWithStatus = ipAddresses.map(isSuspicious);
  const suspiciousIPs = ipsWithStatus.filter((ip) => ip.isSuspicious);
  const highRiskIPs = ipsWithStatus.filter((ip) => ip.suspiciousScore >= 3);

  res.json({
    totalIPs: ipAddresses.length,
    suspiciousCount: suspiciousIPs.length,
    highRiskCount: highRiskIPs.length,
    averageSuspiciousScore:
      ipsWithStatus.reduce((sum, ip) => sum + ip.suspiciousScore, 0) /
      (ipsWithStatus.length || 1),
    topSuspiciousIPs: suspiciousIPs
      .sort((a, b) => b.suspiciousScore - a.suspiciousScore)
      .slice(0, 5),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Data file path: ${dataPath}`);
});
