import { ComponentOverride } from "../utils";

const MuiFormControl: ComponentOverride["MuiFormControl"] = {
  styleOverrides: {
    root: () => ({
      "& .MuiInputLabel-root": {
        marginBottom: 7,
      },
      "& .MuiFormHelperText-root": {
        marginLeft: 0,
      },
    }),
  },
  defaultProps: {},
};

export default MuiFormControl;
