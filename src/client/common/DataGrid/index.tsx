import { forwardRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  GridValidRowModel,
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps,
} from "@mui/x-data-grid";
import { SxProps, sxx } from "$common/theme/utils";
import Footer from "./Footer";

const cursorPointerStyle: SxProps = {
  "& .MuiDataGrid-row": { cursor: "pointer" },
};

const EmptyHeader = forwardRef(() => null);

export default function DataGrid<R extends GridValidRowModel = any>({
  sx = {},
  rowSelection = false,
  cursorPointer = false,
  disableHeaders = false,
  disableAutoPageSize,
  enableColumnMenu,
  enableColumnFilter,
  enableColumnSelector,
  ...props
}: Omit<
  MuiDataGridProps<R>,
  | "sx"
  | "autoPageSize"
  | "disableColumnMenu"
  | "disableColumnFilter"
  | "disableColumnSelector"
> & {
  sx?: SxProps;
  cursorPointer?: boolean;
  disableHeaders?: boolean;
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
              sx={sxx(
                { height: height - 1 },
                cursorPointer && cursorPointerStyle,
                sx
              )}
              slots={{
                footer: Footer,
                columnHeaders: disableHeaders ? EmptyHeader : undefined,
              }}
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
