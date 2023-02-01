import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import FormRow from '../components/FormRow';
import axios from 'axios';
import useLocalState from '../hooks/useLocalState.js';
import url from '../utils/url.js';

const Register = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

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
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    hideAlert();
    setIsLoading(true);
    const { name, email, password } = values;
    const registerNewUser = { name, email, password };

    try {
      const { data } = await axios.post(
        `${url}/api/v1/auth/register`,
        registerNewUser,
        {
          withCredentials: true
        }
      );

      setSuccess(true);
      setValues({ name: '', email: '', password: '' });
      showAlert({ text: data.msg, type: 'success' });
    } catch (error) {
      const { msg } = error.response.data;
      showAlert({ text: msg || "Une erreur s'est produite" });
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
          onSubmit={onSubmit}
        >
          {/* single form row */}
          <FormRow
            type='name'
            name='name'
            value={values.name}
            handleChange={handleChange}
          />
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
            {isLoading ? 'Chargement...' : "S'enregister"}
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

const Wrapper = styled.section`
  .alert {
    margin-top: 3rem;
    margin-bottom: -1.5rem;
  }
  h4 {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .login-link {
    display: inline-block;
    margin-left: 0.25rem;
    text-transform: capitalize;
    color: var(--primary-500);
    cursor: pointer;
  }
  .btn:disabled {
    cursor: not-allowed;
  }
`;

export default Register;
