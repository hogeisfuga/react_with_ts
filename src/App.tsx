import * as React from 'react';
import axios from 'axios'

type Story = {
  objectID: number;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Story[];

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

const StoryActionType = {
  FETCH_INIT: "FETCH_INIT",
  SET_STORIES: "SET_STORIES",
  REMOVE_STORIES: "REMOVE_STORY",
  FETCH_ERROR: "FETCH_ERROR"
} as const

type StoriesState = {
  stories: Stories,
  loading: boolean,
  isError: boolean
}

type Action = StorySetAction
| RemoveStoryAction
| FetchInitStoryAction
| FetchErrorAction

const storiesReducer = (state: StoriesState, action: Action ) => {
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


const useStorageState = (key: string, initialValue?: string): [string, (value: string) => void] => {
  const [value, setValue] = React.useState<string>(localStorage.getItem(key) || initialValue || 'react')

  React.useEffect(()=> {
    localStorage.setItem(key, value)
  },[key, value])
  
  return [value, setValue]
}

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('search')
  const [storiesState, dispatchStories] = React.useReducer(storiesReducer, { stories: [], loading: false, isError: false})
  const [url, setUrl] = React.useState<string>(`${API_ENDPOINT}${searchTerm}`)

  const handleFetchStories = React.useCallback( async()=> {
    dispatchStories({ type: StoryActionType.FETCH_INIT })
    const controller = new AbortController()
    try {
      const res = await axios.get(url, { signal: controller.signal })
      dispatchStories({ type: StoryActionType.SET_STORIES, payload: res.data.hits })
    } catch(e) {
      controller.abort()
      dispatchStories({ type: StoryActionType.FETCH_ERROR })
    }
  },[url])

  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

  const hanleDeleteStory = (id: number) => {
    const story = storiesState.stories.find(item => item.objectID === id)
    if (!story) return
    dispatchStories({ type: StoryActionType.REMOVE_STORIES, payload: story })
  }

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUrl(`${API_ENDPOINT}${searchTerm}`)
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm handleSearch={handleSearch} handleSearchSubmit={handleSearchSubmit} searchTerm={searchTerm}/>

      <hr />
      { storiesState.isError && <p>something went wrong</p>}
      { storiesState.loading ? <div> loading...</div> : <List list={storiesState.stories} handleDelete={hanleDeleteStory}/>}
    </div>
  );
};

type SearchFormProps = {
  searchTerm: string
  handleSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
}
const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  handleSearchSubmit,
  handleSearch
}) => (
  <form onSubmit={handleSearchSubmit}>
    <InputWithLabel
      id='search'
      search={searchTerm}
      onInputChange={handleSearch}
      value={searchTerm}
      isFocused
    >
      Search
    </InputWithLabel>
    <button type='submit' disabled={!searchTerm}>search</button>
  </form>
)

type InputWithLabelProps = {
  id: string,
  value: string
  search: string
  type?: string
  isFocused: boolean
  children?: React.ReactNode
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>

  );
};

type ListProps = {
  list: Stories;
  handleDelete: any
};

const List: React.FC<ListProps> = ({ list, handleDelete }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} handleDelete={handleDelete}/>
    ))}
  </ul>
);

type ItemProps = {
  item: Story;
  handleDelete: any
};

const Item: React.FC<ItemProps> = ({ item, handleDelete }) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <button onClick={() => handleDelete(item.objectID)}>delete</button>
    </li>
  )
}

export default App;
