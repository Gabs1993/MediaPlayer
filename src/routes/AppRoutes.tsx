import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import MediaList from "../pages/Medias/MediaList";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar"; // Importa a Navbar
import { Box } from "@mui/material";
import PlaylistList from "../pages/Playlists/PlayListList";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? (
    <Box>
      <Navbar />
      {children}
    </Box>
  ) : (
    <Navigate to="/login" />
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/medias" />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/cadastro"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/medias"
          element={
            <PrivateRoute>
              <MediaList />
            </PrivateRoute>
          }
        />
        <Route
          path="/playlists"
          element={
            <PrivateRoute>
              <PlaylistList />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}