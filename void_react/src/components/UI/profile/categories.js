import { useState } from "react";

export const useCategories = (initialCategories = []) => {
  const [sostCategories, setSostCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] =
    useState(initialCategories);

  const OpenCategories = (sostCategories) => {
    setSostCategories(true);
  };
  const CloseCategories = () => {
    setSostCategories(false);
  };

  const ChangeCategories = (category) => {
    setSelectedCategories((prew) => {
      if (prew.includes(category)) {
        return prev.filter((item) => item !== category);
      } else if (prev.length < 3) {
        return [...prev, category];
      }
      return prev;
    });
  };

  return {
    sostCategories,
    OpenCategories,
    CloseCategories,
  };
};
