import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const API_URL = "http://localhost:3000/api";

const IPForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ipAddress: "",
    requestCount: 0,
    failedLogins: 0,
    uniqueEndpoints: 0,
    requestsPerMinute: 0,
    suspiciousPatterns: 0,
    location: "",
    notes: "",
    lastSeen: new Date().toISOString().slice(0, 16),
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchIPData();
    }
  }, [id]);

  const fetchIPData = async () => {
    try {
      const response = await axios.get(`${API_URL}/ips/${id}`);
      const ipData = response.data;
      setFormData({
        ipAddress: ipData.ipAddress,
        requestCount: ipData.requestCount,
        failedLogins: ipData.failedLogins,
        uniqueEndpoints: ipData.uniqueEndpoints,
        requestsPerMinute: ipData.requestsPerMinute,
        suspiciousPatterns: ipData.suspiciousPatterns,
        location: ipData.location || "",
        notes: ipData.notes || "",
        lastSeen: ipData.lastSeen
          ? ipData.lastSeen.slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      console.error("Error fetching IP data:", error);
      setSubmitError("Ошибка загрузки данных IP");
    } finally {
      setFetching(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!formData.ipAddress) {
      newErrors.ipAddress = "IP адрес обязателен";
    } else if (!ipRegex.test(formData.ipAddress)) {
      newErrors.ipAddress = "Введите корректный IP адрес";
    }

    if (formData.requestCount < 0)
      newErrors.requestCount =
        "Количество запросов не может быть отрицательным";
    if (formData.failedLogins < 0)
      newErrors.failedLogins =
        "Количество неудачных логинов не может быть отрицательным";
    if (formData.uniqueEndpoints < 0)
      newErrors.uniqueEndpoints =
        "Количество эндпоинтов не может быть отрицательным";
    if (formData.requestsPerMinute < 0)
      newErrors.requestsPerMinute =
        "Запросов в минуту не может быть отрицательным";
    if (formData.suspiciousPatterns < 0)
      newErrors.suspiciousPatterns =
        "Количество паттернов не может быть отрицательным";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      if (id) {
        await axios.put(`${API_URL}/ips/${id}`, formData);
      } else {
        await axios.post(`${API_URL}/ips`, formData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving IP:", error);
      setSubmitError("Ошибка сохранения данных: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "ipAddress" || name === "location" || name === "notes"
          ? value
          : parseInt(value) || 0,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (fetching) {
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
          <Typography variant="h4" component="h1" gutterBottom>
            {id ? "Редактировать IP адрес" : "Добавить новый IP адрес"}
          </Typography>

          {submitError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setSubmitError(null)}
            >
              {submitError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="IP Адрес"
                  name="ipAddress"
                  value={formData.ipAddress}
                  onChange={handleChange}
                  error={!!errors.ipAddress}
                  helperText={errors.ipAddress}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Местоположение"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Moscow, Russia"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Количество запросов"
                  name="requestCount"
                  type="number"
                  value={formData.requestCount}
                  onChange={handleChange}
                  error={!!errors.requestCount}
                  helperText={errors.requestCount}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Неудачных логинов"
                  name="failedLogins"
                  type="number"
                  value={formData.failedLogins}
                  onChange={handleChange}
                  error={!!errors.failedLogins}
                  helperText={errors.failedLogins}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Уникальных эндпоинтов"
                  name="uniqueEndpoints"
                  type="number"
                  value={formData.uniqueEndpoints}
                  onChange={handleChange}
                  error={!!errors.uniqueEndpoints}
                  helperText={errors.uniqueEndpoints}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Запросов в минуту"
                  name="requestsPerMinute"
                  type="number"
                  value={formData.requestsPerMinute}
                  onChange={handleChange}
                  error={!!errors.requestsPerMinute}
                  helperText={errors.requestsPerMinute}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Подозрительных паттернов"
                  name="suspiciousPatterns"
                  type="number"
                  value={formData.suspiciousPatterns}
                  onChange={handleChange}
                  error={!!errors.suspiciousPatterns}
                  helperText={errors.suspiciousPatterns}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Последнее обнаружение"
                  name="lastSeen"
                  type="datetime-local"
                  value={formData.lastSeen}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Примечания"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Дополнительная информация об IP адресе..."
                />
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? "Сохранение..." : id ? "Обновить" : "Добавить"}
              </Button>
              <Button variant="outlined" onClick={() => navigate("/")}>
                Отмена
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IPForm;
