import { FC } from "react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
import axios, { AxiosResponse } from "axios";
import { BackendURL } from "../constants";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../atoms";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const onFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) =>
  console.log(response);

interface LoginButtonProps {
  setUserId: (userId: string) => void;
}

const LoginButton: FC<LoginButtonProps> = (props) => {
  const scope = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks";
  const setUserId = props.setUserId;
  const handleGoogleLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log(response.code);
    axios
      .post(
        `${BackendURL}/user`,
        {
          authorizationCode: response.code,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res: AxiosResponse<string>) => {
        setUserId(res.data);
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
      isSignedIn={true}
      redirectUri="postmessage"
    />
  );
};
export default LoginButton;
