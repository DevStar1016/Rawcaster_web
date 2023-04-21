import { fetchgfollowerfollowingList } from "../Action";

const initialState = {
  fans: [],
  fansCount: 0,
  isFansLoading: false,
  influencers: [],
  influencerCount: 0,
  isinfluencerLoading: false,
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchgfollowerfollowingList.pending, (state, action) => {
      state.isFansLoading = true;
      state.isinfluencerLoading = true;
    });
    builder.addCase(fetchgfollowerfollowingList.fulfilled, (state, action) => {
      if (action.payload.type === 1) {
        state.fans = action.payload.allconnections;
        state.fansCount = action.payload.allconnectionscount;
        state.isFansLoading = false;
      } else if (action.payload.type === 2) {
        state.influencers = action.payload.allconnections;
        state.influencerCount = action.payload.allconnectionscount;
        state.isinfluencerLoading = false;
      }
    });
  },
});

export const { handleFansData, handleInfluencersData } = actions;

export default reducer;
