import React from "react";
import EditProfileModal from "../components/editProfile/editProfileModal";

export default function ModalContent({ modal }) {
  const { type } = modal;
  const ModalTypes = {
    ADD_MOOD: "ADD_MOOD",
    EDIT_MOOD: "EDIT_MOOD",
    EDIT_PROFILE: "EDIT_PROFILE",
    VIEW_STATS: "VIEW_STATS",
  };

  switch (type) {
    case ModalTypes.ADD_MOOD:
      return <addMood />;
    case ModalTypes.EDIT_MOOD:
      return <editMood />;
    case ModalTypes.EDIT_PROFILE:
      return <EditProfileModal />;
    default:
      return null;
  }
}
