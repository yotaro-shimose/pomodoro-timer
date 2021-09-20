import { Token } from '../interfaces/interfaces';

const TOKEN_KEY = "TOKEN";
const setToken = (token: Token) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
};
const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        return JSON.parse(token);
    } else {
        return null;
    }
};
const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export { setToken, getToken, clearToken };