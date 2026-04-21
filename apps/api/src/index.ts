import "reflect-metadata";

import "dotenv/config";
import App from "./app";

const server = new App();
server.listen();
