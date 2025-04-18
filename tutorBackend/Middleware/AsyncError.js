const asyncError = (asyncFunc) => (req, res, next) => {
  Promise.resolve(asyncFunc(req, res, next)).catch(next);
};

export default asyncError;