describe('Dashboard E2E', () => {
  it('should display the test customer on the dashboard', () => {
    cy.visit('/dashboard');
    cy.contains('Test Customer').should('exist');
  });
}); 