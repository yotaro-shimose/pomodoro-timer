import { FC } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout } from 'react-google-login';
import axios, { AxiosResponse } from 'axios';
import { Token } from '../interfaces/interfaces';
import { tokenState } from '../atoms';
import { BackendURL } from '../utils/constants';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoggedInState } from '../atoms';
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const isGoogleLoginResponse = (item: any): item is GoogleLoginResponse => item.accessToken !== undefined;
const onFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => console.log(response);



const LoginButton: FC = () => {
    const scope = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks";
    const setToken = useSetRecoilState(tokenState);
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
                });
        } else {
            console.log("Unexpected Response Type!");
        }
    };
    const onLogoutSuccess = () => {
        setToken(null);
    };
    const isLoggedIn = useRecoilValue(isLoggedInState);
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