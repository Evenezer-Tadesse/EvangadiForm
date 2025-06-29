export const safeSet = (key, value) => {
  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error saving to localStorage [${key}]`, error);
  }
};

export const safeGet = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item && item !== "undefined" ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage [${key}]`, error);
    return null;
  }
};
