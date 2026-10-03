const errorHandler = (error) => {
  const data = error?.response?.data || error;

  // رسالة عادية
  if (data?.message) {
    return {
      message: data.message,
    };
  }

  // express-validator
  if (Array.isArray(data?.errors)) {
    return data.errors.reduce((acc, err) => {
      acc[err.path] = err.msg;
      return acc;
    }, {});
  }

  return {
    message: "Something went wrong",
  };
};

export default errorHandler;