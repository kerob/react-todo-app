import { doc, updateDoc } from "@firebase/firestore";
import { cardsRef } from "../firebase";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import TextareaAutosize from "react-autosize-textarea/lib";

function EditCardModal(props) {
  const [labels, setLabels] = useState([]);
  let textInput = useRef();
  const allLabels = [
    "#80ccff",
    "#80ffaa",
    "#f94a1e",
    "#ffb3ff",
    "#bf00ff",
    "#ffad33",
  ];
  useEffect(() => {
    setLabels(props.cardData.labels);
  }, [props.cardData.labels]);

  const updateCard = async (e) => {
    try {
      e.preventDefault();
      const cardId = props.cardData.id;
      const newText = textInput.current.value;
      const newLabels = labels;
      const card = await doc(cardsRef, cardId);
      updateDoc(card, { "card.text": newText, "card.labels": newLabels });
      props.toggleModal();
    } catch (error) {
      console.error("Error updating cards: ", error);
    }
  };

  const setLabel = (label) => {
    const newLabels = [...labels];
    if (labels.includes(label)) {
      const filteredLabels = labels.filter((element) => {
        return element !== label;
      });
      setLabels(filteredLabels);
    } else {
      newLabels.push(label);
      setLabels(newLabels);
    }
  };

  return (
    <div
      className="modal-wrapper"
      style={{ display: props.modalOpen ? "block" : "none" }}
    >
      <div className="modal-body">
        <form onSubmit={updateCard}>
          <div>
            <span className="modal-close" onClick={props.toggleModal}>
              &times;
            </span>
            <p className="label-title">add / remove labels:</p>
            {allLabels.map((label) => {
              return (
                <span
                  key={label}
                  onClick={() => setLabel(label)}
                  className="label"
                  style={{ background: label }}
                ></span>
              );
            })}
            <hr />
          </div>
          <div className="edit-area">
            <span className="edit-icon">&#x270E;</span>
            {/* <input
              className="textbox-edit"
              defaultValue={props.cardData.text}
              ref={textInput}
            ></input> */}
            <TextareaAutosize
              className="textbox-edit"
              defaultValue={props.cardData.text}
              ref={textInput}
            ></TextareaAutosize>
          </div>
          <div>
            <p className="labels-title">labels:</p>
            {labels.map((label) => {
              return (
                <span
                  className="label"
                  style={{ background: label }}
                  key={label}
                ></span>
              );
            })}
          </div>
          <button type="submit">Save changes</button>
        </form>
      </div>
    </div>
  );
}

EditCardModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  cardData: PropTypes.object.isRequired,
};

export default EditCardModal;
