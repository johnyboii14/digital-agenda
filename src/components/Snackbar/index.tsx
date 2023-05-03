import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { SNACKBAR_STATUSES } from "../../@types";

interface RCTVSnackbarProps {
  setSnackbar: Function;
  severity: SNACKBAR_STATUSES;
  isOpen: boolean;
  snackbarMessage: string;
}

function RCTVSnackbar({
  setSnackbar,
  severity,
  isOpen,
  snackbarMessage,
}: RCTVSnackbarProps) {
  const handleSnackbarClose = (
    _e?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(false);
  };
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
}

export default RCTVSnackbar;
