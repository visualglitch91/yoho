export interface Platform {
  name: string;
  enabled: boolean;
}

export interface Status {
  mounted: boolean;
  platforms: Platform[];
}

export interface Game {
  name: string;
  path: string;
}
