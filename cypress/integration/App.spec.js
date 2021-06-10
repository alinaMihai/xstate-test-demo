/// <reference types="cypress" />

import { createModel } from "@xstate/test";
import {feedbackMachineStates, feedbackMachine} from "../../src/feedbackMachine";
import {addTests} from "../../src/test-utils"
const getFeedbackTestMachine = (feedbackMachineStates) => {
   const statesWithTests =  addTests(feedbackMachineStates, {
     question: ({ findByTestId }) => {
       findByTestId("question-screen").contains(
        "How was your experience?"
      );
     },
     form: ({ findByTestId }) => {
      findByTestId("form-screen").contains("Care to tell us why?");
     },
     thanks: ({ findByTestId }) => {
      findByTestId("thanks-screen").contains(
        "Thanks for your feedback."
      );
     },
     closed: ({ findByTestId }) => {
      findByTestId("question-screen").should("not.exist");
      findByTestId("form-screen").should("not.exist");
      findByTestId("thanks-screen").should("not.exist");
     }
   });
   return feedbackMachine(statesWithTests);
}


const itVisitsAndRunsPathTests = (url) => (path) =>
  it(path.description,  () => {
    return cy.visit(url).then(() => path.test(cy));
  });

const itTests = itVisitsAndRunsPathTests(
  `http://localhost:${process.env.PORT || "3000"}`
);

context("Feedback App", () => {
  const feedbackMachine = getFeedbackTestMachine(feedbackMachineStates)

const testModel = createModel(feedbackMachine).withEvents({
    CLICK_GOOD: ({ findByTestId }) => {
       findByTestId("good-button").click();
    },
    CLICK_BAD: ({ findByTestId }) => {
       findByTestId("bad-button").click();
    },
    CLOSE: ({ findByTestId }) => {
       findByTestId("close-button").click();
    },
    ESC:  () => {
      cy.get("body").type("{esc}");
      // And do this once again to avoid some occasional flake...
      cy.get("body").type("{esc}");
    },
    SUBMIT: {
      exec: ({ findByTestId}, event) => {
        if (event.value?.length)
           findByTestId("response-input").type(event.value);
           findByTestId("submit-button").click();
      },
      cases: [{ value: "something" }, { value: "" }],
    },
});

  const testPlans = testModel.getSimplePathPlans();
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach(itTests);
    });
  });
  describe('coverage', () => {
    it('should pass', () => {
      testModel.testCoverage({
        filter: (stateNode) => !!stateNode.meta
      });
    })
  })
});
