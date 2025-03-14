import { Step, StepType } from "./types";

/**
 * Parse input XML and convert it into steps.
 * 
 * Handles complex XML strings with multiple levels of escaping.
 * 
 * @param response - The string containing XML to be parsed
 * @returns Array of Step objects
 */
export function parseXml(xml: string): Step[] {
  if (!xml) return [];
  
  try {
    const steps: Step[] = [];
    let id = 1;
    
    // Clean up XML and extract the boltArtifact content
    let cleanXml = xml.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\t/g, '\t');
    let artifactContent = cleanXml;
    
    // Extract all content between tags more reliably
    const extractArtifact = /<boltArtifact[^>]*>([\s\S]*)<\/boltArtifact>/;
    const artifactMatch = extractArtifact.exec(cleanXml);
    if (artifactMatch) {
      artifactContent = `<boltArtifact${artifactMatch[0].substring(13)}`;
    }
    
    // Get the artifact ID and title if available
    const artifactIdMatch = /<boltArtifact[^>]*id="([^"]*)"[^>]*title="([^"]*)"/.exec(artifactContent);
    if (artifactIdMatch) {
      steps.push({
        id: id++,
        title: `Project: ${artifactIdMatch[2]}`,
        description: `Initialize project structure`,
        type: StepType.File,
        status: "pending",
        path: "/",
        code: ""
      });
    }
    
    // Manual parsing instead of regex for better reliability
    let startIndex = 0;
    while (true) {
      // Find the next boltAction start tag
      const actionStartIndex = artifactContent.indexOf('<boltAction', startIndex);
      if (actionStartIndex === -1) break;
      
      // Find the closing tag position
      const actionEndIndex = artifactContent.indexOf('</boltAction>', actionStartIndex);
      if (actionEndIndex === -1) break;
      
      // Extract the full action element
      const actionElement = artifactContent.substring(actionStartIndex, actionEndIndex + 14);
      
      // Get action type
      const typeMatch = /type="([^"]*)"/.exec(actionElement);
      const type = typeMatch ? (typeMatch[1] === "file" ? StepType.File : StepType.Shell) : StepType.File;
      
      // Get file path if it's a file action
      const pathMatch = /filePath="([^"]*)"/.exec(actionElement);
      const path = pathMatch ? pathMatch[1] : "";
      
      // Extract content between opening and closing tags
      const openTagEnd = actionElement.indexOf('>', actionStartIndex);
      const content = actionElement.substring(openTagEnd + 1, actionEndIndex)
        // Remove any XML artifacts that might be left
        .replace(/<boltAction[^>]*>/, '')
        .trim();
      
      // Create step object
      const fileName = path.split('/').pop() || '';
      console.log(`Extracted ${type} for path: ${path}, content length: ${content.length}`);
      
      steps.push({
        id: id++,
        title: type === StepType.File 
          ? (path ? `Create/Update ${fileName}` : "Create file") 
          : "Run command",
        description: type === StepType.File 
          ? `Create or update the file at ${path}` 
          : `Execute the command: ${content.trim()}`,
        type,
        status: "pending",
        path,
        code: content,
        command: type === StepType.Shell ? content : undefined
      });
      
      // Move to the next action
      startIndex = actionEndIndex + 14;
    }
    
    return steps;
  } catch (error) {
    console.error("Error parsing XML:", error);
    return [];
  }
}
