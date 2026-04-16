import { useState } from 'react';

const initialChecklist = {
  roomCleaning: false,
  lightsAndLock: false,
  fireCheck: false,
  furnitureReset: false,
  damageCheck: false,
};

export const useChecklist = () => {
  const [checklist, setChecklist] = useState(initialChecklist);
  const [damageDetails, setDamageDetails] = useState<string>('');

  const handleChecklistChange = (key: keyof typeof initialChecklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecklistCompleted = Object.values(checklist).every(Boolean);

  return { checklist, damageDetails, setDamageDetails, handleChecklistChange, allChecklistCompleted };
};
