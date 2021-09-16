import { FC } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import axios from 'axios';
const baseURL = "http://localhost:8000";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const isGoogleLoginResponse = (item: any): item is GoogleLoginResponse => item.accessToken !== undefined;

const handleGoogleLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (!isGoogleLoginResponse(response)) {
        axios
            .post(`${baseURL}/fetch_token`,
                {
                    authorizationCode: response.code
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            .then((res) => console.log(res));
    } else {
        console.log("Unexpected");

    }
};

const onFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => console.log(response);

const LoginButton: FC = () => {
    return (
        <div className="LoginButton">
            <GoogleLogin
                clientId={googleClientId}
                buttonText="Login"
                onSuccess={handleGoogleLogin}
                onFailure={onFailure}
                prompt="consent"
                responseType="code"
                accessType="offline"
                scope="https://www.googleapis.com/auth/calendar"
                isSignedIn={true}
                redirectUri="postmessage"
            />
        </div>

    );
}
export default LoginButton;