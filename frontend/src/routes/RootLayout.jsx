import { Outlet, useSubmit, useLoaderData } from "react-router-dom";
import Header from "../components/Header";
import ErrorHandler from "../components/ErrorHandler";
import { getTokenDuration, startTokenRefresh } from "../util/auth";
import { startAutoLogout } from "../util/autoLogout";
import { useEffect } from 'react';

export default function RootLayout() {

    const submit = useSubmit();
    const token = useLoaderData();

    useEffect(() => {
        startTokenRefresh();
        startAutoLogout(submit)
    }, [submit]);

    useEffect(() => {

        if(!token){
            return;
        }

        if(token === 'EXPIRED'){
            submit(null, { action: '/logout', method: 'POST' })
            return;
        }

        const tokenDuration = getTokenDuration();

        const timer = setTimeout(() => {
            submit(null, { method: 'POST', action: '/logout' })
        }, tokenDuration);

        return () => clearTimeout(timer);
        
    }, [submit, token])

    return (
        <>  
            <Header />
            <main className="main">
                <Outlet />
            </main>
        </>
    )
}

