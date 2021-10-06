export type Card = {
  id: string;
  name: string;
  fullName?: string;
  rank: number;
  value: number;
  suit: string;
  serializedId: number;
  style?: string | undefined;
}
