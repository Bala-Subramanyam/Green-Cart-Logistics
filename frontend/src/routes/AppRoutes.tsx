import {BrowserRouter as Router,Routes,Route,Navigate}from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage';
import React from 'react';

function PrivateRoute({children}:{children:React.ReactElement}){
    const isAuthenticated=useAuthStore((state)=>state.isAuthenticated);
    const loading = useAuthStore((state) => state.isLoading);
    if (loading) {
        return <p>Loading...</p>; // or a spinner
    }
    return isAuthenticated ? children : <Navigate to='/login'/>;
}

export default function AppRoutes(){
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route
                    path='/dashboard'
                    element={
                        <PrivateRoute>
                            <DashboardPage/>
                        </PrivateRoute>
                    }
                />
                <Route path='*' element={<LoginPage/>}/>
            </Routes>
        </Router>
    )
}