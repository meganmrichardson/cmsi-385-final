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

    console.log(symbol);
    console.log(state);

    let possibleTransitions = [];
    // possibleTransitions = possibleTransitions.concat(
    //   transitions[state][symbol]
    // );

    let usedSymbol = false;

    // keep track of tested states
    // make array for newly added
    // take first from newly added not tested before

    // if state + symbol is not a transition then end somehow (i.e. 1s in this example)

    // only loops the number of times of all states
    for (let i = 0; i < Object.keys(transitions).length; i++) {
      let newlyAdded = [];
      if (!usedSymbol) {
        for (const newStates of transitions[state][symbol]) {
          for (const newState of newStates) {
            if (!possibleTransitions.includes(newState)) {
              newlyAdded = newlyAdded.concat(newStates);
              possibleTransitions = possibleTransitions.concat(newStates);
              usedSymbol = true;
            }
          }
        }
      }
      for (const newStates of transitions[state]['']) {
        for (const newState of newStates) {
          if (!possibleTransitions.includes(newState)) {
            newlyAdded = newlyAdded.concat(newStates);
            possibleTransitions = possibleTransitions.concat(newStates);
          }
        }
      }
      for (let i = newlyAdded.length - 1; i >= 0; i--) {
        state = newlyAdded[i];
      }
    }

    console.log('TRANSITIONS');
    console.log(possibleTransitions);

    return possibleTransitions;
  }

  accept(s: string, state = [this.description.start]): boolean {
    console.log('CURRENT STATE');
    console.log(state);
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

    // if at last char of string, return if at accept state
    // else recurse on all possible next states

    return s.length === 0
      ? state.some((r) => acceptStates.includes(r))
      : this.accept(s.substr(1), nextStates);
  }
}
