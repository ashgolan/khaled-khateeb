export const getSumOfValues = (obj = {}) => {
  return Object.values(obj).reduce((sum, val) => sum + Number(val || 0), 0);
};