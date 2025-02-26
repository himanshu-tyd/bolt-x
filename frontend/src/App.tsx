import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import Workspace from './page/workspace';


const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/"  element={<Home />} />
            <Route path="/workspace" element={<Workspace />} />
        </Routes>
    );
};

export default App;