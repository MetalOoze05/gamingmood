// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { gameRouter } from "./game";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("game.", gameRouter);
  
// export type definition of API
export type AppRouter = typeof appRouter;