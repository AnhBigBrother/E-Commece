class AppError extends Error {
  constructor(message, code, success) {
    super(message);
    this.code = code;
    this.success = success;
  }
}

export default AppError;
