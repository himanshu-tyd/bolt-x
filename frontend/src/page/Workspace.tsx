import React, { useState } from 'react';
import useTheme from '../hooks/useTheme'; // Import the theme context

const Workspace: React.FC = () => {
    const { isDark } = useTheme(); // Get the current theme
    const [prompt, setPrompt] = useState<string>('');

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>

            <main className="container mx-auto px-4 py-20 md:py-32 flex">
                <div className="w-1/3 p-4 border-r border-gray-700">
                    <h2 className="text-lg font-bold">Prompt Input</h2>
                    <textarea
                        className="w-full h-64 p-2 border border-gray-600 rounded bg-gray-800 text-white"
                        placeholder="Enter your prompt here..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
                        Submit
                    </button>
                </div>
                <div className="w-2/3 p-4">
                    <h2 className="text-lg font-bold">Editor</h2>
                    <div className="h-64 border border-gray-600 rounded bg-gray-800">
                        {/* Here you can integrate your code editor, e.g., CodeMirror or Monaco Editor */}
                        <p className="text-gray-400 p-2">Code editor will be here...</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Workspace;