import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import FormRow from '../components/FormRow';
import useLocalState from '../hooks/useLocalState.js';
import url from '../utils/url.js';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const { alert, showAlert, isLoading, setIsLoading, success, setSuccess } =
    useLocalState();

  const query = useQuery();

  const handleChange = async (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!password) {
      showAlert({ text: 'Veuillez entrer un mot de passe' });
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        `${url}/api/v1/auth/reset-password`,
        {
          password,
          token: query.get('token'),
          email: query.get('email')
        },
        { withCredentials: true }
      );
      setIsLoading(false);
      setSuccess(true);
      showAlert({
        text: `Succès, redirection vers la page de connexion sous peu`,
        type: 'success'
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      showAlert({ text: error.response.data.msg });
      setIsLoading(false);
    }
  };

  return (
    <Wrapper className='page'>
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>{alert.text}</div>
      )}
      {!success && (
        <form
          className={isLoading ? 'form form-loading' : 'form'}
          onSubmit={handleSubmit}
        >
          <h4>Réinitialiser le mot de passe</h4>
          {/* single form row */}
          <FormRow
            type='password'
            name='mot de passe'
            value={password}
            handleChange={handleChange}
          />
          {/* end of single form row */}
          <button type='submit' className='btn btn-block' disabled={isLoading}>
            {isLoading ? 'Veuillez patienter...' : 'Nouveau mot de passe'}
          </button>
        </form>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  h4,
  p {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
  }
`;

export default ResetPasswordForm;
