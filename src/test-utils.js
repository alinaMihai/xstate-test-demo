export function addTests(state, tests) {
    return {
      ...state,
      states: Object.entries(state.states).reduce((s, [stateKey, stateValue]) => {
        return {
          ...s,
          [stateKey]: {
            ...stateValue,
            meta: {
              ...stateValue.meta,
              test: tests[stateKey]
            }
          }
        };
      }, {})
    };
  }
  