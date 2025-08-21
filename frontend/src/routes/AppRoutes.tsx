import {BrowserRouter as Router,Routes,Route}from 'react-router-dom';
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage';
import ProtectedLayout from '@/components/layout/protectedLayout';

export default function AppRoutes(){
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route
                    path='/dashboard'
                    element={
                        <ProtectedLayout/>
                    }
                >
                    <Route index element={<DashboardPage/>}/>
                </Route>
                <Route path='*' element={<LoginPage/>}/>
            </Routes>
        </Router>
    )
}