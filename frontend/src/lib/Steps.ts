import { Step, StepType } from "./types";

/**
 * Parse input XML and convert it into steps.
 * 
 * Handles complex XML strings with multiple levels of escaping.
 * 
 * @param response - The string containing XML to be parsed
 * @returns Array of Step objects
 */
export function parseXml(response: string): Step[] {
  const steps: Step[] = [];
  let stepId = 1;

  try {
    // Helper function to unescape XML strings safely
    const unescapeXml = (str: string): string => {
      return str
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\\\/g, '\\')
        .trim();
    };

    // Extract artifact ID and title
    const artifactRegex = /<boltArtifact[^>]*id=(?:"|\\")([^"\\]+)(?:"|\\")[^>]*title=(?:"|\\")([^"\\]+)(?:"|\\")/;
    const artifactMatch = response.match(artifactRegex);

    if (artifactMatch) {
      const artifactId = unescapeXml(artifactMatch[1]);
      const artifactTitle = unescapeXml(artifactMatch[2]);

      steps.push({
        id: stepId++,
        title: artifactTitle,
        description: `Project structure: ${artifactId}`,
        type: StepType.CreateFolder,
        status: 'pending'
      });

      // Extract boltAction elements
      const actionPattern = /<boltAction[^>]*type=(?:"|\\")([^"\\]+)(?:"|\\")(?:[^>]*filePath=(?:"|\\")([^"\\]+)(?:"|\\")?)?[^>]*>([\s\S]*?)<\/boltAction>/g;
      let actionMatch;

      while ((actionMatch = actionPattern.exec(response)) !== null) {
        const actionType = unescapeXml(actionMatch[1]);
        const filePath = actionMatch[2] ? unescapeXml(actionMatch[2]) : undefined;
        const content = unescapeXml(actionMatch[3]);

        // Ignore unwanted empty content
        if (!content || content.trim() === "") {
          console.warn(`Ignoring empty action content for type: ${actionType}`);
          continue;
        }

        switch (actionType) {
          case 'file':
            if (filePath) {
              steps.push({
                id: stepId++,
                title: `Create ${filePath}`,
                description: `File: ${filePath}`,
                type: StepType.CreateFile,
                status: 'pending',
                code: content.trim(),
                path: filePath
              });
            }
            break;

          case 'shell':
            steps.push({
              id: stepId++,
              title: 'Run command',
              description: `Shell: ${content.trim().split('\n')[0]}...`,
              type: StepType.RunScript,
              status: 'pending',
              code: content.trim()
            });
            break;

          default:
            console.warn(`Unknown action type: ${actionType}`);
            break;
        }
      }
    } else {
      console.warn("No boltArtifact found in XML response");
    }
  } catch (error) {
    console.error("Error parsing XML:", error);
  }

  if (steps.length === 0) {
    console.warn("No steps were created from the XML input");
  }

  return steps;
}
