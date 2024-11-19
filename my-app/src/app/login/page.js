'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Button from '../_components/button/Button';
import InputField from '../_components/input/InputField';
import { Messages } from '../utils/messages';
import { emailRegex, passwordRegex } from '../utils/appConstants';
import { API, ApiMethods } from '../utils/util';
import { toast, ToastContainer } from 'react-toastify';
import { request } from '../utils/request';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../slices/authSlice';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    const { username, password } = getValues();
    try {
      const data = {
        username: username,
        password: password,
      };
      const response = await request({
        url: API.authAPI.login,
        method: ApiMethods.POST,
        body: { ...data },
      });
      if (response) {
        if (response.token) {
          dispatch(
            loginSuccess({
              token: response.token,
              id: response.userId,
              userName: response.userName,
            }),
          );
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userName', response.userName);
          router.push('/');
        } else {
          toast.error(response.error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(Messages.errors.LOGIN_FAILED);
    }
  };
  return (
    <>
      <ToastContainer />
      <div className='auth-container'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Login</h2>
          <div className='form-group'>
            <InputField
              type='text'
              id='username'
              label='Username'
              {...register('username', {
                required: 'Username is required',
                pattern: {
                  value: emailRegex,
                  message: Messages.errors.INVALId_USERNAME,
                },
              })}
            />
            {errors.username && (
              <span className='error'>{errors.username.message}</span>
            )}
          </div>
          <div className='form-group'>
            <InputField
              type='password'
              id='password'
              label='Password'
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: passwordRegex,
                  message: Messages.errors.INVALID_PASSWORD,
                },
              })}
            />
            {errors.password && (
              <span className='error'>{errors.password.message}</span>
            )}
          </div>
          <Button type='submit' className='btn-login' role='button'>
            Login
          </Button>
        </form>
      </div>
    </>
  );
};

export default Login;
