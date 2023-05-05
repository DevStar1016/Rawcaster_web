const initialState = {
  fans: [],
  fansCount: 0,
  influencers: [],
  influencerCount: 0,
  connections: [],
  connectionsCount: 0,
  unclaimedInfluencer: [],
  unclaimedInfluencerCount: 0,
};

export const { actions, reducer } = createSlice({
  name: "connections",
  initialState,
  reducers: {
    handleFansData: (state, action) => {
      state.fans = action.payload.fans;
      state.fansCount = action.payload.fansCount;
    },
    handleInfluencersData: (state, action) => {
      state.influencers = action.payload.influencers;
      state.influencerCount = action.payload.influencerCount;
    },
    handleConnectionsData: (state, action) => {
      state.connections = action.payload.influencers;
      state.connections = action.payload.influencerCount;
    },
    handleunClaimedInfluencer: (state, action) => {
      state.unclaimedInfluencer = action.payload.unclaimedInfluencer;
      state.unclaimedInfluencerCount = action.payload.unclaimedInfluencerCount;
    },
  },
});

export const { handleFansData, handleInfluencersData } = actions;

export default reducer;
