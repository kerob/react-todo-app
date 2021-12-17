import { doc, deleteDoc } from "@firebase/firestore";
import PropTypes from "prop-types";
import { cardsRef } from "../firebase";
import EditCardModal from "./EditCardModal";
import { useState } from "react";
import TextareaAutosize from "react-autosize-textarea/lib";

function Card(props) {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const deleteCard = async (e) => {
    try {
      e.preventDefault();
      const cardId = props.data.id;
      const card = doc(cardsRef, cardId);
      await deleteDoc(card);
    } catch (error) {
      console.error("Error deleting card: ", error);
    }
  };
  return (
    <>
      <div className="card">
        <div className="card-labels">
          {props.data.labels.map((label) => {
            return (
              <span
                key={label}
                style={{ background: label }}
                className="label"
              ></span>
            );
          })}
        </div>
        <div className="card-body">
          {/* <p onClick={toggleModal}>{props.data.text}</p> */}
          <TextareaAutosize
            onClick={toggleModal}
            readOnly
            value={props.data.text}
          ></TextareaAutosize>
          <span onClick={deleteCard}>&times;</span>
        </div>
      </div>
      <EditCardModal
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        cardData={props.data}
      />
    </>
  );
}

Card.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Card;
