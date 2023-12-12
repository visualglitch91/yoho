import { useQuery } from "@tanstack/react-query";
import { api } from "$common/utils";

export default function useQualityProfiles() {
  const $qualityProfile = useQuery({
    queryKey: ["Radarr", "QualityProfile"],
    queryFn: () => {
      return api.get("/radarr/v3/qualityprofile").then(
        (res) =>
          res.data as {
            id: number;
            name: string;
          }[]
      );
    },
  });

  return $qualityProfile.data;
}
