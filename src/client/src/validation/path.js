import Joi from "joi-browser";

const path = /^\/([\w-+.]+\/)*$/;
const schema = Joi.string()
  .label("Path")
  .trim()
  .regex(path)
  .required()
  .error(errs => {
    const err = errs[0];
    const label = err.context.label;

    switch (err.type) {
      case "any.empty":
        throw new Error(`${label} cannot be empty`);
      case "string.regex.base":
        throw new Error(
          `Invalid ${label}, paths have to be absolute "/home/foo/bar/"`
        );
      default:
        console.log(err.stack);
        throw new Error(err.message);
    }
  });

export default schema;
