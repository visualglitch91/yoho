export interface Platform {
  name: string;
  enabled: boolean;
}

export interface Status {
  mounted: boolean;
  platforms: Platform[];
  scraperStatus: "idle" | "scraping-game" | "scraping-all";
}

export interface Game {
  name: string;
  path: string;
  platform: string;
  thumbnail?: string;
}
