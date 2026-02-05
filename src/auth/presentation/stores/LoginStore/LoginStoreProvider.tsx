import { PropsWithChildren } from "react";
import { LoginStoreContext } from "./LoginStoreContext";
import { LoginStore } from "./LoginStore";
import { authModuleContainer } from "@/src/auth/AuthModule";

export const LoginStoreProvider = ({ children }: PropsWithChildren) => {
  return (
    <LoginStoreContext.Provider
      value={authModuleContainer.get(LoginStore)}
    >
      {children}
    </LoginStoreContext.Provider>
  );
};
