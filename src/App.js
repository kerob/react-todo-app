import { useState } from "react";
import Board from "./components/Board";
import Home from "./components/pages/Home";
import UserForm from "./components/UserForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "./components/pages/PageNotFound";
import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header";
import { boardsRef, listsRef, cardsRef } from "./firebase";
import {
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  updateDoc,
  orderBy,
} from "firebase/firestore";

import "./App.css";

function App() {
  const [boards, setBoards] = useState([]);

  // useEffect(() => {
  //   // setBoards(data.boards);
  //   // addDoc(boardsRef, { name: "hello" });
  //   getBoards();
  // }, []);

  const getBoards = async (userId) => {
    try {
      setBoards([]);
      let tempBoards = [];
      const q = query(
        boardsRef,
        where("board.user", "==", userId),
        orderBy("board.createdAt")
      );
      let dbBoards = await getDocs(q);
      //console.log(dbBoards);
      dbBoards.forEach((board) => {
        let data = board.data().board;
        let boardObj = {
          id: board.id,
          ...data,
        };
        // console.log(data);
        tempBoards.push(boardObj);
      });
      setBoards(tempBoards);
    } catch (error) {
      console.log("Error getting boards", error);
    }
  };

  const createNewBoard = async (board) => {
    try {
      const newBoard = await addDoc(boardsRef, { board });
      const boardObj = {
        id: newBoard.id,
        ...board,
      };
      setBoards([...boards, boardObj]);
    } catch (error) {
      console.error("Error creating new board: ", error);
    }
  };

  const deleteList = async (listId) => {
    try {
      const q = query(cardsRef, where("card.listId", "==", listId));
      const cards = await getDocs(q);
      if (cards.size > 0) {
        cards.forEach(async (card) => {
          let ref = doc(cardsRef, card.id);
          deleteDoc(ref);
        });
      }
      const list = doc(listsRef, listId);
      await deleteDoc(list);
    } catch (error) {
      console.error("Error deleting list: ", error);
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      let qList = query(listsRef, where("list.board", "==", boardId));
      let lists = await getDocs(qList);

      if (lists.size > 0) {
        lists.forEach(async (list) => {
          deleteList(list.id);
        });
      }

      const board = await doc(boardsRef, boardId);
      const updatedBoards = boards.filter((board) => {
        return board.id !== boardId;
      });
      setBoards(updatedBoards);
      deleteDoc(board);
    } catch (error) {
      console.error("Error deleting board: ", error);
    }
  };

  const updateBoard = async (boardId, newTitle) => {
    try {
      const board = await doc(boardsRef, boardId);
      updateDoc(board, { "board.title": newTitle });
    } catch (error) {
      console.error("Error updating board: ", error);
    }
  };

  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route exact path="/" element={<UserForm />} />
            <Route
              exact
              path="/:userId/boards"
              // render={() => (
              //   <Home boards={boards} createNewBoard={createNewBoard} />
              // )}
              element={
                <Home
                  boards={boards}
                  getBoards={getBoards}
                  createNewBoard={createNewBoard}
                />
              }
            />
            <Route
              path="/board/:boardId"
              element={
                <Board
                  deleteBoard={deleteBoard}
                  deleteList={deleteList}
                  updateBoard={updateBoard}
                />
              }
            />
            <Route element={<PageNotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
