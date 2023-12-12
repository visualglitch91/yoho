export interface Torrent {
  guid: string;
  title: string;
  indexer: string;
  indexerId: string;
  seeders: number;
  leechers: number;
  age: number;
  size: number;
  categories: { name: string }[];
}
