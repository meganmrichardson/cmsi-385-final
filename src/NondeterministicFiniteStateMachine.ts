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

    // all the possible state to go to with the given state and input symbol
    let possibleTransitions = [];
    // avoids using the symbol multiple times on the same "path"
    let statesUsingSymbol = [];

    for (let i = 0; i < Object.keys(transitions).length; i++) {
      //finds transitions with symbol if you haven't already used it to get to the current state
      if (!statesUsingSymbol.includes(state)) {
        for (const newState of transitions[state][symbol]) {
          if (!possibleTransitions.includes(newState)) {
            possibleTransitions.push(newState);
            statesUsingSymbol = statesUsingSymbol.concat(newState);
          }
        }
      }
      // takes all the lambda moves to add to new states
      for (const newState of transitions[state]['']) {
        if (!possibleTransitions.includes(newState)) {
          possibleTransitions.push(newState);
        }
      }
      // picks the next state we are analyzing
      if (i < possibleTransitions.length) {
        state = possibleTransitions[i];
      }
    }
    // if we havent used the symbol then we are at "dead state" / not accepted
    if (statesUsingSymbol.length == 0) {
      possibleTransitions = [];
    }
    return possibleTransitions;
  }

  accept(s: string, state = [this.description.start]): boolean {
    const {
      description: { acceptStates },
    } = this;
    // finds all possible next states by finding all the transitions
    let nextStates = [];
    if (s.length > 0) {
      for (const currentState of state) {
        nextStates = nextStates.concat(
          this.transition(currentState, s.charAt(0))
        );
      }
    }
    const uniqueStates = [...new Set(nextStates)];
    // if you have gone through the string and one of the current
    // states is an accept state the string is accepted
    // else recursively find the transitions and states for next char
    return s.length === 0
      ? state.some((r) => acceptStates.includes(r))
      : this.accept(s.substr(1), uniqueStates);
  }
}
