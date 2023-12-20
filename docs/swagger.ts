// Attempt to "solve" annoying Swagger UI display issue where any `oneOf` or `anyOf` fields
//   are displayed as an unexpected array, even if there is only a single type! This commonly
//   occurs with nullable types, but can often appear even without this.
// This code was run after Swagger completed mounting, and attempted to automatically expand
//   all model definitions with type arrays (denoted by `[...]`). However, it only worked for
//   the bottom "Schemas" section, as the schemas with the Operations sections are too heavily
//   nested for easily attaching listeners for a similar approach...
// Eventually, this hacky approach was replaced with using some provided Swagger configuration.
//   While not perfect, it was far easier to implement and less error-prone...
//   - 'defaultModelsExpandDepth' - Expansion levels for "Schema" section models
//   - 'defaultModelExpandDepth'  - Expansion levels for operation "Schema" models
export const onComplete = () => {
  console.info("Running 'onComplete'");

  const onModelBoxClick = (event: Event) => {
    const clickedBox = event.currentTarget as HTMLElement;
    setTimeout(() => {
      expandModelSection(clickedBox);
    }, 30);
  };

  const expandModelSection = (section: HTMLElement) => {
    if (!section) return;

    const innerToggles = [
      ...section.querySelectorAll("table.model button.model-box-control"),
    ] as HTMLElement[];
    // Bail out of recursive click events triggered by manually expanding model boxes below,
    //   as this handler will also receive those events (since they come from child node).
    if (!innerToggles.length) return;

    for (const toggle of innerToggles) {
      if (!toggle.innerText?.endsWith("[...]")) continue;
      toggle.click();
    }
  };

  const configureModelsSection = () => {
    const modelBoxes = [...document.querySelectorAll(".model-container > .model-box")];
    console.info(`Attaching 'onModelBoxClick' to ${modelBoxes.length} model boxes`);

    for (const parentBox of modelBoxes) {
      // Expand child types once model section is opened
      parentBox.addEventListener("click", onModelBoxClick);

      // Expand child types if model section is already opened
      expandModelSection(parentBox as HTMLElement);
    }
  };

  // Immediately run models section configuration when loading document
  configureModelsSection();

  // Schemas section (bottom of Swagger document)
  const modelsSection = document.querySelector("section.models");
  if (modelsSection) {
    const modelSectionMutationObserver = new MutationObserver((mutations) => {
      const mutatedClass = mutations[0];
      if (!mutatedClass) return;

      const previouslyOpen = mutatedClass.oldValue?.includes("is-open");
      if (previouslyOpen) return;

      configureModelsSection();
    });
    modelSectionMutationObserver.observe(modelsSection, {
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
    });
  }
};
