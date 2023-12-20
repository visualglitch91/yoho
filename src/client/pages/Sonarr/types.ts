export interface Show {
  id: string;
  tvdbId: string;
  title: string;
  sortTitle: string;
  downloading: boolean;
  ended: boolean;
  images: {
    coverType: string;
    remoteUrl: string;
  }[];
  path: string;
  statistics: {
    episodeCount: number;
    episodeFileCount: number;
  };
  qualityProfileId?: number;
}
