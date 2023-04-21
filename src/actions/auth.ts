import { ADMIN_USER } from "../@types";
import ADMIN_USERS from "../constants/adminUsers";

export const signIn = (data: ADMIN_USER): boolean => {
  const { username, password } = data;
  if (!username && username.length < 3) {
    return false;
  }
  if (!password && password.length < 3) {
    return false;
  }
  const userIndex = ADMIN_USERS.findIndex(
    (user) => user.username.toLocaleLowerCase() === username.toLowerCase()
  );
  if (userIndex > -1) {
    if (
      ADMIN_USERS[userIndex].password.toLowerCase() === password.toLowerCase()
    ) {
      localStorage.setItem("username", ADMIN_USERS[userIndex].username);
      return true;
    }
    return false;
  }
  return false;
};

export const signOut = () => {
  localStorage.removeItem("username");
};
