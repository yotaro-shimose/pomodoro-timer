import { FC } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout } from 'react-google-login';
import axios, { AxiosResponse } from 'axios';
import { GlobalState, Token } from '../interfaces/interfaces';
import { setToken, clearToken } from '../utils/token';
import lodash from 'lodash';

const backendURL = "http://localhost:8000";
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const isGoogleLoginResponse = (item: any): item is GoogleLoginResponse => item.accessToken !== undefined;
const onFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => console.log(response);

interface LoginButtonProps {
    state: GlobalState,
    setState: (state: GlobalState) => void,
};

const LoginButton: FC<LoginButtonProps> = (props: LoginButtonProps) => {
    const scope = "https://www.googleapis.com/auth/calendar";
    const handleGoogleLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if (!isGoogleLoginResponse(response)) {
            axios
                .post(`${backendURL}/fetch_token`,
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
                    let state: GlobalState = lodash.cloneDeep(props.state);
                    state.isLoggedIn = true;
                    props.setState(state);
                });
        } else {
            console.log("Unexpected Response Type!");
        }
    };
    const onLogoutSuccess = () => {
        clearToken();
        let state: GlobalState = lodash.cloneDeep(props.state);
        state.isLoggedIn = false;
        props.setState(state);
    };
    if (props.state.isLoggedIn) {
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