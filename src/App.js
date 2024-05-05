import React from 'react'; // nạp thư viện react
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { publicRoutes } from '~/routes';

function App() {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    var Page = route.element;
                    return <Route key={index} path={route.path} element={<Page />} />;
                })}
            </Routes>
        </Router>
    );
}

export default App;
