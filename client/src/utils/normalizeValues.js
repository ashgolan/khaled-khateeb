// export const normalizeValues = (values) => {
//     const normalizedValues = { ...values };    
//     // List of keys to normalize
//     const keysToNormalize = ['quantity', 'number', 'water', 'workPrice', 'weightKind'];
    
//     keysToNormalize.forEach((key) => {
//         if (normalizedValues[key] !== undefined) { // Check if the key exists in the object
//             normalizedValues[key] =
//             normalizedValues[key] === "" || isNaN(normalizedValues[key])
//             ? 0
//             : parseFloat(normalizedValues[key].trim());
//         }
//     });
  
//     return normalizedValues;
//   };