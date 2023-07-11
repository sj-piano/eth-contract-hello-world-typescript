/* Warning
- config.js imports utils.js, so utils.js cannot import config.js.
*/

function getMethods(obj: any): string[] {
  const properties = new Set<string>();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).forEach((item) =>
      properties.add(item)
    );
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties].filter((item) => typeof obj[item] === "function");
}

function isNumericString(value: any): boolean {
  if (typeof value !== "string") {
    return false;
  }
  value = value.trim();
  return !isNaN(value) && !isNaN(parseFloat(value));
}

function validateNumericString(options: {
  name: string;
  value: string;
}): string {
  const { name, value } = options;
  if (typeof value !== "string") {
    throw new Error(
      `Received invalid value type for ${name}: value=${value}, type=${typeof value}`
    );
  }
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    throw new Error(`Received empty or whitespace-only string for ${name}`);
  }
  if (!isNumericString(trimmedValue)) {
    let msg = `Received non-numeric string for ${name}: ${trimmedValue}`;
    msg +=
      `, !isNaN(value)=${!isNaN(trimmedValue as any)}, ` +
      `!isNaN(parseFloat(value))=${!isNaN(parseFloat(trimmedValue))}`;
    throw new Error(msg);
  }
  return trimmedValue;
}

export {
  getMethods,
  isNumericString,
  validateNumericString,
}
