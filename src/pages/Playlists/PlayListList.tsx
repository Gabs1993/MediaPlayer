import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TextField,
    Box,
    Button,
    IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getPlaylists, removeMidiaFromPlaylist } from "../../api/playlistApi";
import AddMediaToPlaylistModal from "../../components/AddMediaToPlaylistModal";
import PlaylistModal from "../../components/PlaylistModal";

interface Media {
    id: string;
    name: string;
    description: string;
    filePath: string;
}

interface Playlist {
    id: string;
    nome: string;
    exibirNoPlayer: boolean;
    midias?: Media[];
}

interface RowData {
    id: string;
    isMediaRow?: boolean;
    playlistId?: string;
    mediaId?: string;
    name?: string;
    description?: string;
    filePath?: string;
    exibirNoPlayer?: boolean;
}

export default function PlaylistList() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [filter, setFilter] = useState("");
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 5,
        page: 0,
    });
    const [expandedPlaylists, setExpandedPlaylists] = useState<Set<string>>(new Set());
    const [addMediaModalOpen, setAddMediaModalOpen] = useState(false);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);


    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const data = await getPlaylists();
                setPlaylists(data);
            } catch (error) {
                console.error("Erro ao buscar playlists:", error);
            }
        };

        fetchPlaylists();
    }, []);

    const toggleExpand = (playlistId: string) => {
        setExpandedPlaylists((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(playlistId)) newSet.delete(playlistId);
            else newSet.add(playlistId);
            return newSet;
        });
    };

    const filteredPlaylists = playlists.filter((playlist) =>
        playlist.nome.toLowerCase().includes(filter.toLowerCase())
    );

    const getRows = (): RowData[] => {
        const rows: RowData[] = [];
        filteredPlaylists.forEach((playlist) => {
            rows.push({
                id: playlist.id,
                name: playlist.nome,
                exibirNoPlayer: playlist.exibirNoPlayer,
            });

            if (expandedPlaylists.has(playlist.id) && playlist.midias) {
                playlist.midias.forEach((media) => {
                    rows.push({
                        id: `${playlist.id}-${media.id}`, // ID único combinando playlist + media
                        isMediaRow: true,
                        playlistId: playlist.id,
                        mediaId: media.id,
                        name: media.name,
                        description: media.description,
                        filePath: media.filePath,
                    });
                });
            }
        });
        return rows;
    };

    const getRowCount = () => {
        return filteredPlaylists.length;
    };

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Nome",
            flex: 1,
            renderCell: (params) => {
                if (params.row.isMediaRow) {
                    return <span style={{ paddingLeft: 24 }}>{params.row.name}</span>;
                } else {
                    return <span>{params.row.name}</span>;
                }
            },
        },
        {
            field: "exibirNoPlayer",
            headerName: "Exibir no Player",
            width: 150,
            renderCell: (params) => (!params.row.isMediaRow ? (params.value ? "Sim" : "Não") : null),
        },
        {
            field: "actions",
            headerName: "Ações",
            width: 180,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                // Linha de mídia: deletar
                if (params.row.isMediaRow) {
                    return (
                        <IconButton
                            size="small"
                            color="error"
                            onClick={async () => {
                                if (!confirm(`Deseja remover a mídia "${params.row.name}" desta playlist?`)) return;
                                try {
                                    await removeMidiaFromPlaylist(params.row.playlistId!, params.row.mediaId!);
                                    setPlaylists((prev) =>
                                        prev.map((p) =>
                                            p.id === params.row.playlistId
                                                ? { ...p, midias: p.midias?.filter((m) => m.id !== params.row.mediaId) }
                                                : p
                                        )
                                    );
                                    alert("Mídia removida da playlist com sucesso!");
                                } catch (error) {
                                    console.error(error);
                                    alert("Erro ao remover mídia da playlist.");
                                }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    );
                }
                return (
                    <>
                        <IconButton onClick={() => toggleExpand(params.row.id)}>
                            {expandedPlaylists.has(params.row.id) ? "▲" : "▼"}
                        </IconButton>
                        <IconButton
                            color="primary"
                            onClick={() => {
                                setSelectedPlaylistId(params.row.id);
                                setAddMediaModalOpen(true);
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Lista de Playlists
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
                    label="Filtrar Playlists"
                    variant="outlined"
                    size="small"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setPlaylistModalOpen(true)}
                >
                    Cadastrar Playlist
                </Button>
            </Box>

            <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={getRows()}
                    columns={columns}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                    rowCount={getRowCount()} 
                    paginationMode="server"
                />
            </div>
            {selectedPlaylistId && (
                <AddMediaToPlaylistModal
                    open={addMediaModalOpen}
                    onClose={() => setAddMediaModalOpen(false)}
                    playlistId={selectedPlaylistId}
                    onSuccess={(media) => {
                        const m = media as unknown as Media;
                        setPlaylists((prev) =>
                            prev.map((p) =>
                                p.id === selectedPlaylistId
                                    ? { ...p, midias: [...(p.midias || []), m] }
                                    : p
                            )
                        );
                    }}
                />
            )}
            <PlaylistModal
                open={playlistModalOpen}
                onClose={() => setPlaylistModalOpen(false)}
                onSuccess={async () => {
                    const data = await getPlaylists();
                    setPlaylists(data);
                }}
            />
        </Container>
    );
}