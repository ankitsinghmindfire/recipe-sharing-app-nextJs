'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Button from '../_components/button/Button';
import InputField from '../_components/input/InputField';
import { Messages } from '../lib/utils/messages';
import {
  emailRegex,
  passwordRegex,
  nameRegex,
} from '../lib/utils/appConstants';
import { request } from '../lib/utils/request';
import { API, ApiMethods } from '../lib/utils/util';

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    const { username, password, name } = getValues();

    try {
      const data = {
        username: username,
        password: password,
        fullName: name,
      };
      const response = await request({
        url: API.authAPI.register,
        method: ApiMethods.POST,
        body: { ...data },
      });
      if (response) {
        if (response.error) {
          toast.warn(response.error);
        } else {
          toast.success(response.message);
          setTimeout(() => {
            router.push('/login');
          }, 4000);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(Messages.errors.USER_NOT_REGISTERED);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className='auth-container'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Register</h2>
          <div className='form-group'>
            <InputField
              type='text'
              id='name'
              label='Full Name'
              {...register('name', {
                required: 'Name is required',
                pattern: {
                  value: nameRegex,
                  message: Messages.errors.INVALID_NAME,
                },
              })}
            />
            {errors.name && (
              <span className='error'>{errors.name.message}</span>
            )}
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
          <Button type='submit' className='btn-register' id={'register'}>
            Register
          </Button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
