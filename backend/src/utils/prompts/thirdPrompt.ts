export const lastPrompt = (prompt: string):string =>  {
  return `
  <bolt_running_commands>
</bolt_running_commands>

Current Message:

${prompt}

File Changes:

Here is a list of all files that have been modified since the start of the conversation.
This information serves as the true contents of these files!

The contents include either the full file contents or a diff (when changes are smaller and localized).

Use it to:
 - Understand the latest file modifications
 - Ensure your suggestions build upon the most recent version of the files
 - Make informed decisions about changes
 - Ensure suggestions are compatible with existing code

Here is a list of files that exist on the file system but are not being shown to you:

  - /home/project/.bolt/config.json
  ` 
};
