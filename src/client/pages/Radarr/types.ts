export interface Movie {
  id: string;
  title: string;
  downloading: boolean;
  qualityProfileId: number;
  hasFile: boolean;
  monitored: boolean;
  rootFolderPath?: string;
  images: {
    coverType: string;
    remoteUrl: string;
  }[];
}
