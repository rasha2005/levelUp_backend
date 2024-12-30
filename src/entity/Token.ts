interface DecodedToken {
    id: string;
    email: string;
    role: "User" | "Admin" | "Instructor";
    iat: number;
    exp: number;
  }

export default DecodedToken