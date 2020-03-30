export type ClientState = {
  connected: boolean;
  host: boolean;
  userId: string | undefined;
  name: string | undefined;
  gameId: string | undefined;
  handState: HandState;
}

export type HandState = {
  pickedUpSecondDeal: boolean;
  showEndHandModal: boolean;
}
