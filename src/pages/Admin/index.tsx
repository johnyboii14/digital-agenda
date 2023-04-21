import blackLogo from "../../assets/images/RCTVBlackLogo.png";

function AdminPage() {
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
          <button>Sign Out</button>
        </header>
      </div>
    </div>
  );
}

export default AdminPage;
