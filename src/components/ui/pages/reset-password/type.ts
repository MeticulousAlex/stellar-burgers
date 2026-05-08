import { ChangeEvent, SyntheticEvent } from 'react';

export type ResetPasswordUIProps = {
  errorText: string | undefined;
  password: string;
  token: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};
