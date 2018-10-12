const sequelize = require('sequelize');

module.exports = {
  /**
   * Checks whether the given object is a Sequelize's ValidatinError instance
   * @param {Error} error
   */
  isValidationError(error) {
    return error instanceof sequelize.ValidationError;
  },
  /**
   * Transforms the validation error into a simpler object whose keys are properties with errors and
   * the its values are just the first of the errors for that property, as an object with message
   * and validatorName keys.
   * @param {ValidationError} error a validation error from Sequelize write operations
   * @returns Object<String,Object>
   */
  getFirstErrors(error) {
    const { errors } = error;
    return errors.reduce(
      (firstErrors, propError) => {
        if (firstErrors[propError.path]) return firstErrors;
        firstErrors[propError.path] = { // eslint-disable-line no-param-reassign
          message: propError.message,
          validatorName: propError.validatorName,
        };
        return firstErrors;
      },
      {},
    );
  },
};
