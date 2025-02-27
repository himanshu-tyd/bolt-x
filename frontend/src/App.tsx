import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import Workspace from './page/workspace';
import { Toaster } from 'sonner';


const App: React.FC = () => {
    return (
        <div>
            <Toaster richColors/>
        <Routes>
            <Route path="/"  element={<Home />} />
            <Route path="/workspace" element={<Workspace />} />
        </Routes>

        </div>
    );
};

export default App;