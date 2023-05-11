import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

import "./styles.scss";

// interface MakeProfileButtonProps {
//   department: Department;
// }

function AdminButton() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/admin`);
  };
  return (
    <div className="button-design" onClick={handleClick}>
      <article className="content-position">
        <LoginIcon htmlColor="white" />
        <h6>SIGN IN</h6>
      </article>
    </div>
  );
}

export default AdminButton;
