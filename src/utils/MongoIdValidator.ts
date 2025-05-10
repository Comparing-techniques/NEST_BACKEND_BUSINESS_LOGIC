export const isValidMongoId = (id: string): boolean => {
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

  return mongoIdRegex.test(id);
};
