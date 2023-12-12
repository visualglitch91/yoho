import { ComponentOverride } from "../utils";

const MuiTextField: ComponentOverride["MuiTextField"] = {
  defaultProps: { fullWidth: true },
};

export default MuiTextField;
