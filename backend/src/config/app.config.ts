import { getEnv } from "../utilities/getEnv";

const appConfig = ()=>({
    PORT:getEnv("PORT","3000"),
    BASE_PATH: getEnv("BASE_PATH", "/api"),
    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
})

export const config = appConfig()