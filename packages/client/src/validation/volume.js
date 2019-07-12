import Joi from "joi-browser";

const volume = /^\/((?!-)[\w-.]+\/)*:\/((?!-)[\w-.]+\/)*$/;
const schema = Joi.string()
  .trim()
  .regex(volume)
  .error(errs => {
    const err = errs[0];
    const label = err.context.label;

    switch (err.type) {
      case "string.regex.base":
        throw new Error(
          `Invalid ${label}, volume mappings must be formatted like "/home/foo/bar/:/home/bar/foo"`
        );
      default:
        console.log(err.stack);
        throw new Error(err.message);
    }
  });

export default schema;
