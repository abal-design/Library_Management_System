// Define user type
export type User = {
  id: string;
  name: string;
  email: string;
  role: "borrower" | "admin" | "other"; // match your backend roles
  // add other fields your backend returns
};

export type RootStackParamList = {
  Login: undefined;
  Book: { user: User }; // strongly typed now
  // add other screens as needed
};