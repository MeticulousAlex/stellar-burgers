import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserOrders = (state: RootState) => state.user.orders;
export const selectUserError = (state: RootState) => state.user.error;
