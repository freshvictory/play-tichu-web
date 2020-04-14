import { Card } from './card';

export type Suit = 'green' | 'blue' | 'red' | 'black';

const Gems: Card[] = [
  {
    id: 'green_gem1',
    name: 'G',
    value: 5,
    rank: 11,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'green_gem2',
    name: 'G',
    value: 5,
    rank: 11,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'green_gem3',
    name: 'G',
    value: 5,
    rank: 11,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'green_gem4',
    name: 'G',
    value: 5,
    rank: 11,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'green_pawn1',
    name: '2',
    value: 0,
    rank: 12,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'green_pawn2',
    name: '2',
    value: 0,
    rank: 12,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'green_pawn3',
    name: '2',
    value: 0,
    rank: 12,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'green_knight1',
    name: '3',
    value: 0,
    rank: 13,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'green_knight2',
    name: '3',
    value: 0,
    rank: 13,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'green_leader1',
    name: '4',
    value: 0,
    rank: 14,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'green_wild1',
    name: 'Wild',
    value: 0,
    rank: 15,
    suit: 'green',
    serializedId: 0
  },
  {
    id: 'blue_gem1',
    name: 'G',
    value: 5,
    rank: 21,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'blue_gem2',
    name: 'G',
    value: 5,
    rank: 21,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'blue_gem3',
    name: 'G',
    value: 5,
    rank: 21,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'blue_gem4',
    name: 'G',
    value: 5,
    rank: 21,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'blue_pawn1',
    name: '2',
    value: 0,
    rank: 22,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'blue_pawn2',
    name: '2',
    value: 0,
    rank: 22,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'blue_pawn3',
    name: '2',
    value: 0,
    rank: 22,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'blue_knight1',
    name: '3',
    value: 0,
    rank: 23,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'blue_knight2',
    name: '3',
    value: 0,
    rank: 23,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'blue_leader1',
    name: '4',
    value: 0,
    rank: 24,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'blue_wild1',
    name: 'Wild',
    value: 0,
    rank: 25,
    suit: 'blue',
    serializedId: 0
  },
  {
    id: 'red_gem1',
    name: 'G',
    value: 5,
    rank: 31,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'red_gem2',
    name: 'G',
    value: 5,
    rank: 31,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'red_gem3',
    name: 'G',
    value: 5,
    rank: 31,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'red_gem4',
    name: 'G',
    value: 5,
    rank: 31,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'red_pawn1',
    name: '2',
    value: 0,
    rank: 32,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'red_pawn2',
    name: '2',
    value: 0,
    rank: 32,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'red_pawn3',
    name: '2',
    value: 0,
    rank: 32,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'red_knight1',
    name: '3',
    value: 0,
    rank: 33,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'red_knight2',
    name: '3',
    value: 0,
    rank: 33,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'red_leader1',
    name: '4',
    value: 0,
    rank: 34,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'red_wild1',
    name: 'Wild',
    value: 0,
    rank: 35,
    suit: 'red',
    serializedId: 0
  },
  {
    id: 'black_gem1',
    name: 'G',
    value: 5,
    rank: 41,
    suit: 'black',
    serializedId: 0
  },
  {
    id: 'black_gem2',
    name: 'G',
    value: 5,
    rank: 41,
    suit: 'black',
    serializedId: 0
  },
  {
    id: 'black_gem3',
    name: 'G',
    value: 5,
    rank: 41,
    suit: 'black',
    serializedId: 0
  },
  {
    id: 'black_gem4',
    name: 'G',
    value: 5,
    rank: 41,
    suit: 'black',
    serializedId: 0
  },
  {
    id: 'black_pawn1',
    name: '2',
    value: 0,
    rank: 42,
    suit: 'black',
    serializedId: 0
  },
  {
    id: 'black_pawn2',
    name: '2',
    value: 0,
    rank: 42,
    suit: 'black',
    serializedId: 0
  },
  {
    id: 'black_pawn3',
    name: '2',
    value: 0,
    rank: 42,
    suit: 'black',
    serializedId: 0
  },
  {
    id: 'black_knight1',
    name: '3',
    value: 0,
    rank: 43,
    suit: 'black',
    serializedId: 0
  },
  {
    id: 'black_knight2',
    name: '3',
    value: 0,
    rank: 43,
    suit: 'black',
    serializedId: 0
  },
  {
    id: 'black_leader1',
    name: '4',
    value: 0,
    rank: 44,
    suit: 'black',
    serializedId: 0
  },
  {
    id: 'black_wild1',
    name: 'Wild',
    value: 0,
    rank: 45,
    suit: 'black',
    serializedId: 0
  },
];

for(let index = 0; index < Gems.length; index ++) {
  Gems[index].serializedId = index;
}

export { Gems };