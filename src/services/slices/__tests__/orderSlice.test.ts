import orderReducer, { clearOrderModal, createOrder } from '../orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order-test-id',
  status: 'created',
  name: 'Флюоресцентный бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: []
};

describe('orderSlice', () => {
  const initialState = {
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('createOrder', () => {
    it('должен устанавливать orderRequest в true при pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять данные заказа и устанавливать orderRequest в false при fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).not.toBeNull();
      expect(state.orderModalData?.number).toBe(mockOrder.number);
      expect(state.orderModalData?.name).toBe(mockOrder.name);
    });

    it('должен сохранять ошибку и устанавливать orderRequest в false при rejected', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('clearOrderModal', () => {
    it('должен очищать данные модального окна заказа', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: mockOrder
      };
      const state = orderReducer(stateWithOrder, clearOrderModal());
      expect(state.orderModalData).toBeNull();
    });
  });
});
