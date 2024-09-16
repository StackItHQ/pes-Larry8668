const Joi = require("joi");

const syncSchema = Joi.object({
  range: Joi.string().required(),
  newValue: Joi.any().required(),
  oldValue: Joi.any().required(),
  spreadsheetId: Joi.string().required(),
  spreadsheetName: Joi.string().required(),
  spreadsheetOwner: Joi.string().email().required(),
  creationDate: Joi.string().required(),
  userEmail: Joi.string().email().required(),
  userRole: Joi.string().required(),
  localTimestamp: Joi.string().required(),
  timestamp: Joi.date().required(),
  row: Joi.number().required(),
  column: Joi.number().required(),
  sheetId: Joi.number().required(),
  sheetName: Joi.string().required(),
  sheetUrl: Joi.string().uri().required(),
  changeType: Joi.string().required(),
  action: Joi.string().valid("create", "update", "delete").required(),
});

module.exports = {
  syncSchema,
};
