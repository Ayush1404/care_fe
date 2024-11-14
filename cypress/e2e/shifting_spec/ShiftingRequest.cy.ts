import LoginPage from "pageobject/Login/LoginPage";
import { PatientConsultationPage } from "pageobject/Patient/PatientConsultation";
import { PatientPage } from "pageobject/Patient/PatientCreation";
import ShiftCreation from "pageobject/Shift/ShiftCreation";
import { ShiftDetails } from "pageobject/Shift/ShiftDetails";
import { ShiftingBoard } from "pageobject/Shift/ShiftingBoard";
import ShiftUpdate from "pageobject/Shift/ShiftUpdate";

describe("New shifting request", () => {
  const loginPage = new LoginPage();
  const shiftCreation = new ShiftCreation();
  const shiftingBoard = new ShiftingBoard();
  const shiftDetails = new ShiftDetails();
  const shiftUpdate = new ShiftUpdate();
  const patientPage = new PatientPage();
  const patientConsultationPage = new PatientConsultationPage();

  const patientName = "Dummy Patient 16";
  const currentFacilityPerson = "new";
  const currentFacilityPhone = "9465666768";
  const shiftReasonInitial = "emmergency";
  const ambulanceDriverNameInitial = "Rahul";
  const ambulancePhoneInitial = "9865666768";
  const ambulanceNumberInitial = "1";
  const commentInitial = "Some comment";

  const shiftReasonUpdated = "new reason";
  const ambulanceDriverNameUpdated = "Ramesh";
  const ambulancePhoneUpdated = "9755443232";
  const ambulanceNumberUpdated = "2";
  const commentUpdated = "New comment";

  before(() => { 
    loginPage.loginAsDisctrictAdmin(); 
    cy.saveLocalStorage(); 
  });

  beforeEach(() => { 
    cy.restoreLocalStorage(); 
  });

  it("Shift Request Creation and Update", () => {
    cy.visit('/patients');
    patientPage.visitPatient(patientName);
    patientConsultationPage.clickShiftPatientButton();
    
    shiftCreation.typeCurrentFacilityPerson(currentFacilityPerson);
    shiftCreation.typeCurrentFacilityPhone(currentFacilityPhone);
    shiftCreation.typeShiftReason(shiftReasonInitial);
    shiftCreation.typeAmbulanceDriverName(ambulanceDriverNameInitial);
    shiftCreation.typeAmbulancePhone(ambulancePhoneInitial);
    shiftCreation.typeAmbulanceNumber(ambulanceNumberInitial);
    shiftCreation.typeComment(commentInitial);
    shiftCreation.interceptShiftCreationRequest();
    shiftCreation.submitShiftForm();
    
    cy.wait("@shiftRequest").its("response.statusCode").should("eq", 201);

    cy.visit("/shifting/board");
    cy.contains(patientName).should("exist");
  
    shiftingBoard.openDetails(patientName);
    shiftDetails.clickUpdateStatusButton();

    shiftUpdate.typeShiftReason(shiftReasonUpdated);
    shiftUpdate.typeAmbulanceDriverName(ambulanceDriverNameUpdated);
    shiftUpdate.typeAmbulancePhone(ambulancePhoneUpdated);
    shiftUpdate.typeAmbulanceNumber(ambulanceNumberUpdated);
    shiftUpdate.typeComment(commentUpdated);
    shiftUpdate.interceptShiftUpdateRequest();
    shiftUpdate.submitShiftForm();

    cy.wait('@shiftUpdateRequest').then((interception) => {
      const responseData = interception.response.body;
      expect(responseData.patient_object.name).to.eq(patientName);
      expect(responseData.ambulance_phone_number).to.eq(`+91${ambulancePhoneUpdated}`);
      expect(responseData.comments).to.eq(commentUpdated);
      expect(responseData.reason).to.eq(shiftReasonUpdated);
      expect(responseData.ambulance_driver_name).to.eq(ambulanceDriverNameUpdated);
      expect(responseData.ambulance_number).to.eq(ambulanceNumberUpdated);
    });

    cy.get('#shift_details_name').should('be.visible').and('have.text', patientName);
    cy.get('#shift_details_ambulance_phone_number').should('be.visible').and('have.text', `+91${ambulancePhoneUpdated}`);
    cy.get('#shift_details_ambulance_number').should('be.visible').and('have.text', ambulanceNumberUpdated);
    cy.get('#shift_details_comments').should('be.visible').and('have.text', commentUpdated);
    cy.get('#shift_details_reason').should('be.visible').and('have.text', shiftReasonUpdated);
    cy.get('#shift_details_ambulance_driver_name').should('be.visible').and('have.text', ambulanceDriverNameUpdated);
  
  });
  afterEach(() => { 
    cy.saveLocalStorage(); 
  });
});
