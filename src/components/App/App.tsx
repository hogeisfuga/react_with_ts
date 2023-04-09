import * as React from 'react';
import axios from 'axios'
import { storiesReducer, StoryActionType } from './AppReducer';
import { useStorageState } from '../common/hooks/useStorageState';
import { SearchForm } from '../SeachForm/SearchForm';
import { List } from '../List/List';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('search', 'react')
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

export default App;
