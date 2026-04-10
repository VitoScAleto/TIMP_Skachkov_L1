import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const API_URL = "http://localhost:3000/api";

const IPDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ip, setIp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIPDetails();
  }, [id]);

  const fetchIPDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/ips/${id}`);
      setIp(response.data);
      setError(null);
    } catch (err) {
      setError("Ошибка загрузки данных: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (ip) => {
    if (ip.suspiciousScore >= 3) {
      return {
        label: "Критический риск",
        color: "error",
        icon: <WarningIcon />,
      };
    }
    if (ip.suspiciousScore >= 2) {
      return { label: "Высокий риск", color: "warning", icon: <WarningIcon /> };
    }
    if (ip.suspiciousScore >= 1) {
      return { label: "Средний риск", color: "info", icon: <WarningIcon /> };
    }
    return {
      label: "Низкий риск",
      color: "success",
      icon: <CheckCircleIcon />,
    };
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

  if (error || !ip) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || "IP адрес не найден"}
      </Alert>
    );
  }

  const risk = getRiskLevel(ip);

  return (
    <Box>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Назад к списку
      </Button>

      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="start"
            mb={3}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {ip.ipAddress}
              </Typography>
              <Chip
                icon={risk.icon}
                label={risk.label}
                color={risk.color}
                size="medium"
              />
            </Box>
            <Button
              component={Link}
              to={`/edit/${ip.id}`}
              variant="contained"
              color="warning"
              startIcon={<EditIcon />}
            >
              Редактировать
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Основная информация
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography>
                  <strong>Местоположение:</strong> {ip.location || "Неизвестно"}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <TimeIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography>
                  <strong>Последнее обнаружение:</strong>{" "}
                  {new Date(ip.lastSeen).toLocaleString()}
                </Typography>
              </Box>
              {ip.notes && (
                <Typography variant="body2" color="text.secondary" mt={2}>
                  <strong>Примечания:</strong> {ip.notes}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Метрики активности
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Количество запросов: {ip.requestCount}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (ip.requestCount / 3000) * 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Неудачные логины: {ip.failedLogins}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (ip.failedLogins / 200) * 100)}
                  color="error"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Уникальных эндпоинтов: {ip.uniqueEndpoints}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (ip.uniqueEndpoints / 300) * 100)}
                  color="info"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Запросов в минуту: {ip.requestsPerMinute}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, ip.requestsPerMinute)}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Подозрительные паттерны
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "background.default" }}
            >
              <Typography>
                <strong>Количество подозрительных паттернов:</strong>{" "}
                {ip.suspiciousPatterns}
              </Typography>
              <Typography mt={1}>
                <strong>Общий подозрительный счет:</strong> {ip.suspiciousScore}
                /4
              </Typography>
              {ip.isSuspicious ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                  ⚠️ Этот IP адрес классифицирован как подозрительный и требует
                  внимания!
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mt: 2 }}>
                  ✅ Этот IP адрес не показывает подозрительной активности.
                </Alert>
              )}
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IPDetail;
