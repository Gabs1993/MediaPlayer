import { Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";

interface Media {
  id?: string;
  name: string;
  description: string;
  filePath: string;
  fileType: string;
  createdAt?: string;
}

interface MediaFormProps {
  media?: Media;
  onSubmit: (data: Media) => void | Promise<void>;
  onClose: () => void;
}

export default function MediaForm({ media, onSubmit, onClose }: MediaFormProps) {
  const formik = useFormik<Media>({
    initialValues: {
      id: media?.id,
      name: media?.name || "",
      description: media?.description || "",
      filePath: media?.filePath || "",
      fileType: media?.fileType || "",
      createdAt: media?.createdAt,
    },
    enableReinitialize: true, 
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2} mt={1}>

        <TextField
          label="Nome"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          required
        />

        <TextField
          label="Descrição"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          multiline
          rows={3}
        />

        <TextField
          label="URL do Arquivo"
          name="filePath"
          value={formik.values.filePath}
          onChange={formik.handleChange}
          required
        />
        <TextField
          label="tipo do arquivo"
          name="fileType"
          value={formik.values.fileType}
          onChange={formik.handleChange}
          required
        />

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button type="button" color="inherit" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {media ? "Salvar Alterações" : "Cadastrar"}
          </Button>
        </Box>
      </Box>
    </form>
  );
}