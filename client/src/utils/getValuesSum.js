export const getSumOfValues = (obj) => {
  console.log(obj);
  
  return Object.values(obj).reduce((acc, curr) => acc + curr, 0);
};
