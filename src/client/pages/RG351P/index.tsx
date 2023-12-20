import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { CircularProgress, Button } from "@mui/material";
import { api } from "$common/utils";
import CenteredMessage from "$common/CenteredMessage";
import PageLayout from "$common/PageLayout";
import SelectField from "$common/SelectField";
import useModal from "$common/hooks/useModal";
import { Game, Status } from "./types";
import UploadDialog from "./UploadDialog";

export default function RG351P() {
  const mount = useModal();
  const [platform, setPlatform] = useState("NONE");

  const $status = useQuery({
    queryKey: ["RG351P", "Status"],
    queryFn: () => api.get("/rg351p/status").then((res) => res.data as Status),
    refetchInterval: 1_000,
  });

  const mounted = $status?.data?.mounted || false;

  const $games = useQuery({
    enabled: platform !== "NONE",
    queryKey: ["RG351P", "Platform", platform, "Games"],
    queryFn: () =>
      api
        .get(`/rg351p/platform/${platform}/games`)
        .then((res) => res.data as Game[]),
  });

  const $$mount = useMutation({
    mutationFn: () => api.post(`/rg351p/mount`),
    onError: (error) => console.log(error),
    onSuccess: () => $status.refetch(),
  });

  useEffect(() => {
    if (mounted) {
      setPlatform("NONE");
    }
  }, [mounted]);

  return (
    <PageLayout
      title="RG351P"
      actions={
        $status.data && $status.data.mounted ? (
          <>
            <div>
              <SelectField
                sx={{ width: 200 }}
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                options={[
                  {
                    label: "Select a Platform",
                    value: "NONE",
                    disabled: true,
                  },
                  ...$status.data.platforms
                    .filter((it) => it.enabled)
                    .map((it) => ({
                      label: it.name,
                      value: it.name,
                    })),
                ]}
              />
            </div>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => {
                mount((props) => (
                  <UploadDialog
                    {...props}
                    platforms={$status.data?.platforms || []}
                    defaultPlatform={platform}
                    onUpload={() => $games.refetch()}
                  />
                ));
              }}
            >
              Upload
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            disabled={$$mount.isPending}
            onClick={() => $$mount.mutate()}
          >
            Mount
          </Button>
        )
      }
    >
      {$status.isLoading ? (
        <CenteredMessage>
          <CircularProgress color="primary" />
        </CenteredMessage>
      ) : (
        <DataGrid
          sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
          autoPageSize
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          rowSelection={false}
          rowHeight={60}
          getRowId={(row) => row.path}
          rows={$games.data || []}
          initialState={{
            sorting: { sortModel: [{ field: "title", sort: "asc" }] },
          }}
          columns={[
            {
              field: "name",
              headerName: "Title",
              flex: 1,
            },
          ]}
        />
      )}
    </PageLayout>
  );
}
