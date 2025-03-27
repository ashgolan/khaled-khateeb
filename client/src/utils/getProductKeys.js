export const getProductKeys = (obj, keysToApply) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keysToApply.includes(key))
  );
};
