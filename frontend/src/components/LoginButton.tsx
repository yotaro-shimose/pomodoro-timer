import { FC } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import axios from 'axios';
const baseURL = "http://localhost:8000";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const drfClientId = process.env.REACT_APP_DRF_CLIENT_ID;
const drfClientSecret = process.env.REACT_APP_DRF_CLIENT_SECRET;

const isGoogleLoginResponse = (item: any): item is GoogleLoginResponse => item.accessToken !== undefined;

const handleGoogleLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (!isGoogleLoginResponse(response)) {
        console.log("Use Online Access Type");
    } else {
        axios
            .post(`${baseURL}/auth/convert-token`, {
                token: response.accessToken,
                backend: "google-oauth2",
                grant_type: "convert_token",
                client_id: drfClientId,
                client_secret: drfClientSecret,
            })
            .then((res) => {
                const { access_token, refresh_token } = res.data;
                console.log({ access_token, refresh_token });
                // TODO use hooks!
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
            })
            .catch((err) => {
                console.log("Error Google login", err);
            });
    }
};

const onFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => console.log(response);

const LoginButton: FC = () => {
    return (
        <div className="LoginButton">
            <GoogleLogin
                clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={handleGoogleLogin}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>

    );
}
export default LoginButton;