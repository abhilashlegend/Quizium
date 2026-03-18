import { redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function getTokenDuration() {
    const storedExpirationDate = localStorage.getItem('expiration');
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
}

export function getAuthToken() {
    const token = localStorage.getItem('token');

    if(!token){
        return null;
    }

    const tokenDuration = getTokenDuration();

    if(tokenDuration < 0){
        return 'EXPIRED';
    }

    return token;
}

export function getUserRole() {
    const token = localStorage.getItem("token");
    if(!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role;
    } catch(err) {
        console.error("Invalid token", err);
        return null;
    }
}



export function loader() {
    return getAuthToken();
}

export function checkAuthLoader() {
    const token  = getAuthToken();

    if(!token){
        return redirect("/")
    }

    return null;
}