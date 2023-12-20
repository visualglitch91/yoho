import { Stack, Button, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (search: string) => void;
}) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ mb: 2 }}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(e.currentTarget.search.value);
      }}
    >
      <TextField
        fullWidth
        placeholder="Search"
        name="search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <button type="submit" style={{ display: "none" }} />
      <Button
        variant="outlined"
        sx={{ flexShrink: 0 }}
        onClick={(e) => {
          const searchField = e.currentTarget
            .closest("form")
            ?.querySelector<HTMLInputElement>('[name="search"]');

          if (searchField) {
            searchField.value = "";
          }

          onSearch("");
        }}
      >
        Clear
      </Button>
    </Stack>
  );
}
