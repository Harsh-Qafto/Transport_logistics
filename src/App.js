import React, { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import { pages } from "./Pages.js";

const blogEntries = [...pages];

const JsonComponent = [];

blogEntries.map((name) => {
    JsonComponent.push({
        path: name.path,
        comp: lazy(() => import(`./pages/${name.comp}.js`)),
        isPublic: name?.isPublic,
    });
});

export const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("currentUser");

    if (isAuthenticated) {
        return children;
    }

    return <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {JsonComponent.map((Data) =>
                    Data?.isPublic == "true" ? (
                        <Route
                            path={Data.path}
                            element={
                                <Suspense fallback={<p>Loading.....</p>}>
                                    <Data.comp />
                                </Suspense>
                            }
                        />
                    ) : (
                        <Route
                            path={Data.path}
                            element={
                                <PrivateRoute>
                                    <Suspense fallback={<p>Loading.....</p>}>
                                        <Data.comp />
                                    </Suspense>
                                </PrivateRoute>
                            }
                        />
                    )
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
