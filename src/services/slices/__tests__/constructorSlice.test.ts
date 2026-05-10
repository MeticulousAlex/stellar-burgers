import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun-id',
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
};

const mockIngredient: TIngredient = {
  _id: 'ingredient-id-1',
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
};

const mockIngredient2: TIngredient = {
  _id: 'ingredient-id-2',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react-burger/images/ingredient-02.png',
  image_large:
    'https://code.s3.yandex.net/react-burger/images/ingredient-02-large.png',
  image_mobile:
    'https://code.s3.yandex.net/react-burger/images/ingredient-02-mobile.png'
};

describe('constructorSlice', () => {
  const initialState = { bun: null, ingredients: [] };

  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('addBun', () => {
    it('должен добавлять булку в конструктор', () => {
      const state = constructorReducer(initialState, addBun(mockBun));
      expect(state.bun).toEqual(mockBun);
    });

    it('должен заменять существующую булку', () => {
      const stateWithBun = constructorReducer(initialState, addBun(mockBun));
      const newBun = { ...mockBun, _id: 'new-bun-id', name: 'Новая булка' };
      const state = constructorReducer(stateWithBun, addBun(newBun));
      expect(state.bun).toEqual(newBun);
    });
  });

  describe('addIngredient', () => {
    it('должен добавлять ингредиент с уникальным id', () => {
      const state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockIngredient._id);
      expect(state.ingredients[0].id).toBeDefined();
      expect(typeof state.ingredients[0].id).toBe('string');
    });

    it('должен присваивать уникальные id нескольким одинаковым ингредиентам', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockIngredient));
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент по id', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const addedId = state.ingredients[0].id;
      state = constructorReducer(state, removeIngredient(addedId));
      expect(state.ingredients).toHaveLength(0);
    });

    it('не должен удалять другие ингредиенты', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockIngredient2));
      const idToRemove = state.ingredients[0].id;
      const remainingId = state.ingredients[1].id;
      state = constructorReducer(state, removeIngredient(idToRemove));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe(remainingId);
    });
  });

  describe('moveIngredientUp', () => {
    it('должен перемещать ингредиент вверх', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockIngredient2));
      const secondId = state.ingredients[1].id;
      state = constructorReducer(state, moveIngredientUp(1));
      expect(state.ingredients[0].id).toBe(secondId);
    });

    it('не должен перемещать первый ингредиент вверх', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const firstId = state.ingredients[0].id;
      state = constructorReducer(state, moveIngredientUp(0));
      expect(state.ingredients[0].id).toBe(firstId);
    });
  });

  describe('moveIngredientDown', () => {
    it('должен перемещать ингредиент вниз', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockIngredient2));
      const firstId = state.ingredients[0].id;
      state = constructorReducer(state, moveIngredientDown(0));
      expect(state.ingredients[1].id).toBe(firstId);
    });

    it('не должен перемещать последний ингредиент вниз', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const lastId = state.ingredients[state.ingredients.length - 1].id;
      state = constructorReducer(state, moveIngredientDown(0));
      expect(state.ingredients[state.ingredients.length - 1].id).toBe(lastId);
    });
  });

  describe('clearConstructor', () => {
    it('должен очищать булку и ингредиенты', () => {
      let state = constructorReducer(initialState, addBun(mockBun));
      state = constructorReducer(state, addIngredient(mockIngredient));
      state = constructorReducer(state, clearConstructor());
      expect(state).toEqual(initialState);
    });
  });
});
