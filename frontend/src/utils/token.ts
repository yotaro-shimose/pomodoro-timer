import { Token } from '../interfaces/interfaces';
import { tokenState, isLoggedInState } from '../atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
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
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

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

const setToken = () => {

}

export { saveToken, loadToken, clearToken };