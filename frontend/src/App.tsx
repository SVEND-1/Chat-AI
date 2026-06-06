import VerifyRegister from "./pages/register/VerifyRegister";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import VerifyResetCode from "./pages/reset-password/VerifyResetCode";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import ResetPassword from "./pages/reset-password/ResetPassword";
import Chat from "./pages/chat/Chat";
import SupportChat from "./pages/support-chat/SupportChat";
import SubscriptionPage from "./pages/subscription/subscription/SubscriptionPage";
import Profile from "./pages/profile/Profile";
import {ReceiptsPage} from "./pages/receipt/ReceiptPage";
import PaymentHistory from "./components/profile/PaymentHistory";
import PaymentHistoryPage from "./pages/payment-history/PaymentHistoryPage";
import SuccessSubscriptionPage from "./pages/subscription/succesSubscription/SuccessSubscriptionPage";
import SupportProfile from "./pages/profile/SupportProfile";


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
                <Route path="/subscription" element={<SubscriptionPage/>} />
                <Route path="/receipts" element={<ReceiptsPage/>}/>
                <Route path="/payment-history" element={<PaymentHistoryPage/>}/>
                <Route path="/chat" element={<Chat />} />
                <Route path="/supportChat" element={<SupportChat/>} />
                <Route path="/succeeded-payment" element={<SuccessSubscriptionPage />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/support-profile" element={<SupportProfile />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App