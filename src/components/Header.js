import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  return (
    <header>
      <a href={user.id ? `/${user.id}/boards` : `/`}>
        <span role="img" aria-label="house emoji">
          &#127968;
        </span>
      </a>
      <h1>React ToDo</h1>
      <div className="user-area">
        {user.id ? (
          <>
            <small>user: {user.email}</small>
            <button onClick={(e) => logOut(e)}>Log Out</button>
          </>
        ) : (
          <small>Please sign in</small>
        )}
      </div>
    </header>
  );
};

export default Header;
