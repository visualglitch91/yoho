import { ComponentOverride } from "../utils";

const MuiOutlinedInput: ComponentOverride["MuiOutlinedInput"] = {
  styleOverrides: {
    notchedOutline: () => ({
      "& > legend": { display: "none" },
    }),
  },
};

export default MuiOutlinedInput;
