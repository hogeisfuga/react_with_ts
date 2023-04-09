export type Story = {
  objectID: number;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

export type Stories = Story[];

type FetchInitStoryAction = {
  type: typeof StoryActionType.FETCH_INIT
}

type StorySetAction = {
  type: typeof StoryActionType.SET_STORIES,
  payload: Stories
}

type RemoveStoryAction = {
  type: typeof StoryActionType.REMOVE_STORIES,
  payload: Story
}

type FetchErrorAction = {
  type: typeof StoryActionType.FETCH_ERROR
}

type StoriesState = {
  stories: Stories,
  loading: boolean,
  isError: boolean
}

type Action = StorySetAction
| RemoveStoryAction
| FetchInitStoryAction
| FetchErrorAction

export const StoryActionType = {
  FETCH_INIT: "FETCH_INIT",
  SET_STORIES: "SET_STORIES",
  REMOVE_STORIES: "REMOVE_STORY",
  FETCH_ERROR: "FETCH_ERROR"
} as const

export const storiesReducer = (state: StoriesState, action: Action ) => {
  switch(action.type) {
    case StoryActionType.FETCH_INIT:
      return { ...state, loading: true, isError: false}
    case StoryActionType.SET_STORIES:
      return { ...state, stories: action.payload, loading: false }
    case StoryActionType.REMOVE_STORIES:
      const fileterdStory = state.stories.filter(item => item.objectID !== action.payload.objectID)
      return { ...state, stories: fileterdStory }
    case StoryActionType.FETCH_ERROR:
      return { ...state, isError: true}
    default:
      return state
  }
}