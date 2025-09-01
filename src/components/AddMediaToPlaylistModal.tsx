import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getMedias } from "../api/mediaApi";
import { addMidiaToPlaylist } from "../api/playlistApi";

interface Media {
  id: string;
  name: string;
  description: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  playlistId: string;
  onSuccess: (media: Media) => void; 
}

export default function AddMediaToPlaylistModal({ open, onClose, playlistId, onSuccess }: Props) {
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  useEffect(() => {
    if (!open) return;

    const fetchMedias = async () => {
      try {
        setLoading(true);
        const data = await getMedias();
        setMedias(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedias();
  }, [open]);

  const handleAdd = async (media: Media) => {
    try {
      await addMidiaToPlaylist(playlistId, media.id);
      onSuccess(media);
      setSnackbarMessage(`Mídia "${media.name}" adicionada à playlist com sucesso!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Erro ao adicionar mídia na playlist.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Adicionar Mídia à Playlist</DialogTitle>
        <DialogContent>
          {loading ? (
            <p>Carregando mídias...</p>
          ) : (
            <List>
              {medias.map((media) => (
                <ListItem
                  key={media.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleAdd(media)}>
                      <AddIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={media.name} secondary={media.description} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
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
