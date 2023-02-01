import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalContext } from '../context';
import axios from 'axios';
import url from '../utils/url.js';

const useQuery = () => new URLSearchParams(useLocation().search);

const VerifyPage = () => {
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isLoading } = useGlobalContext();
  const query = useQuery();

  const verifyToken = async () => {
    setLoading(true);

    try {
      await axios.post(
        `${url}/api/v1/auth/verify-email`,
        {
          verificationToken: query.get('token'),
          email: query.get('email')
        },
        {
          withCredentials: true
        }
      );
    } catch (error) {
      // console.log(error.response);
      setIsError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      verifyToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Wrapper className='page'>
        <h2>Chargement...</h2>
      </Wrapper>
    );
  }

  if (isError) {
    return (
      <Wrapper className='page'>
        <h4>Une erreur s'est produite, veuillez bien vérifier votre lien</h4>
      </Wrapper>
    );
  }

  return (
    <Wrapper className='page'>
      <h2>Compte confirmé</h2>
      <Link to='/login' className='btn'>
        Veuillez vous connecter
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.section``;

export default VerifyPage;
