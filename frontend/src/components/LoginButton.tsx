import { FC } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout } from 'react-google-login';
import axios, { AxiosResponse } from 'axios';
import { Token } from '../interfaces/interfaces';
import { setToken, clearToken } from '../utils/token';
import { BackendURL } from '../utils/constants';
import { isLoggedInState } from '../atoms';
import { useRecoilState } from 'recoil';
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const isGoogleLoginResponse = (item: any): item is GoogleLoginResponse => item.accessToken !== undefined;
const onFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => console.log(response);



const LoginButton: FC = () => {
    const scope = "https://www.googleapis.com/auth/calendar";
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
    const handleGoogleLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if (!isGoogleLoginResponse(response)) {
            axios
                .post(`${BackendURL}/fetch_token`,
                    {
                        authorizationCode: response.code
                    },
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                .then((res: AxiosResponse<Token>) => {
                    setToken(res.data);
                    setIsLoggedIn(true);
                });
        } else {
            console.log("Unexpected Response Type!");
        }
    };
    const onLogoutSuccess = () => {
        clearToken();
        setIsLoggedIn(false);
    };
    if (isLoggedIn) {
        return (
            <GoogleLogout
                clientId={googleClientId}
                buttonText="Logout"
                onLogoutSuccess={onLogoutSuccess}
            />
        )
    }
    return (

        <GoogleLogin
            clientId={googleClientId}
            buttonText="Login"
            onSuccess={handleGoogleLogin}
            onFailure={onFailure}
            prompt="consent"
            responseType="code"
            accessType="offline"
            scope={scope}
            isSignedIn={true}
            redirectUri="postmessage"
        />
    );
}
export default LoginButton;