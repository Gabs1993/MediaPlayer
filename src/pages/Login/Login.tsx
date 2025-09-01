import { useState } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";
import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error");

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginApi(email, password);
      login(data.token);
      setSnackbarMessage("Login realizado com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/medias");
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Usuário ou senha inválidos");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Bem-vindo
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ color: "text.secondary", mb: 2 }}
            >
              Faça login para continuar
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Entrar
              </Button>
            </form>

            <Typography align="center" sx={{ mt: 2, color: "text.secondary" }}>
              Não tem usuário?{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/cadastro")}
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Cadastre-se
              </Button>
            </Typography>
          </Paper>
        </Container>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}