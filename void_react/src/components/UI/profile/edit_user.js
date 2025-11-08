import { useState } from "react";

export const useEditProfile = () => {
  const [sostEditProfile, setSostEditProfile] = useState(false);

  const OpenEditProfile = (sostEditProfile) => {
    setSostEditProfile(true);
  };
  const CloseEditProfile = () => {
    setSostEditProfile(false);
  };


  return {
    sostEditProfile,
    OpenEditProfile,
    CloseEditProfile,
  };
};
