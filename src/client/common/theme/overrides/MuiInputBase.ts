import { ComponentOverride } from "../utils";

const MuiInputBase: ComponentOverride["MuiInputBase"] = {
  defaultProps: { size: "small" },
};

export default MuiInputBase;
