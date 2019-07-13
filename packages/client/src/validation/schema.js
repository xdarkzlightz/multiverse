import Joi from "joi-browser";
import name from "./name";
import password from "./password";
import port from "./port";
import path from "./path";
import volume from "./volume";

export default Joi.object().keys({
  name,
  password,
  port: port.required(),
  path,
  auth: Joi.boolean().required(),
  http: Joi.boolean().required(),
  volumes: Joi.array()
    .items(volume)
    .required(),
  ports: Joi.array()
    .items(port)
    .required()
});
