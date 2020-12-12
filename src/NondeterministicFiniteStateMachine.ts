type State = string;
type InputSymbol = string;

// currently implements dfa -> must convert to nfa
// transition(state, symbol): set of states
// add recursion to finish accept method
// add alphabet so that accepts more than just 0 and 1

export interface NFADescription {
  transitions: {
    [key: string]: {
      // interface should take in alphabet instead of 0, 1
      0: State[];
      1: State[];
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
      description: { transitions }
    } = this;

    return transitions[state][symbol];
  }

  // recursive
  accept(s: string, state = this.description.start): boolean {
    const {
      description: { acceptStates }
    } = this;
    // if at last char of string, return if at accept state
    if (s.length === 0) {
      return acceptStates.includes(state);
    }
    // else recurse on all the possible next states
    const nextStates = this.transition(state, s.charAt(0));
    for (const possibleState of nextStates) {
      this.accept(s.substr(1), possibleState);
    }
    return false; // just to get rid of "not all codepaths return a value"
  }
}
