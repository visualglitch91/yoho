export interface Movie {
  id: string;
  title: string;
  downloading: boolean;
  qualityProfileId: number;
  hasFile: boolean;
  images: {
    coverType: string;
    remoteUrl: string;
  }[];
}
