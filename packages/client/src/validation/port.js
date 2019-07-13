import Joi from "joi-browser";

const port = /^[0-9]{4}:[0-9]{4}$/;
const schema = Joi.string()
  .label("Port")
  .trim()
  .regex(port)
  .error(errs => {
    const err = errs[0];
    const label = err.context.label;

    switch (err.type) {
      case "any.empty":
        throw new Error(`${label} cannot be empty`);
      case "string.regex.base":
        throw new Error(
          `Invalid ${label}, port mappings must be formatted like "8443:8443"`
        );
      default:
        console.log(err.stack);
        throw new Error(err.message);
    }
  });

export default schema;
