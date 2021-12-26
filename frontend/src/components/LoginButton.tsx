import { FC } from "react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState, userIdState } from "../atoms";
import { login } from "../api";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const onFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) =>
  console.log(response);

const LoginButton: FC = () => {
  const scope = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks";
  const setUserId = useSetRecoilState(userIdState);
  const handleGoogleLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    response = response as GoogleLoginResponseOffline;
    login(response.code).then((id: string) => {
      setUserId(id);
    });
  };
  const onLogoutSuccess = () => {
    setUserId("");
  };
  const isLoggedIn = useRecoilValue(isLoggedInState);
  if (isLoggedIn) {
    return (
      <GoogleLogout
        clientId={googleClientId}
        buttonText="Logout"
        onLogoutSuccess={onLogoutSuccess}
      />
    );
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
      redirectUri="postmessage"
    />
  );
};
export default LoginButton;
