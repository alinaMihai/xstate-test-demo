// @ts-check

import React, { useEffect, useState } from 'react';
import {useMachine} from '@xstate/react';
import styled from 'styled-components';
import {feedbackMachine} from './feedbackMachine';
function useKeyDown(key, onKeyDown) {
  useEffect(() => {
    const handler = e => {
      if (e.key === key) {
        onKeyDown();
      }
    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);
  }, [onKeyDown]);
}

const StyledScreen = styled.div`
  padding: 1rem;
  padding-top: 2rem;
  background: white;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;

  > header {
    margin-bottom: 1rem;
  }

  button {
    background: #4088da;
    appearance: none;
    border: none;
    text-transform: uppercase;
    color: white;
    letter-spacing: 0.5px;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 20rem;
    align-self: flex-end;
    cursor: pointer;
    font-size: 0.75rem;

    + button {
      margin-left: 0.5rem;
    }

    &[data-variant='good'] {
      background-color: #7cbd67;
    }
    &[data-variant='bad'] {
      background-color: #ff4652;
    }
  }

  textarea {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #dedede;
    font-size: 1rem;
  }

  [data-testid='close-button'] {
    position: absolute;
    top: 0;
    right: 0;
    appearance: none;
    height: 2rem;
    width: 2rem;
    line-height: 0;
    border: none;
    background: transparent;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    &:before {
      content: '×';
      font-size: 1.5rem;
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

function QuestionScreen({ onClickGood, onClickBad, onClose }) {
  useKeyDown('Escape', onClose);

  return (
    <StyledScreen data-testid="question-screen">
      <header>How was your experience?</header>
      <button
        onClick={onClickGood}
        data-testid="good-button"
        data-variant="good"
      >
        Good
      </button>
      <button onClick={onClickBad} data-testid="bad-button" data-variant="bad">
        Bad
      </button>
      <button data-testid="close-button" title="close" onClick={onClose} />
    </StyledScreen>
  );
}

function FormScreen({ onSubmit, onClose }) {
  const [text, setText] = useState("");
  useKeyDown('Escape', onClose);

  return (
    <StyledScreen
      as="form"
      data-testid="form-screen"
      onSubmit={e => {
        e.preventDefault();
        onSubmit(text);
      }}
    >
      <header>Care to tell us why?</header>
      <textarea
        data-testid="response-input"
        name="response"
        value={text}
        placeholder="Complain here"
        onChange={(e) => setText(e.currentTarget.value)}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            return;
          }
           setText(e.currentTarget.value);
        }}
      />
      <button data-testid="submit-button">Submit</button>
      <button
        data-testid="close-button"
        title="close"
        type="button"
        onClick={onClose}
      />
    </StyledScreen>
  );
}

function ThanksScreen({ onClose }) {
  useKeyDown('Escape', onClose);

  return (
    <StyledScreen data-testid="thanks-screen">
      <header>Thanks for your feedback.</header>
      <button data-testid="close-button" title="close" onClick={onClose} />
    </StyledScreen>
  );
}


function Feedback() {
  const [state, send] = useMachine(feedbackMachine());
    if(state.matches('question')){
      return (
        <QuestionScreen
          onClickGood={() => send({ type: 'CLICK_GOOD' })}
          onClickBad={() => send({ type: 'CLICK_BAD' })}
          onClose={() => send({ type: 'CLOSE' })}
        />
      );
    } else if(state.matches('form')) {
      return (
        <FormScreen
          onSubmit={value => send({ type: 'SUBMIT', value })}
          onClose={() => send({ type: 'CLOSE' })}
        />
      );
    } else if (state.matches('thanks')) {
      return <ThanksScreen onClose={() => send({ type: 'CLOSE' })} />;
    } else {
      return null;
    }
}

const StyledApp = styled.main`
  height: 100vh;
  width: 100vw;
  background: #f5f8f9;
  display: flex;
  justify-content: center;
  align-items: center;

  &,
  * {
    position: relative;
    box-sizing: border-box;
  }
`;

function App() {
  return (
    <StyledApp>
      <Feedback />
    </StyledApp>
  );
}

export default App;
