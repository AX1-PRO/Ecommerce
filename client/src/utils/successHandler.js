const successHandler = (response) => {
  if (response?.message) {
    return response.message;
  }
  return "Operation completed successfully";
};

export default successHandler;