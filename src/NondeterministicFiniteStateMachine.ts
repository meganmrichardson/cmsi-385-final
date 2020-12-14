type State = string;
type InputSymbol = string;

// currently implements dfa -> must convert to nfa
// transition(state, symbol): set of states
// add recursion to finish accept method
// add alphabet so that accepts more than just 0 and 1

// must change tests so transitions return State[]

export interface NFADescription {
  transitions: {
    [key: string]: {
      // interface should take in alphabet instead of 0, 1
      0: State[];
      1: State[];
      '': State[]; // lambda moves
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

    const possibleTransitions = [];
    possibleTransitions.concat(transitions[state][symbol]);

    // change to while loop and account for ALL possible lambda moves
    for (const newState of transitions[state]['']) {
      possibleTransitions.concat(transitions[newState][symbol]);
    }
    // still an issue with mutltiple lambdas in a row
    return possibleTransitions;
  }

  // recursive
  accept(s: string, state = [this.description.start]): boolean {
    const {
      description: { acceptStates },
    } = this;
    const nextStates = [];
    for (const currentState of state) {
      nextStates.concat(this.transition(currentState, s.charAt(0)));
    }

    // if at last char of string, return if at accept state
    // else recurse on all possible next states

    return s.length === 0
      ? nextStates.some((r) => acceptStates.includes(r))
      : this.accept(s.substr(1), nextStates);
  }
}
