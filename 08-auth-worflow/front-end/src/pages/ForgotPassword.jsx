import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import FormRow from '../components/FormRow';
import axios from 'axios';
import useLocalState from '../hooks/useLocalState';
import url from '../utils/url.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const {
    alert,
    showAlert,
    isLoading,
    setIsLoading,
    success,
    setSuccess,
    hideAlert
  } = useLocalState();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    hideAlert();

    if (!email) {
      showAlert({
        text: 'Veuillez forunir un email'
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${url}/api/v1/auth/forgot-password`, {
        email
      });
      showAlert({ text: data.msg, type: 'success' });
      setSuccess(true);
    } catch (error) {
      showAlert({
        text: "Une erreur s'est produite, veuillez réussir plus tard"
      });
      setSuccess(true);
    }

    setIsLoading(false);
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
          <h4>Mot de passe oublié</h4>
          {/* single form row */}
          <FormRow
            type='email'
            name='email'
            value={email}
            handleChange={handleChange}
          />
          {/* end of single form row */}
          <button type='submit' className='btn btn-block' disabled={isLoading}>
            {isLoading
              ? 'Veuillez attendre...'
              : 'Obtenir le lien de réinitialisation du mot de passe'}
          </button>
          <p>
            Vous avez déjà un compte ?
            <Link to='/login' className='login-link'>
              Se connecter
            </Link>
          </p>
        </form>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.main`
  h4,
  p {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
  }
  .login-link {
    display: inline-block;
    margin-left: 0.25rem;
    text-transform: capitalize;
    color: var(--primary-500);
    cursor: pointer;
  }
`;

export default ForgotPassword;
