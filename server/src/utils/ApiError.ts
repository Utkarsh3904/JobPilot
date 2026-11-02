export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message); // Error class ko message pass kiya
    this.statusCode = statusCode;
    
    // isOperational = true ka matlab ye ek expected error hai (jaise 404, 400). 
    // Agar false hota, toh matlab server crash ho gaya hai (bug).
    this.isOperational = true; 

    // Stack trace capture karta hai taaki debugging mein aasani ho
    Error.captureStackTrace(this, this.constructor);
  }
}