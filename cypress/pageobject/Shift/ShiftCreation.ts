export class ShiftCreation {
  typeCurrentFacilityPerson(name: string) {
    cy.get("#refering_facility_contact_name").click().type(name);
  }

  typeCurrentFacilityPhone(number: string) {
    cy.get("#refering_facility_contact_number").click().type(number);
  }

  typeShiftReason(reason: string) {
    cy.get("#reason").click().type(reason);
  }

  typeAmbulanceDriverName(name: string) {
    cy.get("#ambulance_driver_name").click().type(name);
  }

  typeAmbulancePhone(number: string) {
    cy.get("#ambulance_phone_number").click().type(number);
  }

  typeAmbulanceNumber(number: string) {
    cy.get("#ambulance_number").click().type(number);
  }
  
  typeComment(comment:string) {
    cy.get('#comments').click().type(comment)
  }

  submitShiftForm() {
    cy.get("#submit").contains("Submit").click();
  }
}
export default ShiftCreation;
