import { humanizeBytes } from "$common/utils";
import DataGrid from "$common/DataGrid";
import useIsMobile from "$common/hooks/usIsMobile";
import { Torrent } from "./types";
import DownloadButton from "./DownloadButton";
import MobileCard from "./MobileCard";

export default function ResultsTable({ data }: { data: Torrent[] }) {
  const isMobile = useIsMobile();

  return (
    <DataGrid
      enableColumnMenu
      enableColumnFilter
      disableHeaders={isMobile}
      getRowId={(it) => it.guid}
      rows={data}
      rowHeight={isMobile ? 110 : 52}
      columns={
        isMobile
          ? [
              {
                flex: 1,
                field: "seeders",
                headerName: "Torrent",
                renderCell: ({ row }) => <MobileCard torrent={row} />,
              },
            ]
          : [
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
                  <a
                    href={params.row.guid}
                    target="_blank"
                    style={{ color: "inherit" }}
                  >
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
            ]
      }
      initialState={{
        sorting: { sortModel: [{ field: "seeders", sort: "desc" }] },
      }}
    />
  );
}
