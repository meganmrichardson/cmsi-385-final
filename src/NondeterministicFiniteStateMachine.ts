/*
Nondeterministic Finite State Machine Simulator
Author: Megan Richardson

This is a NFA simulator that takes in the description of a machine and 
determines if a given string is accepted or rejected by the machine. 
This simulator works for any machine with the alphabet {0, 1} and acts 
as an NFA (i.e. accounts for lambda moves and transitions to multiple 
or no states).
*/

type State = string;
type InputSymbol = string;

// just make sure code is clear and concise and testing is good
// and that I have a variety of machines being tested

export interface NFADescription {
  transitions: {
    [key: string]: {
      0: State[];
      1: State[];
      '': State[];
    };
  };
  start: State;
  acceptStates: State[];
}

export default class NondeterministicFiniteStateMachine {
  private description: NFADescription;

  constructor(description: NFADescription) {
    this.description = description;
  }

  transition(state: State, symbol: InputSymbol): State[] {
    const {
      description: { transitions },
    } = this;
    let possibleTransitions = [];
    let statesUsingSymbol = [];
    for (let i = 0; i < Object.keys(transitions).length; i++) {
      if (!statesUsingSymbol.includes(state)) {
        for (const newState of transitions[state][symbol]) {
          if (!possibleTransitions.includes(newState)) {
            possibleTransitions.push(newState);
            statesUsingSymbol = statesUsingSymbol.concat(newState);
          }
        }
      }
      for (const newState of transitions[state]['']) {
        if (!possibleTransitions.includes(newState)) {
          possibleTransitions.push(newState);
        }
      }
      if (i < possibleTransitions.length) {
        state = possibleTransitions[i];
      }
    }
    if (statesUsingSymbol.length == 0) {
      possibleTransitions = [];
    }
    return possibleTransitions;
  }

  accept(s: string, state = [this.description.start]): boolean {
    const {
      description: { acceptStates },
    } = this;
    let nextStates = [];
    if (s.length > 0) {
      for (const currentState of state) {
        nextStates = nextStates.concat(
          this.transition(currentState, s.charAt(0))
        );
      }
    }
    const uniqueStates = [...new Set(nextStates)];
    return s.length === 0
      ? state.some((r) => acceptStates.includes(r))
      : this.accept(s.substr(1), uniqueStates);
  }
}
