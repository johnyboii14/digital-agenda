import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { signOut } from "../../actions/auth";

import blackLogo from "../../assets/images/RCTVBlackLogo.png";

import "./styles.scss";

function AdminPage() {
  const navigate = useNavigate()
  useEffect(() => {
    const rawUsername = localStorage.getItem("username")
    if (!rawUsername || rawUsername === undefined || rawUsername === "") {
      navigate('/signin')
    } 
  }, [navigate])
  const handleSignOutClick = (): void => {
    signOut();
    navigate('/signin')
  };
  return (
    <div id="admin-page__container">
      <menu>
        <header>
          <img className="sidebar-logo" src={blackLogo} alt="RCTV Header" />
        </header>
        <ul>
          <li>Dashboard</li>
          <li>Upload Agenda</li>
        </ul>
      </menu>
      <div>
        <header>
          <h1>Digital Agenda Admin</h1>
          <button onClick={handleSignOutClick}>Sign Out</button>
        </header>
      </div>
    </div>
  );
}

export default AdminPage;
