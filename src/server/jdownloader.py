import myjdapi


class API:
    def __init__(self, email, password, device_name):
        self.email = email
        self.password = password
        self.device_name = device_name
        self.connected = False
        self.jd = myjdapi.Myjdapi()
        self.device = None

    def connect(self):
        try:
            print("Connecting to MyJDownloader...")
            self.jd.connect(self.email, self.password)
            self.jd.update_devices()
            self.device = self.jd.get_device(self.device_name)
            self.connected = True
            print("Device connected successfully.")
            return True
        except myjdapi.exception.MYJDException as e:
            self.connected = False
            print(f"Connection failed: {e}")
            return False

    def get_links(self):
        try:
            if not self.connected:
                self.connect()
                if not self.connected:
                    return None

            print("Getting links...")

            downloads = self.device.downloads.query_links()
            linkgrabber = self.device.linkgrabber.query_links()

            merged_links = []
            merged_links.extend(downloads)
            merged_links.extend(linkgrabber)

            return merged_links
        except myjdapi.exception.MYJDException as e:
            self.connected = False
            print(f"Error fetching links: {e}")
            return None

    def add_link(self, url):
        try:
            if not self.connected:
                self.connect()
                if not self.connected:
                    return False

            print("Adding url %s", url)

            self.device.linkgrabber.add_links([
                {"autostart": True, "links": url}
            ])
            return True
        except myjdapi.exception.MYJDException as e:
            self.connected = False
            print(f"Error adding link: {e}")
            return False

    def delete_links(self, link_ids):
        try:
            print("Deleting ids", link_ids)

            if not self.connected:
                self.connect()
                if not self.connected:
                    return False

            self.device.linkgrabber.remove_links(link_ids=link_ids)
            self.device.downloads.remove_links(link_ids=link_ids)
            return True
        except myjdapi.exception.MYJDException as e:
            self.connected = False
            print(f"Error deleting links: {e}")
            return False
