import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import {
  Box,
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
  Grid,
  Divider,
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
  Security as SecurityIcon,
  Search as SearchIcon,
  Block as BlockIcon,
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
      const response = await axiosInstance.get("/statistics");
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Ошибка загрузки статистики: " +
          (err.response?.data?.error || err.message),
      );
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

  const getRiskLabel = (score) => {
    if (score >= 3) return "КРИТИЧЕСКИЙ";
    if (score >= 2) return "ВЫСОКИЙ";
    if (score >= 1) return "СРЕДНИЙ";
    return "НИЗКИЙ";
  };

  const getRiskDescription = (score) => {
    if (score >= 3) return "Требует немедленного вмешательства";
    if (score >= 2) return "Рекомендуется блокировка";
    if (score >= 1) return "Требуется мониторинг";
    return "Безопасно";
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

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!stats) return <Alert severity="info">Нет данных</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          📊 Статистика подозрительных IP
        </Typography>

        <Tooltip title="Что означают эти цифры?">
          <IconButton onClick={() => setShowExplanation(!showExplanation)}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ОБЪЯСНЕНИЕ МЕТРИК */}
      <Collapse in={showExplanation}>
        <Paper sx={{ p: 3, mb: 3, bgcolor: "#e3f2fd" }}>
          <Typography
            variant="h6"
            gutterBottom
            display="flex"
            alignItems="center"
            gap={1}
          >
            <SecurityIcon /> Как понимать статистику безопасности?
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                🔢 Подозрительный счет (0-4)
              </Typography>
              <Typography variant="body2">
                • <strong>0-1 (Низкий риск)</strong> — нормальное поведение,
                можно не беспокоиться
                <br />• <strong>2 (Средний риск)</strong> — есть подозрительная
                активность, стоит присмотреться
                <br />• <strong>3 (Высокий риск)</strong> — высокая вероятность
                атаки, рекомендуется блокировка
                <br />• <strong>4 (Критический риск)</strong> — активная атака,
                требуется немедленное вмешательство
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                ⚠️ Что означает каждая метрика?
              </Typography>
              <Typography variant="body2">
                • <strong>Запросы</strong> — общее количество HTTP запросов
                (высокое значение может указывать на DDoS)
                <br />• <strong>Неудачные логины</strong> — попытки подбора
                пароля (brute force атака)
                <br />• <strong>Уникальные эндпоинты</strong> — сканирование
                системы на уязвимости
                <br />• <strong>Запросов/мин</strong> — интенсивность трафика
                (аномально высокое значение = атака)
                <br />• <strong>Подозрительные паттерны</strong> — обнаружены
                вредоносные сигнатуры
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            💡 <strong>Рекомендация:</strong> IP с критическим риском (3-4)
            рекомендуется немедленно заблокировать. IP со средним риском (2) —
            усилить мониторинг.
          </Typography>
        </Paper>
      </Collapse>

      {/* ОСНОВНЫЕ KPI МЕТРИКИ */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
        📈 Общие показатели
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Всего IP адресов
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.totalIPs || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    отслеживается в системе
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
              height: "100%",
              bgcolor: stats.suspiciousCount > 0 ? "#ffebee" : "inherit",
            }}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Подозрительные IP
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="error">
                    {stats.suspiciousCount || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {stats.totalIPs > 0
                      ? (
                          (stats.suspiciousCount / stats.totalIPs) *
                          100
                        ).toFixed(1)
                      : 0}
                    % от всех IP
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 48, color: "warning.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Критический риск
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="error">
                    {stats.highRiskCount || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    требуют немедленной блокировки
                  </Typography>
                </Box>
                <ErrorIcon sx={{ fontSize: 48, color: "error.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Средний уровень угрозы
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.averageSuspiciousScore
                      ? stats.averageSuspiciousScore.toFixed(1)
                      : "0.0"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    из 4 возможных
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: "info.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ДЕТАЛЬНЫЕ МЕТРИКИ АКТИВНОСТИ */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
        🎯 Детальный анализ угроз
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <SpeedIcon sx={{ fontSize: 40, color: "primary.main" }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Общий трафик от подозрительных IP
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {(
                      stats.topSuspiciousIPs?.reduce(
                        (sum, ip) => sum + (ip.requestCount || 0),
                        0,
                      ) || 0
                    ).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    HTTP запросов
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label="Может указывать на DDoS атаку"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <LockIcon sx={{ fontSize: 40, color: "error.main" }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Попытки взлома
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error">
                    {stats.topSuspiciousIPs?.reduce(
                      (sum, ip) => sum + (ip.failedLogins || 0),
                      0,
                    ) || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    неудачных логинов
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label="Brute force атака"
                      variant="outlined"
                      color="error"
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <SearchIcon sx={{ fontSize: 40, color: "secondary.main" }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Сканирование системы
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.topSuspiciousIPs?.reduce(
                      (sum, ip) => sum + (ip.uniqueEndpoints || 0),
                      0,
                    ) || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    уникальных эндпоинтов
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label="Поиск уязвимостей"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ТАБЛИЦА ПОДОЗРИТЕЛЬНЫХ IP */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
        🚨 Топ подозрительных IP адресов (требуют внимания)
      </Typography>

      <Card>
        <CardContent>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell>
                    <strong>IP Адрес</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Уровень риска</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Запросы</strong>
                    <br />
                    <Typography variant="caption">(DDoS индикатор)</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Неудачные логины</strong>
                    <br />
                    <Typography variant="caption">(Brute force)</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Эндпоинты</strong>
                    <br />
                    <Typography variant="caption">(Сканирование)</Typography>
                  </TableCell>
                  <TableCell>
                    <strong>Местоположение</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Рекомендация</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stats.topSuspiciousIPs?.map((ip) => (
                  <TableRow key={ip.id} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {ip.ipAddress}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Tooltip title={getRiskDescription(ip.suspiciousScore)}>
                        <Chip
                          size="small"
                          label={`${ip.suspiciousScore}/4 - ${getRiskLabel(ip.suspiciousScore)}`}
                          color={getRiskColor(ip.suspiciousScore)}
                        />
                      </Tooltip>
                    </TableCell>

                    <TableCell align="right">
                      <strong>{ip.requestCount?.toLocaleString() || 0}</strong>
                      <Typography
                        variant="caption"
                        display="block"
                        color="textSecondary"
                      >
                        {ip.requestsPerMinute || 0}/мин
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <strong
                        style={{
                          color: ip.failedLogins > 50 ? "#d32f2f" : "inherit",
                        }}
                      >
                        {ip.failedLogins || 0}
                      </strong>
                    </TableCell>

                    <TableCell align="right">
                      {ip.uniqueEndpoints || 0}
                    </TableCell>

                    <TableCell>{ip.location || "Неизвестно"}</TableCell>

                    <TableCell>
                      {ip.suspiciousScore >= 3 ? (
                        <Chip
                          size="small"
                          label="НЕМЕДЛЕННАЯ БЛОКИРОВКА"
                          color="error"
                          icon={<BlockIcon />}
                        />
                      ) : ip.suspiciousScore >= 2 ? (
                        <Chip
                          size="small"
                          label="Усилить мониторинг"
                          color="warning"
                        />
                      ) : (
                        <Chip size="small" label="Наблюдение" color="info" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {(!stats.topSuspiciousIPs || stats.topSuspiciousIPs.length === 0) && (
            <Box textAlign="center" py={4}>
              <Typography color="textSecondary">
                ✅ Нет подозрительных IP адресов. Система в безопасности!
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* РЕКОМЕНДАЦИИ ПО ДЕЙСТВИЯМ */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: "#fff3e0" }}>
        <Typography
          variant="h6"
          gutterBottom
          display="flex"
          alignItems="center"
          gap={1}
        >
          💡 Рекомендации по реагированию
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="success.main"
              >
                🟢 НИЗКИЙ РИСК (0-1)
              </Typography>
              <Typography variant="body2">
                • Продолжить стандартный мониторинг
                <br />
                • Нет необходимости в блокировке
                <br />• Обычная активность
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="warning.main"
              >
                🟡 СРЕДНИЙ РИСК (2)
              </Typography>
              <Typography variant="body2">
                • Усилить мониторинг трафика
                <br />
                • Анализировать активность
                <br />• Рассмотреть временную блокировку
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="error.main"
              >
                🔴 ВЫСОКИЙ/КРИТИЧЕСКИЙ (3-4)
              </Typography>
              <Typography variant="body2">
                • <strong>НЕМЕДЛЕННАЯ БЛОКИРОВКА</strong>
                <br />
                • Анализ логов безопасности
                <br />
                • Обновление правил файрвола
                <br />• Расследование инцидента
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Statistics;
