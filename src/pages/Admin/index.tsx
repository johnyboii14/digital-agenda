import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";

import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import AdminAiringTable from "../../components/AdminAiringTable";

import { useAppDispatch, useAppSelector } from "../../config/hooks";

import { getAdminAirings } from "../../actions/airings";
import { signOut } from "../../actions/auth";

import blackLogo from "../../assets/images/RCTVBlackLogo.png";

import "./styles.scss";

function AdminPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const airingStatus = useAppSelector((state) => state.airings.status);
  useEffect(() => {
    const rawUsername = localStorage.getItem("username");
    if (!rawUsername || rawUsername === undefined || rawUsername === "") {
      navigate("/signin");
    }
    if (airingStatus === "idle") {
      dispatch(getAdminAirings());
    }
  }, [airingStatus, dispatch, navigate]);
  const handleSignOutClick = (): void => {
    signOut();
    navigate("/signin");
  };
  return (
    <div id="admin-page__container">
      <menu>
        <header>
          <img className="sidebar-logo" src={blackLogo} alt="RCTV Header" />
        </header>
        <ul>
          <li style={{ marginBottom: "10%" }}>
            <Button
              className="selected"
              variant="text"
              startIcon={<DashboardIcon />}
            >
              Dashboard
            </Button>
          </li>
          <li>
            <Button variant="text" startIcon={<AddIcon />}>
              Upload Agenda
            </Button>
          </li>
        </ul>
      </menu>
      <main>
        <header>
          <h1 className="admin-header__text">Digital Agenda Admin</h1>
          <Button
            variant="contained"
            onClick={handleSignOutClick}
            endIcon={<ExitToAppIcon />}
            sx={{ backgroundColor: "#D17253" }}
          >
            Sign Out
          </Button>
        </header>
        <AdminAiringTable />
        <div className="admin-vignette" />
      </main>
    </div>
  );
}

export default AdminPage;
