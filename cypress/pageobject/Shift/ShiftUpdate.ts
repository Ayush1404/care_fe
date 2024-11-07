export class ShiftUpdate {
  typeShiftReason(reason: string) {
    cy.get("#reason").click().clear().type(reason);
  }
  
  typeAmbulanceDriverName(name: string) {
    cy.get("#ambulance_driver_name").click().clear().type(name);
  }
  
  typeAmbulancePhone(number: string) {
    cy.get("#ambulance_phone_number").click().clear().type(number);
  }
  
  typeAmbulanceNumber(number: string) {
    cy.get("#ambulance_number").click().clear().type(number);
  }
  
  typeComment(comment: string) {
    cy.get('#comments').click().clear().type(comment);
  }
  
  submitShiftForm() {
    cy.get("#submit").contains("Submit").click();
  }
}
export default ShiftUpdate;
  