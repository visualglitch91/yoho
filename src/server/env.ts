import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const { parsed } = dotenvExpand.expand(dotenv.config());

const env = { ...import.meta.env, ...parsed };

export default env!;
