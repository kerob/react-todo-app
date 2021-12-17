import { useRef, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function UserForm() {
  const emailInput = useRef();
  const passwordInput = useRef();
  const navigate = useNavigate();
  const { user, signUp, logIn, authMessage } = useContext(AuthContext);

  const redirect = (userId) => {
    navigate(`/${userId}/boards`);
  };
  return (
    <>
      {!user.id ? (
        <div className="sign-up-wrapper">
          <h2>Sign in or create account</h2>
          {authMessage ? (
            <span style={{ color: "red" }}>{authMessage}</span>
          ) : (
            ""
          )}
          <form className="sign-up-form">
            <div>
              <input
                ref={emailInput}
                type="email"
                name="email"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                ref={passwordInput}
                type="password"
                name="password"
                placeholder="Password"
              />
            </div>
            <div>
              <button
                type="submit"
                onClick={(e) => {
                  logIn(
                    emailInput.current.value,
                    passwordInput.current.value,
                    e
                  );
                  // navigate(`/${user.id}/boards`);
                }}
              >
                Login
              </button>
              <button
                type="submit"
                onClick={(e) =>
                  signUp(
                    emailInput.current.value,
                    passwordInput.current.value,
                    e
                  )
                }
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={() => redirect(user.id)}>Go to Boards</button>
      )}
    </>
  );
}

export default UserForm;
