import Joi from "joi-browser";

const schema = Joi.string()
  .label("Path")
  .trim()
  .required()
  .error(errs => {
    const err = errs[0];
    const label = err.context.label;

    switch (err.type) {
      case "any.empty":
        throw new Error(`${label} cannot be empty`);
      default:
        console.log(err.stack);
        throw new Error(err.message);
    }
  });

export default schema;
