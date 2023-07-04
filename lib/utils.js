/* Warning
- config.js imports utils.js, so utils.js cannot import config.js.
*/

// Functions

const getMethods = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item) => typeof obj[item] === "function"
  );
};

function isNumericString(value) {
  if (typeof value !== "string") {
    return false;
  }
  value = value.trim();
  return !isNaN(value) && !isNaN(parseFloat(value));
}

function validateNumericString({ name, value }) {
  if (typeof value !== "string") {
    throw new Error(
      `Received invalid value type for ${name}: value=${value}, type=${typeof value}`
    );
  }
  value = value.trim();
  if (value.length === 0) {
    throw new Error(`Received empty or whitespace-only string for ${name}`);
  }
  if (!isNumericString(value)) {
    let msg = `Received non-numeric string for ${name}: ${value}`;
    msg +=
      `, !isNaN(value)=${!isNaN(value)}, ` +
      `!isNaN(parseFloat(value))=${!isNaN(parseFloat(value))}`;
    throw new Error(msg);
  }
  return value;
}

// Exports
module.exports = {
  getMethods,
  isNumericString,
  validateNumericString,
};
