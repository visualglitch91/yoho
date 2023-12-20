import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Add } from "@mui/icons-material";
import {
  Box,
  Chip,
  Stack,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { api } from "$common/utils";
import CenteredMessage from "$common/CenteredMessage";
import PageLayout from "$common/PageLayout";
import SelectField from "$common/SelectField";
import useModal from "$common/hooks/useModal";
import Poster from "$common/Poster";
import DataGrid from "$common/DataGrid";
import { Game, Status } from "./types";
import UploadDialog from "./UploadDialog";

const scraperStatusColors = {
  idle: "success",
  "scraping-all": "warning",
  "scraping-game": "warning",
  unkown: "error",
} as const;

export default function RG351P() {
  const mount = useModal();
  const [platform, setPlatform] = useState("NONE");

  const $status = useQuery({
    queryKey: ["RG351P", "Status"],
    queryFn: () => api.get("/rg351p/status").then((res) => res.data as Status),
    refetchInterval: 5_000,
  });

  const mounted = $status?.data?.mounted || false;
  const platforms = $status?.data?.platforms || [];
  const scraperStatus = $status.data?.scraperStatus || "unkown";

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
      const platform = window.localStorage.getItem("rg351p_platform");

      if (platform && platforms.some((it) => it.name === platform)) {
        setPlatform(platform);
      }
    } else {
      setPlatform("NONE");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    if (platform !== "NONE") {
      window.localStorage.setItem("rg351p_platform", platform);
    }
  }, [platform]);

  return (
    <PageLayout
      title={<>RG351P </>}
      actions={
        $status.data ? (
          $status.data.mounted ? (
            <>
              {scraperStatus !== "idle" && (
                <Chip
                  color={scraperStatusColors[scraperStatus]}
                  label={scraperStatus.split("-").join(" ")}
                  sx={{ textTransform: "capitalize" }}
                />
              )}
              <Box flexGrow={{ xs: 1, md: "unset" }}>
                <SelectField
                  sx={{ width: { xs: "100%", md: 200 } }}
                  value={platform}
                  onChange={(event) => setPlatform(event.target.value)}
                  options={[
                    {
                      label: "Select a Platform",
                      value: "NONE",
                      disabled: true,
                    },
                    ...platforms
                      .filter((it) => it.enabled)
                      .map((it) => ({
                        label: it.name,
                        value: it.name,
                      })),
                  ]}
                />
              </Box>
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
        ) : null
      }
    >
      {$status.isLoading ? (
        <CenteredMessage>
          <CircularProgress color="primary" />
        </CenteredMessage>
      ) : !mounted ? (
        <CenteredMessage>
          <Alert icon={false}>
            RG351P is not mounted. Please mount it to list its games.
          </Alert>
        </CenteredMessage>
      ) : (
        <DataGrid
          sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
          rowHeight={88}
          getRowId={(row) => row.path}
          rows={mounted ? $games.data || [] : []}
          initialState={{
            sorting: { sortModel: [{ field: "title", sort: "asc" }] },
          }}
          columns={[
            {
              field: "name",
              headerName: "Title",
              flex: 1,
              renderCell: ({ row }) => (
                <Stack spacing={2} direction="row" alignItems="center">
                  <Poster
                    height={60}
                    objectFit="contain"
                    src={
                      row.image
                        ? `/api/rg351p/platform/${
                            row.platform
                          }/media?path=${encodeURIComponent(
                            row.image.replace("/screenshots/", "/covers/")
                          )}`
                        : ""
                    }
                  />
                  <span>{row.name}</span>
                </Stack>
              ),
            },
          ]}
        />
      )}
    </PageLayout>
  );
}
