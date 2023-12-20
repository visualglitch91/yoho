import { ComponentOverride } from "../utils";

const MuiOutlinedInput: ComponentOverride["MuiOutlinedInput"] = {
  styleOverrides: {
    root: {
      height: 38,
    },
    sizeSmall: {
      height: 31,
    },
    notchedOutline: {
      top: 0,
      "& > legend": { display: "none" },
    },
  },
};

export default MuiOutlinedInput;
