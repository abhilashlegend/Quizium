import { Outlet, useSubmit, useLoaderData } from "react-router-dom";
import Header from "../components/Header";
import ErrorHandler from "../components/ErrorHandler";
import { getTokenDuration } from "../util/auth";
import { useEffect } from 'react';

export default function RootLayout() {

    const submit = useSubmit();
    const token = useLoaderData();

    useEffect(() => {
        if(!token){
            return;
        }

        if(token === 'EXPIRED'){
            submit(null, { action: '/logout', method: 'POST' })
            return;
        }

        const tokenDuration = getTokenDuration();

        setTimeout(() => {
            submit(null, { method: 'POST', action: '/logout' })
        }, tokenDuration)

        
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