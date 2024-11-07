export class ShiftingBoard {
    openDetails(patientName) {
        cy.get('#patient_name').type(patientName);
        cy.intercept("GET", "**/api/v1/shift/**").as("getShiftingRequest");
        cy.wait("@getShiftingRequest").its("response.statusCode").should("eq", 200);
        cy.contains("All Details").click();
    }
}