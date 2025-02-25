import fs from 'fs'



export const getFilePrompt =  (file: string) => {
    try {
        const fileData = fs.readFileSync(file, "utf-8")
        return fileData  as string
    } catch (err) {
        return err as string
    }
}
