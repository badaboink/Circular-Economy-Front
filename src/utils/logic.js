import { jwtDecode } from "jwt-decode";

export function isLoggedIn() {
    const token = localStorage.getItem('token');
    if(token != null)
    {
        const decoded = jwtDecode(token);
        const isTokenExpired = Date.now() >= decoded.exp * 1000;
    
        if (isTokenExpired) {
            localStorage.clear();
            return false;
        }
    }
    return token !== null && token !== "";
}

export function getUsername(){
    const token = localStorage.getItem('token');
    if (token !== null)
    {
        const decoded = jwtDecode(token);
        return decoded.sub;
    }
    return null;
}