import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";

function CreateBoardForm(props) {
  const { user } = useContext(AuthContext);
  const [board, setBoard] = useState({
    title: "",
    background: "#80ccff",
  });

  function handleSubmit(e, userId) {
    e.preventDefault();
    let newBoard = {
      title: board.title,
      background: board.background,
      createdAt: new Date(),
      user: userId,
    };
    if (newBoard.title && newBoard.background && newBoard.user) {
      props.createNewBoard(newBoard);
    }
  }

  return (
    <>
      <form
        className="create-board-wrapper"
        onSubmit={(e) => handleSubmit(e, user.id)}
      >
        <input
          type="text"
          name="name"
          placeholder="Board name"
          onChange={(e) => setBoard({ ...board, title: e.target.value })}
        />
        <select
          name="background"
          onChange={(e) => {
            setBoard({ ...board, background: e.target.value });
          }}
        >
          <option value="#80ccff">Blue</option>
          <option value="#80ffaa">Green</option>
          <option value="#f94a1e">Red</option>
          <option value="#ffb3ff">Pink</option>
          <option value="#bf00ff">Purple</option>
          <option value="#ffad33">Orange</option>
        </select>
        <button type="submit">Create New Board</button>
      </form>
    </>
  );
}

CreateBoardForm.propTypes = {
  createNewBoard: PropTypes.func.isRequired,
};

export default CreateBoardForm;
