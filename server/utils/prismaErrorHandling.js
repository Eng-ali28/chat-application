const createError = require("http-errors");
module.exports = (next, errorHandling, clientHandling, modelName, e) => {
  if (e instanceof errorHandling) {
    if (e.code == "P2000") {
      next(createError(400, `${e.field} Value is too long for this input.`));
    }
    if (e.code == "P2001") {
      next(
        createError(
          400,
          `The record searched ${e.field} for in the where condition does not exist`
        )
      );
    }
    if (e.code == "P2003") {
      next(createError(400, `The record ${e.meta.field_name} does not exist`));
    }
    if (e.code == "P2002") {
      if (Array.isArray(e.meta.target)) {
        next(createError(400, `${e.meta.target.join(",")} is exists`));
      } else next(createError(400, `${e.meta.target.split("_")[1]} is exists`));
    }
    if (e.code == "P2005") {
      next(
        createError(
          400,
          `The value ${e.value} stored in the database for the field ${e.field} is invalid for the field's type`
        )
      );
    }
    if (e.code == "P2012") {
      next(createError(400, `${e.field} is required.`));
    }
    if (e.code == "P2021") {
      next(createError(400, `model ${modelName} not exists`));
    }
    if (e.code == "P2025") {
      next(createError(400, `${modelName} with this id doesn't exists`));
    }
  }
  if (e instanceof clientHandling) {
    next(createError(400, `An argument for ${modelName} is missing. `));
  }
};
