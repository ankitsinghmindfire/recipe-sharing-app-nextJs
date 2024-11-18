'use client';
import { useForm } from 'react-hook-form';
import Button from '../_components/button/Button';
import InputField from '../_components/input/InputField';
import { Messages } from '../lib/utils/messages';
import { emailRegex, passwordRegex } from '../lib/utils/appConstants';
const Login = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {};
  return (
    <>
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
