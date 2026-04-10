import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Public as PublicIcon,
  Info as InfoIcon,
  Speed as SpeedIcon,
  Lock as LockIcon,
  Route as RouteIcon,
  Pattern as PatternIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

const API_URL = "http://localhost:3000/api";

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/statistics`);
      console.log("Statistics response:", response.data);
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Ошибка загрузки статистики: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 3) return "error";
    if (score >= 2) return "warning";
    if (score >= 1) return "info";
    return "success";
  };

  const getRiskText = (score) => {
    if (score >= 3) return "Критический риск - немедленное реагирование";
    if (score >= 2) return "Высокий риск - требует внимания";
    if (score >= 1) return "Средний риск - мониторинг";
    return "Низкий риск - безопасно";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Нет данных для отображения
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Статистика подозрительных IP
        </Typography>
        <Tooltip title="Объяснение метрик">
          <IconButton onClick={() => setShowExplanation(!showExplanation)}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={showExplanation}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            bgcolor: "info.light",
            color: "info.contrastText",
          }}
        >
          <Typography variant="h6" gutterBottom>
            📊 Как интерпретировать метрики?
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" paragraph>
                <strong>🔢 Подозрительный счет (0-4):</strong>
                <br />
                • 0-1: Низкий риск - нормальное поведение
                <br />
                • 2: Средний риск - возможны подозрительные действия
                <br />• 3-4: Высокий/Критический риск - требуется немедленное
                внимание
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" paragraph>
                <strong>⚠️ Факторы подозрительности:</strong>
                <br />
                • 1000 запросов - аномальный трафик
                <br />
                • 50 неудачных логинов - попытка подбора пароля
                <br />
                • 100 уникальных эндпоинтов - сканирование системы
                <br />
                • 60 запросов/мин - DDoS атака
                <br />• 5 подозрительных паттернов - вредоносная активность
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Всего IP адресов
                  </Typography>
                  <Typography variant="h3">{stats.totalIPs || 0}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Отслеживаемых узлов
                  </Typography>
                </Box>
                <PublicIcon sx={{ fontSize: 48, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: stats.suspiciousCount > 0 ? "error.light" : "inherit",
            }}
          >
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Подозрительные IP
                  </Typography>
                  <Typography variant="h3" color="error">
                    {stats.suspiciousCount || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {((stats.suspiciousCount / stats.totalIPs) * 100).toFixed(
                      1,
                    )}
                    % от всех IP
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 48, color: "warning.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Критический риск
                  </Typography>
                  <Typography variant="h3" color="error">
                    {stats.highRiskCount || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Требуют немедленного вмешательства
                  </Typography>
                </Box>
                <ErrorIcon sx={{ fontSize: 48, color: "error.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Средний риск
                  </Typography>
                  <Typography variant="h3">
                    {stats.averageSuspiciousScore
                      ? stats.averageSuspiciousScore.toFixed(1)
                      : "0.0"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    /4 - общий уровень угрозы
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: "info.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Дополнительные метрики */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <SpeedIcon color="primary" />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Общий трафик
                  </Typography>
                  <Typography variant="h6">
                    {stats.totalIPs > 0
                      ? (
                          stats.topSuspiciousIPs?.reduce(
                            (sum, ip) => sum + ip.requestCount,
                            0,
                          ) || 0
                        ).toLocaleString()
                      : 0}{" "}
                    запросов
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    от подозрительных IP
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <LockIcon color="error" />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Неудачных логинов
                  </Typography>
                  <Typography variant="h6">
                    {stats.topSuspiciousIPs?.reduce(
                      (sum, ip) => sum + ip.failedLogins,
                      0,
                    ) || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    попыток взлома
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <RouteIcon color="secondary" />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Сканирование системы
                  </Typography>
                  <Typography variant="h6">
                    {stats.topSuspiciousIPs?.reduce(
                      (sum, ip) => sum + ip.uniqueEndpoints,
                      0,
                    ) || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    уникальных эндпоинтов
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Таблица подозрительных IP */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🚨 Топ подозрительных IP адресов
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            IP адреса с наибольшим уровнем риска. Рекомендуется принять меры для
            IP с критическим риском.
          </Typography>

          {stats.topSuspiciousIPs && stats.topSuspiciousIPs.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    <TableCell>IP Адрес</TableCell>
                    <TableCell align="center">Уровень риска</TableCell>
                    <TableCell align="right">Запросы</TableCell>
                    <TableCell align="right">Неудачные логины</TableCell>
                    <TableCell align="right">Эндпоинты</TableCell>
                    <TableCell>Местоположение</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.topSuspiciousIPs.map((ip, index) => (
                    <TableRow key={ip.id} hover>
                      <TableCell component="th" scope="row">
                        <Typography fontWeight="medium">
                          {ip.ipAddress}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {ip.id}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={getRiskText(ip.suspiciousScore)}>
                          <Chip
                            label={`${ip.suspiciousScore}/4 - ${getRiskText(ip.suspiciousScore).split(" - ")[0]}`}
                            color={getRiskColor(ip.suspiciousScore)}
                            size="small"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          {ip.requestCount.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {ip.requestsPerMinute}/мин
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="error.main" fontWeight="medium">
                          {ip.failedLogins}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          попыток
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{ip.uniqueEndpoints}</TableCell>
                      <TableCell>
                        {ip.location || "Неизвестно"}
                        {ip.suspiciousPatterns > 5 && (
                          <Chip
                            size="small"
                            label={`${ip.suspiciousPatterns} паттернов`}
                            color="error"
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              ✅ Нет подозрительных IP адресов. Система в безопасности!
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Рекомендации */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: "warning.light" }}>
        <Typography variant="h6" gutterBottom>
          💡 Рекомендации по реагированию
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              <strong>🟢 Низкий риск (0-1):</strong>
              <br />
              • Продолжить мониторинг
              <br />• Нет необходимости в действиях
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              <strong>🟡 Средний риск (2):</strong>
              <br />
              • Усилить мониторинг
              <br />
              • Анализировать активность
              <br />• Рассмотреть блокировку
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2">
              <strong>🔴 Высокий/Критический риск (3-4):</strong>
              <br />
              • Немедленная блокировка
              <br />
              • Анализ логов
              <br />• Обновление правил безопасности
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Statistics;
