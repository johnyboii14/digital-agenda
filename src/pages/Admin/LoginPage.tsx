import { useState } from "react";
import { useNavigate } from "react-router";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import RCTVSnackbar from "../../components/Snackbar";

import { signIn } from "../../actions/auth";

import "./styles.scss";
import { SNACKBAR_STATUSES } from "../../@types";

interface LoginPageProps {
  setAuthState: Function;
}

function LoginPage({ setAuthState }: LoginPageProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [snackbarOpen, setSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<SNACKBAR_STATUSES>(
    SNACKBAR_STATUSES.SUCCESS
  );
  const showSnackbarMessage = (msg: string, severity: SNACKBAR_STATUSES) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    return setSnackbar(true);
  };
  const navigate = useNavigate();
  const handleGoHomeClick = () => navigate("/");

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSignInClick = async () => {
    const isCredsValid = signIn({ username, password });
    if (isCredsValid) {
      setAuthState(true);
      showSnackbarMessage("Successfully Logged In!", SNACKBAR_STATUSES.SUCCESS);
    } else {
      setAuthState(false);
      setErrorPassword(password);
      setErrorUsername(username);
      showSnackbarMessage(
        "Invalid credentials, please check your username or password",
        SNACKBAR_STATUSES.ERROR
      );
    }
  };

  const usernameWrong = username === errorUsername;
  const passwordWrong = password === errorPassword;

  return (
    <div className="admin__page sign-in__page">
      <section className="admin-sign-in__container">
        <article className="admin__header">
          <span className="go-back__wrapper" onClick={handleGoHomeClick}>
            <ArrowBackIcon />
          </span>
        </article>
        <article className="admin-sign-in-form__container">
          <header>Welcome Back</header>
          <form className="sign-in-form__form">
            <TextField
              color={!usernameWrong ? "error" : "error"}
              label="Username"
              value={username}
              onChange={handleUsernameInput}
            />
            <TextField
              color={!passwordWrong ? "primary" : "error"}
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordInput}
            />
            <Button variant="contained" onClick={handleSignInClick}>
              Sign In
            </Button>
          </form>
        </article>
      </section>
      <section className="admin-sign-in__bg">
        <div className="admin-sign-in__bg--vignette"></div>
      </section>
      <RCTVSnackbar
        isOpen={snackbarOpen}
        severity={snackbarSeverity}
        setSnackbar={setSnackbar}
        snackbarMessage={snackbarMessage}
      />
    </div>
  );
}

export default LoginPage;
