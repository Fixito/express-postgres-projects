import { useState } from 'react';

const useLocalState = () => {
  const [alert, setAlert] = useState({
    show: false,
    text: '',
    type: 'danger'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const showAlert = ({ text, type = 'danger' }) => {
    setAlert({ show: true, text, type });
  };

  const hideAlert = () => {
    setAlert({ show: false, text: '', type: 'danger' });
  };

  return {
    alert,
    showAlert,
    isLoading,
    setIsLoading,
    success,
    setSuccess,
    hideAlert
  };
};

export default useLocalState;
