import React, { useState } from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import {
  Container,
  Snackbar,
  Typography,
  Box,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Alert,
} from '@mui/material';

import { useDispatch } from 'react-redux';
import { setCurrentuser, userLogin } from "../model/currentUserStore";
import { exists } from "../utils/utils";


const theme = createTheme();

export default function Login() {
  const [loginParams, setLoginParams] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const history = useNavigate();

  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const payload = loginParams;
    localStorage.clear();

    const callback = (response) => {
      if (exists(response?.error)) {
        setSnackbarErrorMessage(response?.error);
        setShowErrorSnackbar(true);
        return;
      }

      const loggedUserInfo = { name: response?.name, email: response?.email };

      localStorage.setItem("name", loggedUserInfo?.name);
      localStorage.setItem("email", loggedUserInfo?.email);

      dispatch(setCurrentuser({ payload: loggedUserInfo }))
      history('/inicio');
    };

    dispatch(userLogin({ payload, callback }))

  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Entrar no sistema</Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={loginParams?.email}
              onChange={e => setLoginParams({ ...loginParams, email: e?.target?.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={loginParams?.password}
              onChange={e => setLoginParams({ ...loginParams, password: e?.target?.value })}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Entrar</Button>
          </Box>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={showErrorSnackbar}
            autoHideDuration={6000}
            onClose={() => setShowErrorSnackbar(false)}
          >
            <Alert onClose={() => setShowErrorSnackbar(false)} severity="error" sx={{ width: '100%' }}>
              {snackbarErrorMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
};