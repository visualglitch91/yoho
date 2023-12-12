import { ComponentOverride } from "../utils";

const MuiOutlinedInput: ComponentOverride["MuiOutlinedInput"] = {
  styleOverrides: {
    notchedOutline: {
      top: 0,
      "& > legend": { display: "none" },
    },
  },
};

export default MuiOutlinedInput;
