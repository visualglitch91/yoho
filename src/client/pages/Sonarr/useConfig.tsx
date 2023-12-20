import { useQuery } from "@tanstack/react-query";
import { api } from "$common/utils";

export default function useConfig() {
  const $config = useQuery({
    queryKey: ["Sonarr", "QualityProfile"],
    queryFn: () => {
      return Promise.all([
        api.get("/sonarr/v3/qualityprofile").then(
          (res) =>
            res.data as {
              id: number;
              name: string;
            }[]
        ),
        api.get("/sonarr/v3/rootFolder").then((res) =>
          (
            res.data as {
              path: string;
            }[]
          ).map((it) => it.path)
        ),
      ]).then(([qualityProfiles, rootPaths]) => ({
        qualityProfiles,
        rootPaths,
      }));
    },
  });

  return $config.data;
}
