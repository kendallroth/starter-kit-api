// Development script to automatically (re)start after bundling with `tsup`

const { initServer } = require("./build/index");

initServer({
  development: true,
  port: 3001,
});
