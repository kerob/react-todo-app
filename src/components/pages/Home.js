import BoardPreview from "../BoardPreview";
import PropTypes from "prop-types";
import CreateBoardForm from "../CreateBoardForm";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

function Home(props) {
  let { userId } = useParams();
  let [{ getBoards }] = useState(props);

  useEffect(() => {
    getBoards(userId);
  }, [getBoards, userId]);

  // const getBoards = () => {
  //   props.getBoards();
  // };

  return (
    <>
      <CreateBoardForm createNewBoard={props.createNewBoard} />
      <div className="board-preview-wrapper">
        {/*Converts props object data into array */}
        {Object.keys(props.boards).map((key) => (
          <BoardPreview key={key} board={props.boards[key]} />
        ))}
      </div>
    </>
  );
}

Home.propTypes = {
  boards: PropTypes.array.isRequired,
  createNewBoard: PropTypes.func.isRequired,
  getBoards: PropTypes.func.isRequired,
};

export default Home;
