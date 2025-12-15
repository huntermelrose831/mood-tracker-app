import { useState } from "react";
import ModalForm from "../../ModalForm/ModalForm";
import "../../ModalForm/ModalForm.css";
import ModalContent from "../../ModalForm/ModalContent";

function EditMood({ isOpen, onClose, handleSubmit }) {
  const MOOD_OPTIONS = [
    { value: "excited", label: "😄", name: "Excited", rating: 5 },
    { value: "happy", label: "😊", name: "Happy", rating: 4 },
    { value: "neutral", label: "😐", name: "Neutral", rating: 3 },
    { value: "sad", label: "../assets/Sad.jpg", name: "Sad", rating: 2 },
    { value: "angry", label: "😰", name: "Angry", rating: 1 },
  ];

  const ACTIVITY_OPTIONS = [
    "exercise",
    "work",
    "friends",
    "family",
    "hobbies",
    "reading",
    "entertainment",
    "outdoors",
    "relaxation",
  ];
  const [newMood, setNewMood] = useState({
    mood_category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    activities: [],
    mood_rating: 0,
  });
  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Mood"
      modalForm="modal__form"
      modalContentMod="modal__content"
      onSubmit={handleSubmit}
    >
      <label htmlFor="editMood" className="modal__input"></label>
    </ModalForm>
  );
}

export default EditMood;
