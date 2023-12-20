import {
  GridValidRowModel,
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps,
} from "@mui/x-data-grid";
import AutoSizer from "react-virtualized-auto-sizer";

export default function DataGrid<R extends GridValidRowModel = any>({
  rowSelection = false,
  disableAutoPageSize,
  enableColumnMenu,
  enableColumnFilter,
  enableColumnSelector,
  ...props
}: Omit<
  MuiDataGridProps<R>,
  | "autoPageSize"
  | "disableColumnMenu"
  | "disableColumnFilter"
  | "disableColumnSelector"
> & {
  disableAutoPageSize?: boolean;
  enableColumnMenu?: boolean;
  enableColumnFilter?: boolean;
  enableColumnSelector?: boolean;
}) {
  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <div style={{ width, height }}>
            <MuiDataGrid
              {...props}
              sx={{ height: height - 1 }}
              autoPageSize={!disableAutoPageSize}
              rowSelection={rowSelection}
              disableColumnMenu={!enableColumnMenu}
              disableColumnFilter={!enableColumnFilter}
              disableColumnSelector={!enableColumnSelector}
            />
          </div>
        );
      }}
    </AutoSizer>
  );
}
