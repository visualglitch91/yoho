import { ComponentOverride } from "../utils";

const MuiTextField: ComponentOverride["MuiTextField"] = {
  defaultProps: { size: "small", fullWidth: true },
};

export default MuiTextField;
