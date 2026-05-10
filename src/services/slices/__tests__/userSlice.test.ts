import userReducer, {
  checkUserAuth,
  loginUser,
  registerUser,
  logoutUser,
  fetchUserOrders
} from '../userSlice';
import { TUser, TOrder } from '@utils-types';

const mockUser: TUser = {
  email: 'test@test.com',
  name: 'Test User'
};

const mockOrders: TOrder[] = [
  {
    _id: 'order-1',
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 1001,
    ingredients: ['643d69a5c3f7b9001cfa093c']
  }
];

describe('userSlice', () => {
  const initialState = {
    isAuthChecked: false,
    user: null,
    orders: [],
    isLoading: false,
    error: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('checkUserAuth', () => {
    it('должен устанавливать isAuthChecked в true и сохранять пользователя при fulfilled', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it('должен устанавливать isAuthChecked в true и user в null при rejected', () => {
      const action = { type: checkUserAuth.rejected.type };
      const state = userReducer(initialState, action);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });
  });

  describe('loginUser', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });

    it('должен сохранять ошибку при rejected', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('registerUser', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });

    it('должен сохранять ошибку при rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Ошибка регистрации' }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка регистрации');
    });
  });

  describe('logoutUser', () => {
    it('должен очищать пользователя при fulfilled', () => {
      const stateWithUser = { ...initialState, user: mockUser };
      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer(stateWithUser, action);
      expect(state.user).toBeNull();
    });
  });

  describe('fetchUserOrders', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('должен сохранять заказы при fulfilled', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
    });

    it('должен сохранять ошибку при rejected', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Ошибка загрузки заказов' }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки заказов');
    });
  });
});
