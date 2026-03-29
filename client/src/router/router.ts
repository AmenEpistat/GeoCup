import { createBrowserRouter } from 'react-router-dom';
import MapPage from '../pages/MapPage';
import React from 'react';

export const router = createBrowserRouter([
    {
        path: '/',
        element: React.createElement(MapPage),
    },
]);
