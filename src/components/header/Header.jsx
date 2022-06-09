import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../Redux/Actions";
import FavoritesNav from "../favorites/favoritesNav/FavoritesNav";
import "./header.scss";
import swal from "sweetalert";

const Header = () => {
  const handleLogout = () => {
    swal({
      title: "Do you want to log out?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("You are logged out", {
          icon: "success",
        });
        dispatch(logout());
      }
    });
  };
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  return (
    <div className="header">
      <div className="nav">
        <div className="logBtns">
          {currentUser ? (
            <Link to="/">
              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="login">Login</button>
            </Link>
          )}
        </div>
        <FavoritesNav />
      </div>
      <div className="title">
        <Link to="/">
          <span>ComicBook</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
