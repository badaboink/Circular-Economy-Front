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

export function setUsernameIndex() {
    const username = getUsername();
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
    const index = (hash % 25) + 1;
    localStorage.setItem('avatar', index);
    return index;
}