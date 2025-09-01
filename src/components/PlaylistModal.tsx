import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Snackbar,
  Alert
} from "@mui/material";
import { createPlaylist } from "../api/playlistApi";
import { getMedias } from "../api/mediaApi";

interface PlaylistModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Media {
  id: string;
  name: string;
}

export default function PlaylistModal({ open, onClose, onSuccess }: PlaylistModalProps) {
  const [nome, setNome] = useState("");
  const [exibirNoPlayer, setExibirNoPlayer] = useState(true);
  const [midiasIds, setMidiasIds] = useState<string[]>([]);
  const [medias, setMedias] = useState<Media[]>([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const data = await getMedias();
        setMedias(data);
      } catch (error) {
        console.error("Erro ao buscar mídias:", error);
      }
    };
    fetchMedias();
  }, []);

  const handleSubmit = async () => {
    try {
      await createPlaylist({ nome, exibirNoPlayer, midiasIds });
      onSuccess();
      setSnackbarMessage("Playlist criada com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      
      setNome("");
      setMidiasIds([]);
      setExibirNoPlayer(true);
      onClose();
    } catch (error) {
      console.error("Erro ao criar playlist:", error);
      setSnackbarMessage("Erro ao criar playlist.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Cadastrar Playlist</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Nome da Playlist"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Exibir no Player</InputLabel>
            <Select
              value={exibirNoPlayer ? "true" : "false"}
              onChange={(e) => setExibirNoPlayer(e.target.value === "true")}
            >
              <MenuItem value="true">Sim</MenuItem>
              <MenuItem value="false">Não</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Mídias</InputLabel>
            <Select
              multiple
              value={midiasIds}
              onChange={(e) => setMidiasIds(e.target.value as string[])}
              input={<OutlinedInput label="Mídias" />}
              renderValue={(selected) =>
                medias
                  .filter((m) => selected.includes(m.id))
                  .map((m) => m.name)
                  .join(", ")
              }
            >
              {medias.map((media) => (
                <MenuItem key={media.id} value={media.id}>
                  <Checkbox checked={midiasIds.includes(media.id)} />
                  <ListItemText primary={media.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

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