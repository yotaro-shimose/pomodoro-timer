import { FC } from "react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { isLoggedInState, userProfileState, taskListState } from "../atoms";
import { UserProfile, Task } from "../interfaces";
import { login, fetchTask } from "../api";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const onFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) =>
  console.log(response);

const LoginButton: FC = (props) => {
  const scope = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks";
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const setTaskList = useSetRecoilState(taskListState);
  const handleGoogleLogin = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    response = response as GoogleLoginResponseOffline;
    login(response.code).then((profile: UserProfile) => {
      setUserProfile(profile);
      if (profile.calendarId) {
        fetchTask(userProfile.id).then((taskList: Task[]) => {
          setTaskList(taskList);
        });
      }
    });
  };
  const onLogoutSuccess = () => {
    setUserProfile({ id: "", calendarId: "", taskListId: "" });
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
