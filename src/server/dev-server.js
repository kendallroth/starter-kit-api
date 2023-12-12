// Development script to automatically (re)start after bundling with `tsup`

const { initServer } = require("../../build/server");

initServer({
  development: true,
  port: 3001,
});
