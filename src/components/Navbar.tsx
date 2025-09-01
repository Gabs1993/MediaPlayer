import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/medias")}
          >
            🎵 Media Player
          </Typography>
          <Button color="inherit" onClick={() => navigate("/medias")}>
            Mídias
          </Button>
          <Button color="inherit" onClick={() => navigate("/playlists")}>
            Playlists
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}