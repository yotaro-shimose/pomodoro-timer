import { Token } from '../interfaces/interfaces';
import { tokenState, isLoggedInState } from '../atoms';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const TOKEN_KEY = "TOKEN";
const saveToken = (token: Token) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
};
const loadToken: () => Token | null = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        return JSON.parse(token);
    } else {
        return null;
    }
};
const _clearToken = () => localStorage.removeItem(TOKEN_KEY);

const getToken = () => {
    const isLoggedIn = useRecoilValue(isLoggedInState);
    const [token, setToken] = useRecoilState(tokenState);
    if (!isLoggedIn) {
        const loadedToken = loadToken();
        if (loadedToken) {
            setToken(loadedToken);
            return loadedToken;
        } else {
            return null;
        }
    } else {
        return token;
    }
}

const setToken = (newToken: Token) => {
    const setRecoilToken = useSetRecoilState(tokenState);
    setRecoilToken(newToken);
    saveToken(newToken);
}

const clearToken = () => {
    const setRecoilToken = useSetRecoilState(tokenState);
    setRecoilToken(null);
    _clearToken();
}

export { getToken, setToken, clearToken };