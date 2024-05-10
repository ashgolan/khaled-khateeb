export const getProductKeys = (obj, keysToApply) => {
  Object.keys(obj).forEach((key) => {
    if (!keysToApply.includes(key)) {
      delete obj[key];
    }
  });
  return obj;
};
