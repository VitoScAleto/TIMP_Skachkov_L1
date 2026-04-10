import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import IPList from "./components/IPList";
import IPDetail from "./components/IPDetail";
import IPForm from "./components/IPForm";
import Statistics from "./components/Statistics";

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <ShieldIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IP Monitor - Поиск подозрительных IP
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Главная
          </Button>
          <Button color="inherit" component={Link} to="/add">
            Добавить IP
          </Button>
          <Button color="inherit" component={Link} to="/statistics">
            Статистика
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<IPList />} />
          <Route path="/detail/:id" element={<IPDetail />} />
          <Route path="/add" element={<IPForm />} />
          <Route path="/edit/:id" element={<IPForm />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
