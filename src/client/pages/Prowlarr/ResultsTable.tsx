import { GridColDef } from "@mui/x-data-grid";
import { humanizeBytes } from "$common/utils";
import DataGrid from "$common/DataGrid";
import { Torrent } from "./types";
import DownloadButton from "./DownloadButton";

const columns: GridColDef[] = [
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <>{params.value} days</>,
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    minWidth: 300,
    renderCell: (params) => (
      <a href={params.row.guid} target="_blank" style={{ color: "inherit" }}>
        {params.value}
      </a>
    ),
  },
  {
    field: "indexer",
    headerName: "Indexer",
    width: 200,
  },
  {
    field: "size",
    headerName: "Size",
    type: "number",
    width: 140,
    renderCell: (params) => <>{humanizeBytes(params.value)}</>,
  },
  {
    field: "category",
    headerName: "Category",
    type: "string",
    width: 180,
    valueGetter: (params) => params.row.categories[0].name,
  },
  {
    field: "seeders",
    headerName: "Peers",
    type: "string",
    width: 110,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => (
      <>
        {params.value} / {params.row.leechers}
      </>
    ),
  },
  {
    field: "actions",
    headerName: "",
    type: "actions",
    renderCell: (params) => <DownloadButton torrent={params.row} />,
  },
];

export default function ResultsTable({ data }: { data: Torrent[] }) {
  return (
    <DataGrid
      enableColumnMenu
      enableColumnFilter
      getRowId={(it) => it.guid}
      rows={data}
      columns={columns}
      initialState={{
        sorting: { sortModel: [{ field: "seeders", sort: "desc" }] },
      }}
    />
  );
}
