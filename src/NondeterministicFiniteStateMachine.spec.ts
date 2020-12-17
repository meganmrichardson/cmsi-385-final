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
  // any string that starts with 0
  startsWith0: {
    description: {
      transitions: {
        S: {
          0: ['A'],
          1: [],
          '': [],
        },
        A: {
          0: ['A'],
          1: ['A'],
          '': [],
        },
      },
      start: 'S',
      acceptStates: ['A'],
    },
    acceptedStrings: ['0', '001', '0111111', '00000'],
    rejectedStrings: ['', '1', '1000000', '1101'],
  },
  // strings divisible by 3
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
    acceptedStrings: ['', '0', '11', '00000', '1100000'],
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
  // string with any amount of 0s (including none)
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
  // starts with 0 and ends with another 0
  startAndEndZero: {
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
          0: ['C', 'D'],
          1: ['C'],
          '': [],
        },
        D: {
          0: [],
          1: [],
          '': ['D'],
        },
      },
      start: 'A',
      acceptStates: ['A', 'D'],
    },
    acceptedStrings: ['00', '010', '0000', '0100'],
    rejectedStrings: ['1111', '1', '0', '10110'],
  },
  // any string with no 0s next to each other
  noConsecutive0: {
    description: {
      transitions: {
        A: {
          0: ['C'],
          1: ['B'],
          '': [],
        },
        B: {
          0: ['C'],
          1: ['B'],
          '': [],
        },
        C: {
          0: ['D'],
          1: ['B'],
          '': [],
        },
        D: {
          0: ['D'],
          1: ['D'],
          '': [],
        },
      },
      start: 'A',
      acceptStates: ['A', 'B', 'C'],
    },
    acceptedStrings: ['', '0', '01', '0111', '010101010'],
    rejectedStrings: ['00', '100', '100101', '0001'],
  },
  // accepts '00' or '01' (nothing else!)
  zeroOneOrZeroZero: {
    description: {
      transitions: {
        A: {
          0: [],
          1: [],
          '': ['B', 'E'],
        },
        B: {
          0: ['C'],
          1: [],
          '': [],
        },
        C: {
          0: [],
          1: ['D'],
          '': [],
        },
        D: {
          0: [],
          1: [],
          '': [],
        },
        E: {
          0: ['F'],
          1: [],
          '': [],
        },
        F: {
          0: ['G'],
          1: [],
          '': [],
        },
        G: {
          0: [],
          1: [],
          '': [],
        },
      },
      start: 'A',
      acceptStates: ['D', 'G'],
    },
    acceptedStrings: ['00', '01'],
    rejectedStrings: ['', '100', '0101', '0001'],
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
