import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react-burger/images/bun-02.png',
    image_large:
      'https://code.s3.yandex.net/react-burger/images/bun-02-large.png',
    image_mobile:
      'https://code.s3.yandex.net/react-burger/images/bun-02-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react-burger/images/ingredient-01.png',
    image_large:
      'https://code.s3.yandex.net/react-burger/images/ingredient-01-large.png',
    image_mobile:
      'https://code.s3.yandex.net/react-burger/images/ingredient-01-mobile.png'
  }
];

describe('ingredientsSlice', () => {
  const initialState = { items: [], isLoading: false, error: null };

  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять ингредиенты и устанавливать isLoading в false при fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка сети';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('должен устанавливать дефолтную ошибку при rejected без сообщения', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(initialState, action);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });
  });
});
