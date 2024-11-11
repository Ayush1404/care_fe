import LoginPage from "pageobject/Login/LoginPage"
import { PatientConsultationPage } from "pageobject/Patient/PatientConsultation";
import { PatientPage } from "pageobject/Patient/PatientCreation";
import ShiftCreation from "pageobject/Shift/ShiftCreation";
import { ShiftDetails } from "pageobject/Shift/ShiftDetails";
import { ShiftingBoard } from "pageobject/Shift/ShiftingBoard";
import ShiftUpdate from "pageobject/Shift/ShiftUpdate";

describe("New shifting request",() =>{
  const loginPage = new LoginPage();
  const shiftCreation = new ShiftCreation()
  const shiftingBoard = new ShiftingBoard()
  const shiftDetails = new ShiftDetails()
  const shiftUpdate = new ShiftUpdate()
  const patientPage = new PatientPage()
  const patientConsultationPage = new PatientConsultationPage() 

  before(() => { 
    loginPage.loginAsDistrictAdmin(); 
    cy.saveLocalStorage(); 
  });

  beforeEach(() => { 
    cy.restoreLocalStorage(); 
  });

  it("Creating and verifying new shifting request", () => {
    cy.intercept("POST", "api/v1/shift").as("shiftRequest"); 
  
    cy.visit('/patients')
    patientPage.visitPatient("Dummy Patient 16")
    patientConsultationPage.clickShiftPatientButton()
    
    shiftCreation.typeCurrentFacilityPerson("new");
    shiftCreation.typeCurrentFacilityPhone("9465666768");
    shiftCreation.typeShiftReason("emmergency");
    shiftCreation.typeAmbulanceDriverName("Rahul");
    shiftCreation.typeAmbulancePhone("9865666768")
    shiftCreation.typeAmbulanceNumber("1")
    shiftCreation.typeComment("Some comment")
    shiftCreation.submitShiftForm();
    
    cy.wait("@shiftRequest").its("response.statusCode").should("eq", 201);

    cy.visit("/shifting/board");
    cy.contains("Dummy Patient 16").should("exist");
  });

  it("Editing and verifying refelctions in existing request", () => {
    cy.intercept("PUT", "**/api/v1/shift/**").as("shiftUpdateRequest"); 
    cy.visit("/shifting/board");
    cy.contains("Dummy Patient 16").should("exist");

    shiftingBoard.openDetails("Dummy Patient 16")
    shiftDetails.clickUpdateStatusButton()

    shiftUpdate.typeShiftReason("new reason");
    shiftUpdate.typeAmbulanceDriverName("Ramesh");
    shiftUpdate.typeAmbulancePhone("9755443232")
    shiftUpdate.typeAmbulanceNumber("2")
    shiftUpdate.typeComment("New comment")
    shiftUpdate.submitShiftForm();

    cy.wait('@shiftUpdateRequest').then((interception) => {
      const responseData = interception.response.body;
      
      expect(responseData.patient_object.name).to.eq("Dummy Patient 16");
      expect(responseData.ambulance_phone_number).to.eq("+919755443232");
      expect(responseData.comments).to.eq("New comment");
      expect(responseData.reason).to.eq("new reason");
      expect(responseData.ambulance_driver_name).to.eq("Ramesh");
      expect(responseData.ambulance_number).to.eq("2");
    });

  });

  afterEach(() => { 
    cy.saveLocalStorage(); 
  });
})