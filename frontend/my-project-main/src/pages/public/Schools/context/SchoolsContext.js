import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state for the Schools context
const initialState = {
  // Page data
  pageInfo: {
    title: "المدارس",
    description: "دليل شامل لجميع المدارس في فلسطين مع إمكانية البحث والتقييم"
  },
  
  // Search functionality
  searchResults: {
    schools: [],
    totalCount: 0,
    regions: [],
    currentQuery: '',
    filters: {},
    isSearching: false
  },
  
  // Best schools
  bestSchools: {
    schools: [],
    isLoading: false,
    lastUpdated: null
  },
  
  // Map data
  mapData: {
    regions: [],
    selectedRegion: null,
    isLoading: false
  },
  
  // Statistics
  statistics: {
    stats: [],
    isLoading: false,
    animationsEnabled: true
  },
  
  // Recently added schools
  addedSchools: {
    schools: [],
    hasMore: false,
    totalCount: 0,
    isLoading: false
  },
  
  // Loading and error states
  loading: {
    global: false,
    search: false,
    bestSchools: false,
    mapData: false,
    statistics: false,
    addedSchools: false
  },
  
  errors: {
    global: null,
    search: null,
    bestSchools: null,
    mapData: null,
    statistics: null,
    addedSchools: null
  }
};

// Action types
export const ACTION_TYPES = {
  // Loading actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Data actions
  SET_PAGE_DATA: 'SET_PAGE_DATA',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_FILTERS: 'SET_SEARCH_FILTERS',
  SET_BEST_SCHOOLS: 'SET_BEST_SCHOOLS',
  SET_MAP_DATA: 'SET_MAP_DATA',
  SET_SELECTED_REGION: 'SET_SELECTED_REGION',
  SET_STATISTICS: 'SET_STATISTICS',
  SET_ADDED_SCHOOLS: 'SET_ADDED_SCHOOLS',
  
  // UI actions
  TOGGLE_ANIMATIONS: 'TOGGLE_ANIMATIONS',
  RESET_STATE: 'RESET_STATE'
};

// Reducer function
const schoolsReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.section]: action.payload.isLoading
        }
      };
      
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.section]: action.payload.error
        },
        loading: {
          ...state.loading,
          [action.payload.section]: false
        }
      };
      
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.section]: null
        }
      };
      
    case ACTION_TYPES.SET_PAGE_DATA:
      return {
        ...state,
        pageInfo: action.payload.pageInfo || state.pageInfo,
        searchResults: {
          ...state.searchResults,
          ...action.payload.searchResults
        },
        bestSchools: {
          ...state.bestSchools,
          ...action.payload.bestSchools
        },
        mapData: {
          ...state.mapData,
          ...action.payload.mapData
        },
        statistics: {
          ...state.statistics,
          ...action.payload.statistics
        },
        loading: {
          ...state.loading,
          global: false
        }
      };
      
    case ACTION_TYPES.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: {
          ...state.searchResults,
          schools: action.payload.schools || [],
          totalCount: action.payload.totalCount || 0,
          regions: action.payload.regions || state.searchResults.regions,
          isSearching: false
        },
        loading: {
          ...state.loading,
          search: false
        }
      };
      
    case ACTION_TYPES.SET_SEARCH_QUERY:
      return {
        ...state,
        searchResults: {
          ...state.searchResults,
          currentQuery: action.payload,
          isSearching: true
        }
      };
      
    case ACTION_TYPES.SET_SEARCH_FILTERS:
      return {
        ...state,
        searchResults: {
          ...state.searchResults,
          filters: {
            ...state.searchResults.filters,
            ...action.payload
          }
        }
      };
      
    case ACTION_TYPES.SET_BEST_SCHOOLS:
      return {
        ...state,
        bestSchools: {
          schools: action.payload.schools || [],
          isLoading: false,
          lastUpdated: new Date().toISOString()
        },
        loading: {
          ...state.loading,
          bestSchools: false
        }
      };
      
    case ACTION_TYPES.SET_MAP_DATA:
      return {
        ...state,
        mapData: {
          ...state.mapData,
          regions: action.payload.regions || [],
          isLoading: false
        },
        loading: {
          ...state.loading,
          mapData: false
        }
      };
      
    case ACTION_TYPES.SET_SELECTED_REGION:
      return {
        ...state,
        mapData: {
          ...state.mapData,
          selectedRegion: action.payload
        }
      };
      
    case ACTION_TYPES.SET_STATISTICS:
      return {
        ...state,
        statistics: {
          ...state.statistics,
          stats: action.payload.stats || [],
          isLoading: false
        },
        loading: {
          ...state.loading,
          statistics: false
        }
      };
      
    case ACTION_TYPES.SET_ADDED_SCHOOLS:
      return {
        ...state,
        addedSchools: {
          schools: action.payload.schools || [],
          hasMore: action.payload.hasMore || false,
          totalCount: action.payload.totalCount || 0,
          isLoading: false
        },
        loading: {
          ...state.loading,
          addedSchools: false
        }
      };
      
    case ACTION_TYPES.TOGGLE_ANIMATIONS:
      return {
        ...state,
        statistics: {
          ...state.statistics,
          animationsEnabled: !state.statistics.animationsEnabled
        }
      };
      
    case ACTION_TYPES.RESET_STATE:
      return initialState;
      
    default:
      return state;
  }
};

// Create the context
export const SchoolsContext = createContext();

// Custom hook to use the Schools context
export const useSchools = () => {
  const context = useContext(SchoolsContext);
  if (!context) {
    throw new Error('useSchools must be used within a SchoolsProvider');
  }
  return context;
};

// Schools Provider component
export const SchoolsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(schoolsReducer, initialState);

  // Helper functions for dispatching actions
  const actions = {
    setLoading: (section, isLoading) => {
      dispatch({
        type: ACTION_TYPES.SET_LOADING,
        payload: { section, isLoading }
      });
    },
    
    setError: (section, error) => {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: { section, error }
      });
    },
    
    clearError: (section) => {
      dispatch({
        type: ACTION_TYPES.CLEAR_ERROR,
        payload: { section }
      });
    },
    
    setPageData: (data) => {
      dispatch({
        type: ACTION_TYPES.SET_PAGE_DATA,
        payload: data
      });
    },
    
    setSearchResults: (data) => {
      dispatch({
        type: ACTION_TYPES.SET_SEARCH_RESULTS,
        payload: data
      });
    },
    
    setSearchQuery: (query) => {
      dispatch({
        type: ACTION_TYPES.SET_SEARCH_QUERY,
        payload: query
      });
    },
    
    setSearchFilters: (filters) => {
      dispatch({
        type: ACTION_TYPES.SET_SEARCH_FILTERS,
        payload: filters
      });
    },
    
    setBestSchools: (data) => {
      dispatch({
        type: ACTION_TYPES.SET_BEST_SCHOOLS,
        payload: data
      });
    },
    
    setMapData: (data) => {
      dispatch({
        type: ACTION_TYPES.SET_MAP_DATA,
        payload: data
      });
    },
    
    setSelectedRegion: (region) => {
      dispatch({
        type: ACTION_TYPES.SET_SELECTED_REGION,
        payload: region
      });
    },
    
    setStatistics: (data) => {
      dispatch({
        type: ACTION_TYPES.SET_STATISTICS,
        payload: data
      });
    },
    
    setAddedSchools: (data) => {
      dispatch({
        type: ACTION_TYPES.SET_ADDED_SCHOOLS,
        payload: data
      });
    },
    
    toggleAnimations: () => {
      dispatch({
        type: ACTION_TYPES.TOGGLE_ANIMATIONS
      });
    },
    
    resetState: () => {
      dispatch({
        type: ACTION_TYPES.RESET_STATE
      });
    }
  };

  // Provide context value
  const contextValue = {
    state,
    dispatch,
    actions
  };

  return (
    <SchoolsContext.Provider value={contextValue}>
      {children}
    </SchoolsContext.Provider>
  );
};

// Export the context for direct usage if needed
export default SchoolsContext;