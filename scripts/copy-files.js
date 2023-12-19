// @ts-check

/*
 * Copy files after TS bundling (includes Swagger doc, etc)
 */

import copyfiles from "copyfiles";

// Copy Swagger file to build/docs directories
const swaggerPath = "./src/generated/swagger.json";
/** @type copyfiles.Options */
const options = { up: 2 };
const noOp = () => {};

console.info("CLI Copying generated Swagger doc (after build)");
copyfiles([swaggerPath, "./build"], options, noOp);
copyfiles([swaggerPath, "./docs"], options, noOp);
