import { createContext } from "react";

const MAX_ATTEMPTS = 3;

const RemainingAttemptsContext = createContext<number>(MAX_ATTEMPTS);

export default RemainingAttemptsContext;
