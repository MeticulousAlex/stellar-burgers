import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorText, setErrorText] = useState('');
  const { values, handleChange } = useForm({ email: '', password: '' });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    dispatch(loginUser({ email: values.email, password: values.password }))
      .unwrap()
      .then(() => {
        const from =
          (location.state as { from?: { pathname: string } })?.from?.pathname ||
          '/';
        navigate(from, { replace: true });
      })
      .catch((err: Error) => {
        setErrorText(err.message || 'Ошибка авторизации');
      });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={values.email}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
