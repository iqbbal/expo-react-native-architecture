import { createContext } from "react";
import { LoginStore } from "./LoginStore";

export const LoginStoreContext = createContext<LoginStore | null>(null);
