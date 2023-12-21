/** Name for attaching to browser window (ie. `window.swaggerConfig`) */
const windowName = "swaggerConfig";

/**
 * Swagger configuration shared between UI instances.
 *
 * Since development uses `swagger-ui-express` while production uses static files,
 *   the Swagger configuration should be shared to reduce complexity. Unfortunately,
 *   this requires an ugly workaround to run in both Node/browser.
 *
 * @source https://caolan.uk/notes/2010-07-01_writing_for_node_and_the_browser.cm
 */
((exports) => {
  // Prevent shrinking operation IDs
  exports.customCss = ".opblock-summary-operation-id { flex-shrink: 0; }";
  exports.customSiteTitle = "starter-kit-api";
  exports.swaggerOptions = {
    // Expansion levels for "Schema" section models (-1 hides, 0 collapses, 1 default)
    defaultModelsExpandDepth: 2,
    // Expansion levels for operation "Schema" models (-1 hides, 0 collapses, 1 default, 2 expands)
    defaultModelExpandDepth: 2,
    // Display operation ID in operations list
    displayOperationId: true,
    // Display tag/operation filter
    filter: true,
    // Automatically apply Swagger auth after authenticating with `/auth/login` route (via Swagger)
    responseInterceptor: (response) => {
      if (!response.url.endsWith("/login")) return response;

      const { accessToken } = response.body;
      if (!accessToken) return response;

      const swaggerUi = window.ui;
      swaggerUi?.preauthorizeApiKey?.("jwt", accessToken);
      console.info("Applied JWT authorization");
      return response;
    },
    plugins: [
      () => ({
        fn: {
          // Support case-insensitive filtering (includes tags and operation IDs)
          // NOTE: Swagger uses ImmutableJS for data
          //   tagMap  (OrderedMap)
          //     [tag]  (Map)
          //       tagDetails  (Map)
          //         name  (string)
          //       operations  (List)
          //         [#]  (Map)
          //           path
          //           operation  (Map)
          //             operationId  (string)
          opsFilter: (allTagsMap, phrase) => {
            const swaggerUi = window.ui;
            const Im = swaggerUi?.Im;
            if (!Im) return allTagsMap;

            const search = phrase?.toLowerCase().trim() ?? "";
            const compareSearch = (input) => input?.toLowerCase().includes(search) ?? false;

            return allTagsMap.reduce((reduction, tagMap, tagKey) => {
              const tagMatches = compareSearch(tagKey);
              if (tagMatches) return reduction.set(tagKey, tagMap);

              const filteredOperations = tagMap.get("operations").filter((opMap) => {
                const operationId = opMap.get("operation").get("operationId");
                return compareSearch(operationId);
              });
              if (!filteredOperations.size) return reduction;

              const filteredTagMap = tagMap.set("operations", filteredOperations);
              return reduction.set(tagKey, filteredTagMap);
            }, Im.OrderedMap());
          }
        },
      }),
    ],
  };
// biome-ignore lint/suspicious/noAssignInExpressions: Necessary to run in both Node and browser
})(typeof exports === "undefined" ? this[windowName] = {} : exports)
