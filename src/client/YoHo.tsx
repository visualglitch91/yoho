import { Redirect, Route, Switch } from "wouter";
import { Box } from "@mui/material";
import {
  Movie as MovieIcon,
  LiveTv as LiveTvIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  VideogameAsset,
} from "@mui/icons-material";
import Layout from "$common/Layout";
import Radarr from "$pages/Radarr";
import Sonarr from "$pages/Sonarr";
import Prowlarr from "$pages/Prowlarr";
import Transmission from "$pages/Transmission";
import JDownloader from "$pages/JDownloader";
import NSwitch from "$pages/NSwitch";
import RG351P from "$pages/RG351P";

const DefaultRoute = () => <Redirect to="/radarr" />;

export default function YoHo() {
  return (
    <Layout
      menu={[
        {
          title: "Movies",
          to: "/radarr",
          icon: <MovieIcon />,
        },
        {
          title: "TV Shows",
          to: "/sonarr",
          icon: <LiveTvIcon />,
        },
        {
          title: "Nintentdo Switch",
          to: "/switch",
          icon: (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="1.5rem"
              height="1.5rem"
            >
              <img src="/icons/switch-white.png" style={{ width: "1.2rem" }} />
            </Box>
          ),
        },
        {
          title: "RG351P",
          to: "/rg351p",
          icon: <VideogameAsset />,
        },
        {
          title: "Torrent Search",
          to: "/prowlarr",
          icon: <SearchIcon />,
        },
        {
          title: "Torrent Downloads",
          to: "/transmission",
          icon: <DownloadIcon />,
        },
        {
          title: "Web Downloads",
          to: "/jdownloader",
          icon: (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="1.5rem"
              height="1.5rem"
            >
              <img
                src="/icons/jdownloader-white.png"
                style={{ width: "1.3rem" }}
              />
            </Box>
          ),
        },
      ]}
    >
      <Switch>
        <Route path="/radarr" component={Radarr} />
        <Route path="/sonarr" component={Sonarr} />
        <Route path="/prowlarr" component={Prowlarr} />
        <Route path="/transmission" component={Transmission} />
        <Route path="/jdownloader" component={JDownloader} />
        <Route path="/switch" component={NSwitch} />
        <Route path="/rg351p" component={RG351P} />
        <Route path="/" component={DefaultRoute} />
      </Switch>
    </Layout>
  );
}
