import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShieldIcon from "@mui/icons-material/Shield";

import IPList from "./IPList";
import IPDetail from "./IPDetail";
import IPForm from "./IPForm";
import Statistics from "./Statistics";

function MainLayout({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <ShieldIcon sx={{ mr: 2 }} />

          <Typography sx={{ flexGrow: 1 }}>IP Monitor</Typography>

          <Button color="inherit" component={Link} to="/">
            Главная
          </Button>

          {user?.role === "admin" && (
            <Button color="inherit" component={Link} to="/add">
              Добавить
            </Button>
          )}

          <Button color="inherit" component={Link} to="/statistics">
            Статистика
          </Button>

          <IconButton onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              {user?.username} ({user?.role})
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                onLogout();
              }}
            >
              Выйти
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<IPList />} />
          <Route path="/detail/:id" element={<IPDetail />} />
          <Route path="/add" element={<IPForm />} />
          <Route path="/edit/:id" element={<IPForm />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Container>
    </>
  );
}

export default MainLayout;
