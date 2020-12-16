type State = string;
type InputSymbol = string;

// just make sure code is clear and concise and testing is good
// and that I have a variety of machines being tested

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
    console.log(state);

    const {
      description: { transitions },
    } = this;

    let possibleTransitions = [];
    let usedSymbol = false;

    // only loops the number of times of all states
    for (let i = 0; i < Object.keys(transitions).length; i++) {
      console.log(i);
      let newlyAdded = [];
      // this doesn't work
      // you can use the symbol multiple times just not on same "path" in machine\
      // if you haven't used symbol or on different path (how do we keep track of what path we are on)
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

    if (!usedSymbol) {
      possibleTransitions = [];
    }

    console.log(symbol);
    console.log(possibleTransitions);

    return possibleTransitions;
  }

  accept(s: string, state = [this.description.start]): boolean {
    const {
      description: { acceptStates },
    } = this;

    console.log('hi');
    console.log(state);
    console.log('bye');

    let nextStates = [];
    if (s.length > 0) {
      for (const currentState of state) {
        nextStates = nextStates.concat(
          this.transition(currentState, s.charAt(0))
        );
      }
    }

    const uniqueStates = [...new Set(nextStates)];

    console.log(state); // doesn't
    console.log(s);
    console.log(uniqueStates);

    return s.length === 0
      ? state.some((r) => acceptStates.includes(r))
      : this.accept(s.substr(1), uniqueStates);
  }
}
