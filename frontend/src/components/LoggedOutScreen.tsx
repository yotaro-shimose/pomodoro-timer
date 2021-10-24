import { FC } from "react";
import { Typography } from "@material-ui/core";

const LoggedOutScreen: FC = () => {
  return (
    <div className="LoggedOutScreen">
      <Typography>
        <h3>You have to log in first!</h3>
      </Typography>
    </div>
  );
};

export default LoggedOutScreen;
