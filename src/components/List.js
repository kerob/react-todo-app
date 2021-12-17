import { useState, useRef, useEffect, useContext } from "react";
import Card from "./Card";
import PropTypes from "prop-types";
import { cardsRef, listsRef } from "../firebase";
import { AuthContext } from "./AuthContext";
import {
  addDoc,
  // getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
} from "@firebase/firestore";

function List(props) {
  const [cards, setCards] = useState([]);
  const { user } = useContext(AuthContext);
  const nameInput = useRef(null);

  useEffect(() => {
    // fetchCards(props.list.id);
    const q = query(
      cardsRef,
      where("card.listId", "==", props.list.id),
      orderBy("card.createdAt")
    );
    onSnapshot(q, (snapshot) => {
      let outCards = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data().card;
        const card = {
          id: doc.id,
          // title: doc.data().card.text,
          // labels: doc.data().card.labels,
          ...data,
        };
        outCards.push(card);
      });
      setCards(outCards);
    });
  }, [props.list.id]);

  const deleteList = () => {
    let listId = props.list.id;
    props.deleteList(listId);
  };

  const updateList = async (e) => {
    try {
      let listId = props.list.id;
      const newTitle = e.currentTarget.value;
      const list = await doc(listsRef, listId);
      updateDoc(list, { "list.title": newTitle });
    } catch (error) {
      console.error("Error updating list: ", error);
    }
  };

  // const fetchCards = async (listId) => {
  //   try {
  //     const outCards = [];
  //     const q = query(
  //       cardsRef,
  //       where("card.listId", "==", listId),
  //       orderBy("card.createdAt")
  //     );
  //     const cards = await getDocs(q);
  //     cards.forEach((card) => {
  //       const data = card.data().card;
  //       const cardObj = {
  //         id: card.id,
  //         ...data,
  //       };
  //       outCards.push(cardObj);
  //     });
  //     setCards(outCards);
  //   } catch (error) {
  //     console.error("Error fetching cards: ", error);
  //   }
  // };

  const createNewCard = async (e, userId) => {
    try {
      e.preventDefault();
      const card = {
        text: nameInput.current.value,
        listId: props.list.id,
        labels: [],
        createdAt: new Date(),
        user: userId,
      };
      if (card.text && card.listId) {
        await addDoc(cardsRef, { card });
      }
      nameInput.current.value = "";
      console.log("new card added " + card.text);
    } catch (error) {
      console.error("Error creating new card: ", error);
    }
  };

  return (
    <div className="list">
      <div className="list-header">
        <input
          type="text"
          name="listTitle"
          onChange={updateList}
          defaultValue={props.list.title}
        />
        {/* <p>{props.list.title}</p> */}
        <span onClick={deleteList}>&times;</span>
      </div>
      {Object.keys(cards).map((index) => (
        <Card key={index} data={cards[index]} />
      ))}
      <form
        onSubmit={(e) => createNewCard(e, user.id)}
        className="new-card-wrapper"
      >
        <input
          type="text"
          ref={nameInput}
          name="name"
          placeholder=" + New Card"
        />
      </form>
    </div>
  );
}

List.propTypes = {
  list: PropTypes.object.isRequired,
  deleteList: PropTypes.func.isRequired,
};

export default List;
