import type { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import { createMutation } from 'react-query-kit';

import { client } from '@/api';
import type { FormType, LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { useAuth } from '@/core';
import { FocusAwareStatusBar } from '@/ui';

type Variables = FormType;
type Response = {
  data: {
    accessToken:string;
    refreshToken:string
  }
};

const useLoginMutation = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/auth/login',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const { mutate: loginMutate } = useLoginMutation({
    onSuccess: (data) => {
      signIn({access: data.data.accessToken, refresh: data.data.refreshToken});
      showMessage({
        message: 'Login successful',
        type: 'success',
      });
      router.replace('/');
    },
    onError: () => {
      showMessage({
        message: 'Login failed',
        type: 'danger',
      });
    },
  });
  
  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    const normalizedValues = {
      ...data,
      email: data.email.toLowerCase(),
    };
    loginMutate(normalizedValues);
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
