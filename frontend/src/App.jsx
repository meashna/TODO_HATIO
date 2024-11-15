// // src/App.jsx
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register'; // Import Register
// import Home from './pages/Home';
// import ProjectDetail from './pages/ProjectDetail';
// import Header from './components/Header';

// function App() {
//     const [auth, setAuth] = useState({
//         username: '',
//         password: '',
//     });

//     const isAuthenticated = auth.username !== '' && auth.password !== '';

//     return (
//         <Router>
//             {isAuthenticated && <Header setAuth={setAuth} />}
//             <Routes>
//                 <Route path="/login" element={<Login setAuth={setAuth} />} />
//                 <Route path="/register" element={<Register setAuth={setAuth} />} /> {/* Add Register Route */}
//                 <Route
//                     path="/"
//                     element={
//                         isAuthenticated ? <Home auth={auth} /> : <Navigate to="/login" />
//                     }
//                 />
//                 <Route
//                     path="/projects/:id"
//                     element={
//                         isAuthenticated ? <ProjectDetail auth={auth} /> : <Navigate to="/login" />
//                     }
//                 />
//                 {/* Redirect any unknown routes to login */}
//                 <Route path="*" element={<Navigate to="/login" />} />
//             </Routes>
//         </Router>
//     );
// }

// export default App;


// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import ProjectDetail from './pages/ProjectDetails/ProjectDetail';
import Header from './components/Header/Header';

function App() {
    const [auth, setAuth] = useState({
        username: '',
        password: '',
    });

    const isAuthenticated = auth.username !== '' && auth.password !== '';

    return (
        <Router>
            {isAuthenticated && <Header setAuth={setAuth} auth={auth} />} {/* Pass auth */}
            <Routes>
                <Route path="/login" element={<Login setAuth={setAuth} />} />
                <Route path="/register" element={<Register setAuth={setAuth} />} />
                <Route
                    path="/"
                    element={
                        isAuthenticated ? <Home auth={auth} /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/projects/:id"
                    element={
                        isAuthenticated ? <ProjectDetail auth={auth} /> : <Navigate to="/login" />
                    }
                />
                {/* Redirect any unknown routes to login */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
