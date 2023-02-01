import { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import FormRow from '../components/FormRow';
import { useGlobalContext } from '../context';
import useLocalState from '../hooks/useLocalState';
import url from '../utils/url.js';

import axios from 'axios';

const Login = () => {
  const { saveUser } = useGlobalContext();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const { alert, showAlert, isLoading, setIsLoading, hideAlert } =
    useLocalState();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    hideAlert();
    setIsLoading(true);
    const { email, password } = values;
    const loginUser = { email, password };

    try {
      const { data } = await axios.post(`${url}/api/v1/auth/login`, loginUser, {
        withCredentials: true
      });
      setValues({ name: '', email: '', password: '' });
      showAlert({
        text: `Bienvenue, ${data.user.name}. Redirection vers le tableau de bord...`,
        type: 'success'
      });
      setIsLoading(false);
      saveUser(data.user);
      navigate('/dashboard');
    } catch (error) {
      showAlert({ text: error.response.data.msg });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Wrapper className='page'>
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>{alert.text}</div>
        )}
        <form
          className={isLoading ? 'form form-loading' : 'form'}
          onSubmit={onSubmit}
        >
          {/* single form row */}
          <FormRow
            type='email'
            name='email'
            value={values.email}
            handleChange={handleChange}
          />
          {/* end of single form row */}
          {/* single form row */}
          <FormRow
            type='password'
            name='password'
            value={values.password}
            handleChange={handleChange}
          />
          {/* end of single form row */}
          <button type='submit' className='btn btn-block' disabled={isLoading}>
            {isLoading ? 'Chargement...' : 'Login'}
          </button>
          <p>
            Vous n'avez pas de compte ?
            <Link to='/register' className='register-link'>
              S'enregister
            </Link>
          </p>
          <p>
            Mot de passe oublié ?{' '}
            <Link to='/forgot-password' className='reset-link'>
              Réinitialiser le mot de passe
            </Link>
          </p>
        </form>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.section`
  .alert {
    margin-top: 3rem;
  }
  h4 {
    text-align: center;
  }
  p {
    margin: 0;
    text-align: center;
  }
  .btn {
    margin-bottom: 1.5rem;
  }
  .register-link,
  .reset-link {
    display: inline-block;
    margin-left: 0.25rem;
    text-transform: capitalize;
    color: var(--primary-500);
    cursor: pointer;
  }
  .reset-link {
    margin-top: 0.25rem;
  }
  .btn:disabled {
    cursor: not-allowed;
  }
`;

export default Login;
