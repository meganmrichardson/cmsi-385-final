import test from 'ava';

import NondeterministicFiniteStateMachine, {
  NFADescription,
} from './NondeterministicFiniteStateMachine';

const machineTests: {
  [name: string]: {
    description: NFADescription;
    acceptedStrings: string[];
    rejectedStrings: string[];
  };
} = {
  // should still work as an nfa
  startsWith0: {
    description: {
      transitions: {
        S: {
          0: ['A'],
          1: ['B'],
          '': [],
        },
        A: {
          0: ['A'],
          1: ['A'],
          '': [],
        },
        B: {
          0: ['B'],
          1: ['B'],
          '': [],
        },
      },
      start: 'S',
      acceptStates: ['A'],
    },
    acceptedStrings: ['0', '001', '0111111', '00000'],
    rejectedStrings: ['', '1', '1000000', '1101'],
  },
  // should still work as nfa
  div3: {
    description: {
      transitions: {
        r0: {
          0: ['r0'],
          1: ['r1'],
          '': [],
        },
        r1: {
          0: ['r2'],
          1: ['r0'],
          '': [],
        },
        r2: {
          0: ['r1'],
          1: ['r2'],
          '': [],
        },
      },
      start: 'r0',
      acceptStates: ['r0'],
    },
    // acceptedStrings: ['', '0', '11', '00000', '1100000'],
    acceptedStrings: ['0'],
    rejectedStrings: ['1010', '10', '100000', '1011111'],
  },
  // strings divisible by 4
  div4: {
    description: {
      transitions: {
        q0: {
          0: ['q1', 'q0'],
          1: ['q0'],
          '': [],
        },
        q1: {
          0: ['q2'],
          1: [],
          '': [],
        },
        q2: {
          0: [],
          1: [],
          '': [],
        },
      },
      start: 'q0',
      acceptStates: ['q2'],
    },
    acceptedStrings: ['00', '1100', '010100', '0000'],
    rejectedStrings: ['1111', '1', '0', '10110'],
  },
  lambdaZeros: {
    description: {
      transitions: {
        A: {
          0: [],
          1: [],
          '': ['B'],
        },
        B: {
          0: ['C'],
          1: [],
          '': [],
        },
        C: {
          0: [],
          1: [],
          '': ['A'],
        },
      },
      start: 'A',
      acceptStates: ['A', 'C'],
    },
    acceptedStrings: ['0', '', '00'],
    rejectedStrings: ['1111', '1', '01', '10110'],
  },
};

for (const [name, testDescription] of Object.entries(machineTests)) {
  test(`${name}/constructor`, (t) => {
    const nfa = new NondeterministicFiniteStateMachine(
      testDescription.description
    );
    t.truthy(nfa);
  });

  test(`${name}/accept`, (t) => {
    const nfa = new NondeterministicFiniteStateMachine(
      testDescription.description
    );
    const { acceptedStrings, rejectedStrings } = testDescription;
    for (const s of acceptedStrings) {
      console.log(s);
      t.assert(nfa.accept(s));
    }
    for (const s of rejectedStrings) {
      t.assert(!nfa.accept(s));
    }
  });
}

// removed from package.json:
// "test:prettier": "prettier \"src/**/*.ts\" --list-different",

// to test: yarn test
// in terminal inside nfasm directory
