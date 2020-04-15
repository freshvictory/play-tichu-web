export type Card = {
  id: string;
  name: string;
  rank: number;
  value: number;
  suit: string;
  serializedId: number;
  style?: string | undefined;
}
