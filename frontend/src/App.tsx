import VerifyRegister from "./pages/register/VerifyRegister";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import VerifyResetCode from "./pages/reset-password/VerifyResetCode";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import ResetPassword from "./pages/reset-password/ResetPassword";
import Chat from "./pages/chat/Chat";
import SubscriptionPage from "./pages/subscription/SubscriptionPage";




function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />}/>
                <Route path="/verify" element={<VerifyRegister />} />
                <Route path="/reset-verify" element={<VerifyResetCode />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/chat" element={<Chat />}/>
                <Route path="/subscription" element={<SubscriptionPage />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App
