import { Link } from 'react-router-dom';
import styled from 'styled-components';
import main from '../assets/main.svg';
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context';

const Home = () => {
  const { user } = useGlobalContext();

  return (
    <>
      {user && <Navigate to='/dashboard' />}
      <Wrapper className='page'>
        <div className='info'>
          <h2>
            <span>Auth</span>
            Workflow
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque eum
            facere cupiditate, beatae enim a distinctio! Provident cupiditate
            maxime atque autem voluptatem nostrum blanditiis. Repellendus odio
            ipsam vitae commodi laborum.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut iure
            libero corrupti fugiat, ea id sed repellendus maiores quam doloribus
            aliquam expedita tempore, non facilis.
          </p>

          <Link to='/login' className='btn'>
            Se connecter
          </Link>
          <Link to='/register' className='btn'>
            S'enregister
          </Link>
        </div>
        <img src={main} alt="recherche d'emploi" className='img main-img' />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: grid;
  align-items: center;
  h2 {
    font-weight: 700;
  }
  h2 span {
    color: var(--primary-500);
  }
  .main-img {
    display: none;
  }
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 6rem;
    .main-img {
      display: block;
    }
  }
  .btn {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
`;

export default Home;
