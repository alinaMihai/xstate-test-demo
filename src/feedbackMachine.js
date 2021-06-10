import { Machine } from 'xstate';

export const feedbackMachineStates = {
  states: {
    question: {
      on: {
        CLICK_GOOD: 'thanks',
        CLICK_BAD: 'form',
        CLOSE: 'closed'
      }
    },
    form: {
        on: {
          SUBMIT: [
            {
              target: 'thanks',
              cond: (_, {value = ""}) => value.length > 0
            }
          ],
          CLOSE: 'closed'
        },
    },
    thanks: {
      on: {
        CLOSE: 'closed'
      },
    },
    closed: {
      type: 'final'
    }
  }
}

export const feedbackMachine = (feedbackStates = feedbackMachineStates) => Machine({
  id: 'feedback',
  initial: 'question',
  on: {
    ESC: "closed",
  },
  ...feedbackStates
});
