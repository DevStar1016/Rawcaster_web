import { createSlice } from "@reduxjs/toolkit";
import { fetchNuggetsbyId } from "../Action";
import { addNuggetView } from "../../../Shared/SharedAPIs";

const initialState = {
  token: null,
  nuggetVideoPaused: false,
  nuggetFormData: {},
  Nuggets: [],
  isNuggetsLoading: true,
  isNuggetMuted: false,
  DashboardfilterType: 0,
  currentpage: 0,
  totalpages: 0,
  totalNuggets: 0,
  isNextPageLoading: false,
};

export const { actions, reducer } = createSlice({
  name: "nuggets",
  initialState,
  reducers: {
    handlenuggetToken: (state, action) => {
      state.token = action.payload;
    },
    handlenuggetVideoPaused: (state, action) => {
      state.nuggetVideoPaused = action.payload;
    },
    handleisNuggetMuted: (state, action) => {
      state.isNuggetMuted = action.payload;
    },
    handleDashboardFilterType: (state, action) => {
      state.DashboardfilterType = action.payload;
    },
    handleNuggetList: (state, action) => {
      state.Nuggets = action.payload;
    },
    handleDeleteNuggetList: (state, action) => {
      let filterData = [...state.Nuggets].filter(
        (ele) => ele.nugget_id !== action.payload
      );
      state.Nuggets = filterData;
    },
    handleDeleteNuggetListByUserId: (state, action) => {
      let filterData = [...state.Nuggets].filter(
        (ele) => ele.user_id !== action.payload
      );
      state.Nuggets = filterData;
    },
    handleNuggetViewUpdate: (state, action) => {
      const index = action.payload;

      if (state.Nuggets[index].viewed === 0 && state.token) {
        // let apiData = {
        //   token: state.token,
        //   nugget_id: JSON.stringify([state.Nuggets[index].nugget_id]),
        // };
        // addNuggetView(apiData);
        state.Nuggets = [
          ...state.Nuggets.slice(0, index),
          {
            ...state.Nuggets[index],
            total_views: state.Nuggets[index].total_views + 1,
            viewed: 1,
          },
          ...state.Nuggets.slice(index + 1, state.length),
        ];
      }
    },
    handleNuggetViewAPIUpdate: (state, action) => {
      let findData = [...state.Nuggets].map((ele, index) => {
        if (action.payload.includes(index) && ele.viewed === 0) {
          return ele.nugget_id;
        } else {
          return null;
        }
      });

      findData = findData.filter((ele) => ele !== null);
      if (findData.length !== 0 && state.token) {
        let apiData = {
          token: state.token,
          nugget_id: JSON.stringify(findData),
        };
        addNuggetView(apiData);
      }
    },
    handleNuggetReadoutUrlUpdate: (state, action) => {
      const nugget_id = action.payload.nugget_id;
      let findIndex = [...state.Nuggets].findIndex(
        (ele, index) => parseInt(ele.nugget_id) === parseInt(nugget_id)
      );
      if (findIndex !== -1) {
        let TempData = [...state.Nuggets];
        TempData[findIndex] = {
          ...TempData[findIndex],
          readout_url: action.payload.readout_url,
        };
        state.Nuggets = TempData;
      }
    },
    handleNuggetTranslateUpdate: (state, action) => {
      const nugget_id = action.payload.nugget_id;
      let findIndex = [...state.Nuggets].findIndex(
        (ele, index) => parseInt(ele.nugget_id) === parseInt(nugget_id)
      );
      if (findIndex !== -1) {
        let TempData = [...state.Nuggets];
        TempData[findIndex] = {
          ...TempData[findIndex],
          translate_text: action.payload.translate_text,
        };
        state.Nuggets = TempData;
      }
    },
    handleNuggetFormData: (state, action) => {
      state.nuggetFormData = action.payload;
    },
    handleRemoveReadoutURL: (state, action) => {
      state.Nuggets = [...state.Nuggets].map((ele) => {
        return {
          ...ele,
          readout_url: null,
        };
      });
    },
    handleRemoveTranslate: (state, action) => {
      state.Nuggets = [...state.Nuggets].map((ele) => {
        return {
          ...ele,
          translate_text: null,
        };
      });
    },
    handleResetNuggets: (state, action) => {
      state.Nuggets = [];
      state.totalpages = 0;
      state.currentpage = 0;
      state.totalNuggets = 0;
      state.isNuggetsLoading = false;
      state.isNextPageLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNuggetsbyId.pending, (state, action) => {
      if (state.currentpage !== 0) {
        state.isNextPageLoading = true;
      } else {
        state.isNuggetsLoading = true;
      }
    });
    builder.addCase(fetchNuggetsbyId.fulfilled, (state, action) => {
      if (action.payload.current_page_no === 1) {
        state.Nuggets = action.payload.data;
      } else if (action.payload.current_page_no === 0) {
        state.Nuggets = [];
      } else {
        let filterData = [...state.Nuggets, ...action.payload.data].reduce(
          (acc, current) => {
            const x = acc.find((item) => item.nugget_id === current.nugget_id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          },
          []
        );
        state.Nuggets = filterData;
      }
      state.totalpages = action.payload.total_pages;
      state.currentpage = action.payload.current_page_no;
      state.totalNuggets = action.payload.total_count;
      state.isNuggetsLoading = false;
      state.isNextPageLoading = false;
    });
  },
});

export const {
  handlenuggetVideoPaused,
  handleisNuggetMuted,
  handleDashboardFilterType,
  handleNuggetList,
  handleNuggetFormData,
  handleResetNuggets,
  handleNuggetViewUpdate,
  handleDeleteNuggetList,
  handlenuggetToken,
  handleDeleteNuggetListByUserId,
  handleNuggetViewAPIUpdate,
  handleNuggetReadoutUrlUpdate,
  handleRemoveReadoutURL,
  handleNuggetTranslateUpdate,
  handleRemoveTranslate,
} = actions;

export default reducer;
