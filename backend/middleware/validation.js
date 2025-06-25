const { body, validationResult } = require("express-validator");

// Validation middleware for station coordinates
const validateCoordinates = [
  body("location.latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"),

  body("location.longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }
    next();
  },
];

// Validation middleware for bounding box parameters
const validateBounds = [
  body("west")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("West bound must be a number between -180 and 180"),

  body("south")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("South bound must be a number between -90 and 90"),

  body("east")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("East bound must be a number between -180 and 180"),

  body("north")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("North bound must be a number between -90 and 90"),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateCoordinates,
  validateBounds,
};
