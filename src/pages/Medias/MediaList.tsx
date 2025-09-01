import { useState, useEffect } from "react";
import { Container, Typography, TextField, Box, Button, IconButton, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getMedias } from "../../api/mediaApi";
import { deleteMedia } from "../../api/mediaApi";
import MediaModal from "../../components/MediaModal";

interface Media {
  id?: string;          // opcional ao criar
  name: string;
  description: string;
  filePath: string;
  fileType: string;
  createdAt?: string;   // opcional
}

export default function MediaList() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [filter, setFilter] = useState("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | undefined>(undefined);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleModalSuccess = (savedMedia: Media) => {
    setMedias((prev) => {
      const exists = prev.find((m) => m.id === savedMedia.id);
      if (exists) {
        return prev.map((m) => (m.id === savedMedia.id ? savedMedia : m));
      } else {
        return [savedMedia, ...prev];
      }
    });
    setSnackbarMessage(`Mídia "${savedMedia.name}" salva com sucesso!`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

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

  const filteredMedias = medias.filter(
    (media) =>
      (media.name ?? "").toLowerCase().includes(filter.toLowerCase()) ||
      (media.description ?? "").toLowerCase().includes(filter.toLowerCase()) ||
      (media.filePath ?? "").toLowerCase().includes(filter.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "description", headerName: "Descrição", flex: 1 },
    { field: "filePath", headerName: "Arquivo", flex: 1 },
    { field: "createdAt", headerName: "Data de Criação", width: 180 },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const handleEdit = (media: Media) => {
          setSelectedMedia(media);
          setModalOpen(true);
        };

        const handleDelete = async () => {
          const confirmed = window.confirm(`Deseja realmente excluir a mídia "${params.row.name}"?`);
          if (!confirmed) return;

          try {
            await deleteMedia(params.row.id);
            setMedias((prev) => prev.filter((m) => m.id !== params.row.id));
            setSnackbarMessage(`Mídia "${params.row.name}" excluída com sucesso!`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } catch (error) {
            console.error("Erro ao deletar mídia:", error);
            setSnackbarMessage("Erro ao deletar a mídia. Tente novamente.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        };

        return (
          <>
            <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleCadastrar = () => {
    setSelectedMedia(undefined);
    setModalOpen(true);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Mídias
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          label="Filtrar Mídias"
          variant="outlined"
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleCadastrar}>
          Cadastrar Mídia
        </Button>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredMedias}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </div>
      <MediaModal
        open={modalOpen}
        media={selectedMedia}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

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
    </Container>
  );
}