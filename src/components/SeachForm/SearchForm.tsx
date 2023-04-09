
import React from "react";
import { InputWithLabel } from "../InputWithLabel/InputWithLabel"

type SearchFormProps = {
  searchTerm: string
  handleSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export const SearchForm: React.FC<SearchFormProps> = ({
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