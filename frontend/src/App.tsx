import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Workspace from './page/workspace';
import { Toaster } from 'sonner';
import { WebContainerProvider } from './contexts/WebContainerContext';

const App: React.FC = () => {
    return (
        <WebContainerProvider>
            <Toaster richColors/>
        
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/workspace" element={<Workspace />} />
                </Routes>
            
        
        </WebContainerProvider>
    );
};

export default App;