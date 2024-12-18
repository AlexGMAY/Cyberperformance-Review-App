import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import AuthContext from '../context/authContext';
import Header from '../components/Common/Header';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savePassword, setSavePassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(emailOrUsername, password);
    if (success) {
      if (savePassword) {
        localStorage.setItem('emailOrUsername', emailOrUsername);
        localStorage.setItem('password', password);
      }
      navigate('/dashboard');
    } else {
      setError('Invalid login credentials');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}api/auth/google`, '_self');
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-cyan-500 via-blue-700 to-cyan-500"
    >
      <Header />
      <div className='flex flex-col items-center justify-center '>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="emailOrUsername" className="block text-gray-700">
                Email or Username
              </label>
              <input
                type="text"
                id="emailOrUsername"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
              <p className='text-sm font-semibold text-cyan-600'>**Username for Admins & Email for Clients / Employees</p>
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-700 text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={savePassword}
                  onChange={(e) => setSavePassword(e.target.checked)}
                />
                Save Password
              </label>
              <a href="/forgot-password" className="text-cyan-500 hover:underline text-sm">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mt-4 bg-gray-100 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors flex items-center justify-center"
            >
              <FcGoogle className="mr-2 text-lg" />
              Login with Google
            </button>
          </form>
        </div>
      </div>      
    </div>
  );
};

export default Login;
