import Joi from "joi-browser";

const name = /^[\w-.]+$/;
const schema = Joi.string()
  .label("Project Name")
  .trim()
  .replace(/\s/g, "-")
  .regex(name)
  .min(3)
  .max(20)
  .required()
  .error(errs => {
    const err = errs[0];
    const label = err.context.label;
    const limit = err.context.limit;

    switch (err.type) {
      case "any.empty":
        throw new Error(`${label} cannot be empty`);
      case "string.regex.base":
        throw new Error(
          `Invalid ${label}, only characters a-z A-Z _-. are allowed`
        );
      case "string.min":
        throw new Error(`${label} must be at least ${limit} characters long`);
      case "string.max":
        throw new Error(`${label} cannot be over ${limit} characters long`);
      default:
        console.log(err.stack);
        throw new Error(err.message);
    }
  });

export default schema;
