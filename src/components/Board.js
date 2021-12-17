import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router";
import List from "./List";
import { listsRef, boardsRef } from "../firebase";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import {
  addDoc,
  // getDocs,
  query,
  where,
  doc,
  getDoc,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "@firebase/firestore";

function Board(props) {
  const [lists, setLists] = useState([]);
  const [currentBoard, setCurrentBoard] = useState({});
  const [message, setMessage] = useState("");
  const addBoardInput = useRef(null);
  const { boardId } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getBoard(boardId);
    //getLists(boardId)
  }, [boardId]);

  useEffect(() => {
    const q = query(
      listsRef,
      where("list.board", "==", boardId),
      orderBy("list.createdAt")
    );
    onSnapshot(q, (snapshot) => {
      let outLists = [];
      snapshot.docs.forEach((doc) => {
        const list = {
          id: doc.id,
          title: doc.data().list.title,
        };
        outLists.push(list);
      });
      setLists(outLists);
    });
  }, [boardId]);

  // const getLists = async (reqId) => {
  //   try {
  //     let outLists = [];
  //     const q = query(
  //       listsRef,
  //       where("list.board", "==", reqId),
  //       orderBy("list.createdAt")
  //     );
  //     // const fetchLists = await getDocs(q);
  //     // fetchLists.forEach((list) => {
  //     //   const data = list.data().list;
  //     //   const listObj = {
  //     //     id: list.id,
  //     //     ...data,
  //     //   };
  //     //   outLists.push(listObj);
  //     // });
  //     // setLists(outLists);

  //     onSnapshot(q, (snapshot) => {
  //       snapshot.docs.forEach((doc) => {
  //         const list = {
  //           id: doc.id,
  //           title: doc.data().list.title,
  //         };
  //         outLists.push(list);
  //       });
  //       setLists(outLists);
  //     });
  //   } catch (error) {
  //     console.log("Error fetching lists: ", error);
  //   }
  // };

  const getBoard = async (searchId) => {
    try {
      let docRef = doc(boardsRef, searchId);
      let dbBoard = await getDoc(docRef);
      setCurrentBoard(dbBoard.data().board);
    } catch (error) {
      setMessage("Board not found...");
    }
  };

  const createNewList = async (e, userId) => {
    try {
      e.preventDefault();
      const list = {
        title: addBoardInput.current.value,
        board: boardId,
        createdAt: serverTimestamp(),
        user: userId,
      };
      if (list.title && list.board) {
        await addDoc(listsRef, { list });
      }
      addBoardInput.current.value = "";
    } catch (error) {
      console.error("Error creating a new list: ", error);
    }
  };

  const deleteBoard = async () => {
    props.deleteBoard(boardId);
    setMessage("Board not found...");
  };

  const updateBoard = (e) => {
    let newTitle = e.currentTarget.value;
    if (boardId && newTitle) {
      props.updateBoard(boardId, newTitle);
    }
  };

  return (
    <>
      {user.id === currentBoard.user ? (
        <div
          className="board-wrapper"
          style={{
            backgroundColor: currentBoard.background,
          }}
        >
          {message === "" ? (
            <div className="board-header">
              {/* <h3>{currentBoard.title}</h3> */}
              <input
                type="text"
                name="boardTitle"
                onChange={updateBoard}
                defaultValue={currentBoard.title}
              />
              <button onClick={deleteBoard}>Delete Board</button>
            </div>
          ) : (
            <h2>{message}</h2>
          )}

          {/* {console.log(location)} */}
          <div className="lists-wrapper">
            {Object.keys(lists).map((index) => (
              <List
                key={lists[index].id}
                list={lists[index]}
                deleteList={props.deleteList}
              />
            ))}
          </div>
          <form
            onSubmit={(e) => createNewList(e, user.id)}
            className="new-list-wrapper"
          >
            <input
              type={message === "" ? "text" : "hidden"}
              ref={addBoardInput}
              name="name"
              placeholder=" + New List"
            />
          </form>
        </div>
      ) : (
        <span></span>
      )}
    </>
  );
}

Board.propTypes = {
  deleteBoard: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
  updateBoard: PropTypes.func.isRequired,
};

export default Board;
