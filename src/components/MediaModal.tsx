import { Dialog, DialogTitle, DialogContent, Snackbar, Alert } from "@mui/material";
import MediaForm from "../pages/Medias/MediaForm";
import { updateMedia, createMedia } from "../api/mediaApi";
import { useState } from "react";

interface Media {
  id?: string;
  name: string;
  description: string;
  filePath: string;
  fileType: string;
  createdAt?: string;
}

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  media?: Media;
  onSuccess: (media: Media) => void;
}

export default function MediaModal({ open, onClose, media, onSuccess }: MediaModalProps) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleSubmit = async (data: Media) => {
    try {
      let savedMedia;
      if (data.id) {
        savedMedia = await updateMedia(data.id, {
          name: data.name,
          description: data.description || "",
          filePath: data.filePath,
          fileType: data.fileType,
        });
      } else {
        savedMedia = await createMedia({
          name: data.name,
          description: data.description || "",
          filePath: data.filePath,
          fileType: data.fileType,
        });
      }

      onSuccess(savedMedia);
      setSnackbarMessage("Mídia salva com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar mídia:", error);
      setSnackbarMessage("Erro ao salvar mídia. Tente novamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{media ? "Editar Mídia" : "Cadastrar Mídia"}</DialogTitle>
        <DialogContent>
          <MediaForm media={media} onSubmit={handleSubmit} onClose={onClose} />
        </DialogContent>
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