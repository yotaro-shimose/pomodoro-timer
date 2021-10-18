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
import { UserProfile } from "../interfaces";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const onFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) =>
  console.log(response);

interface LoginButtonProps {
  setUserProfile: (userProfile: UserProfile) => void;
}

const LoginButton: FC<LoginButtonProps> = (props) => {
  const scope = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks";
  const setUserProfile = props.setUserProfile;
  const handleGoogleLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log(response.code);
    axios
      .post(
        `${BackendURL}/login`,
        {
          authorizationCode: response.code,
        },
        {
          headers: {
            // "Content-Type": "application/x-www-form-urlencoded",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res: AxiosResponse<UserProfile>) => {
        setUserProfile(res.data);
        if (res.data.calendarId) {
          (res.data.taskListId)
        }
        else {

        }
      });
  };
  const onLogoutSuccess = () => {
    setUserProfile({ "id": "", "calendarId": "", "taskListId": "" });
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
