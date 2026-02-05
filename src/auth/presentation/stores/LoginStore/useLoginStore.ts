import { useContext } from "react";
import { LoginStoreContext } from "./LoginStoreContext";

export const useLoginStore = () => {
  const context = useContext(LoginStoreContext);

  if (!context) {
    throw new Error("useLoginStore must be used within LoginStoreProvider");
  }

  return context;
};
