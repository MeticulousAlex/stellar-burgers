/// <reference types="cypress" />

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' });
  });

  describe('Добавление ингредиентов в конструктор', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    it('должен добавлять булку в конструктор', () => {
      cy.contains('Краторная булка N-200i').closest('li').find('button').click();
      cy.get('[data-testid="burger-constructor"]').within(() => {
        cy.contains('Краторная булка N-200i (верх)').should('exist');
        cy.contains('Краторная булка N-200i (низ)').should('exist');
      });
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .click();
      cy.get('[data-testid="burger-constructor"]').within(() => {
        cy.contains('Выберите начинку').should('not.exist');
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });
    });
  });

  describe('Модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    it('должен открывать модальное окно ингредиента по клику и показывать верные данные', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal"]')
        .find('h3')
        .should('contain', 'Краторная булка N-200i');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="close-button"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );
      cy.setCookie('accessToken', 'test-access-token');
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('refreshToken', 'test-refresh-token');
        }
      });
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    it('должен создавать заказ, показывать номер и очищать конструктор', () => {
      cy.contains('Краторная булка N-200i').closest('li').find('button').click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .click();

      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="order-number"]').should('contain', '12345');

      cy.get('[data-testid="close-button"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');

      cy.get('[data-testid="burger-constructor"]').within(() => {
        cy.contains('Выберите булки').should('exist');
        cy.contains('Выберите начинку').should('exist');
      });
    });
  });
});