import { useContext } from 'react';
import AuthContext from '../../context/authContext';
import logo from '../../assets/logo/Logo_white.png'

const Header = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="container mx-auto flex justify-between items-center p-4">
        <img className='w-60' src={logo} alt="Logo" />        
      </div>
    </header>
  );
};

export default Header;
