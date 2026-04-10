import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const API_URL = "http://localhost:3000/api";

const IPList = () => {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIp, setSelectedIp] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchIPs();
  }, []);

  const fetchIPs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/ips`);
      setIps(response.data);
      setError(null);
    } catch (err) {
      setError("Ошибка загрузки данных: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (ip) => {
    setSelectedIp(ip);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/ips/${selectedIp.id}`);
      setDeleteDialogOpen(false);
      fetchIPs();
    } catch (err) {
      setError("Ошибка удаления: " + err.message);
    }
  };

  const getRiskLevel = (ip) => {
    if (ip.suspiciousScore >= 3) {
      return { label: "Критический", color: "error", icon: <WarningIcon /> };
    }
    if (ip.suspiciousScore >= 2) {
      return { label: "Высокий", color: "warning", icon: <WarningIcon /> };
    }
    if (ip.suspiciousScore >= 1) {
      return { label: "Средний", color: "info", icon: <WarningIcon /> };
    }
    return { label: "Низкий", color: "success", icon: <CheckCircleIcon /> };
  };

  const filteredIps = ips.filter((ip) => {
    if (filter === "suspicious") return ip.isSuspicious;
    if (filter === "normal") return !ip.isSuspicious;
    return true;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Список IP адресов
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Фильтр</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Фильтр"
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="suspicious">Подозрительные</MenuItem>
            <MenuItem value="normal">Нормальные</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>IP Адрес</TableCell>
              <TableCell>Местоположение</TableCell>
              <TableCell>Запросы</TableCell>
              <TableCell>Неудачные входы</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIps
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ip) => {
                const risk = getRiskLevel(ip);
                return (
                  <TableRow key={ip.id} hover>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {ip.ipAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>{ip.location || "Неизвестно"}</TableCell>
                    <TableCell>{ip.requestCount}</TableCell>
                    <TableCell>
                      <Typography color="error">{ip.failedLogins}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={risk.icon}
                        label={risk.label}
                        color={risk.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/detail/${ip.id}`}
                        color="primary"
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        component={Link}
                        to={`/edit/${ip.id}`}
                        color="warning"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(ip)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredIps.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить IP адрес {selectedIp?.ipAddress}? Это
            действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IPList;
