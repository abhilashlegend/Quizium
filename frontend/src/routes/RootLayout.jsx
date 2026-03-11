import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import ErrorHandler from "../components/ErrorHandler";

export default function RootLayout() {
    return (
        <>  
            <Header />
            <main className="main">
                <Outlet />
            </main>
        </>
    )
}