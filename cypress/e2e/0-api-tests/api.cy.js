/// <reference types="cypress" />

//used for api tests: https://reqres.in/

context('api tests with Cypress', () => {
  describe('cypress: api calls tests', () => {
    it('get: users request', () => {
      // make a GET request
      cy.request({
        method: 'GET',
        url: 'https://reqres.in/api/users?page=2',
      }).should(response => {
        // cheks on the response
        expect(response.status).to.equal(200); //status
        expect(response.body).to.have.property('data'); //checking property
        expect(response.body).to.have.property('page');
        expect(response.body).to.have.property('total');
      });
    });

    it('post: create user request', () => {
      // new user data
      const newUser = {
        name: 'morpheus',
        job: 'leader',
      };

      // make a POST request to create a new user
      cy.request({
        method: 'POST',
        url: 'https://reqres.in/api/users',
        body: newUser,
      }).should(response => {
        // checks on the response
        expect(response.status).to.equal(201); // status 201 Created
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.equal(newUser.name);
        expect(response.body.job).to.equal(newUser.job);
        expect(response.body).to.have.property('createdAt');
      });
    });

    it('post: register and login requests', () => {
      // new user data
      const newUser = {
        email: 'eve.holt@reqres.in',
        password: 'pistol',
      };

      // make a POST request to register a new user
      cy.request({
        method: 'POST',
        url: 'https://reqres.in/api/register',
        body: newUser,
      }).should(response => {
        // checks on the response
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('token');
      });

      // make a POST request to register a new user
      cy.request({
        method: 'POST',
        url: 'https://reqres.in/api/login',
        body: newUser,
      }).should(response => {
        // checks on the response
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
      });
    });

    it('post: login requests with missing data', () => {
      // new user data
      const newUser = {
        email: 'eve.holt@reqres.in',
      };

      const errorMessage = 'Missing password';

      // make a POST request to register a new user
      cy.request({
        method: 'POST',
        url: 'https://reqres.in/api/login',
        body: newUser,
        failOnStatusCode: false, //to be able to do checks with status 400
      }).should(response => {
        // checks on the response
        expect(response.status).to.equal(400); // 400 Bad Request
        expect(response.body.error).to.equal(errorMessage);
      });
    });
  });

  describe('cypress: intercept api calls', () => {
    beforeEach(() => {
      cy.visit('https://reqres.in/');
    });

    it('intercept api call and check data', () => {
      //intercept the call - kind of spy :)
      cy.intercept('GET', 'https://reqres.in/api/users/2').as('getUser');

      //click get single user request button
      cy.get('[data-id="users-single"]').click();

      //listener, waiting for api call to be completed
      cy.wait('@getUser').then(xhr => {
        console.log(xhr);
        expect(xhr.response.statusCode).to.equal(200); //statusCode check
        expect(xhr.response.body.data.id).to.equal(2); //check id
        expect(xhr.response.body.data.email).to.equal('janet.weaver@reqres.in');
      });
    });

    it('intercept api call and mock the response', () => {
      //intercept the call - kind of spy :)
      //mock response from fixture: 'mockUser.json'
      cy.intercept('GET', 'https://reqres.in/api/users/2', {
        fixture: 'mockUser.json',
      }).as('getUser');

      //click get single user request button
      cy.get('[data-id="users-single"]').click();

      //listener, waiting for api call to be completed
      cy.wait('@getUser').then(xhr => {
        console.log(xhr);
        expect(xhr.response.statusCode).to.equal(200); //statusCode check
        //     expect(xhr.response.body.data.email).to.equal('test987@reqres.in') //email value from   fixture: 'mockUser.json'
      });

      //fixture data from json
      cy.fixture('mockUser.json').then(file => {
        //UI check: response data is form  fixture: 'mockUser.json'
        cy.get('.response > pre')
          .should('contain', file.data.email)
          .and('contain', file.data.first_name)
          .and('contain', file.data.last_name);
      });
    });

    it('intercept api call and replace the request', () => {
      const newUser = {
        name: 'Olga',
        job: 'QA Engineer',
      };

      //intercept the call - kind of spy :)
      cy.intercept('POST', 'https://reqres.in/api/users', req => {
        req.body.name = newUser.name;
        req.body.job = newUser.job;
      }).as('createUser');

      //click Post button that do call Post users
      cy.get('[data-id="post"]').click();

      //listener, waiting for api call to be completed
      cy.wait('@createUser').then(xhr => {
        console.log(xhr);
        expect(xhr.response.statusCode).to.equal(201); //statusCode check
        expect(xhr.response.body.name).to.equal(newUser.name);
        expect(xhr.response.body.job).to.equal(newUser.job);
      });

      //UI check
      cy.get('.response > pre')
        .should('contain', newUser.name)
        .and('contain', newUser.job);
    });
  });
});
