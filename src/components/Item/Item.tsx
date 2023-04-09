import React from "react";
import { Story } from "../App/AppReducer";

type ItemProps = {
  item: Story;
  handleDelete: any
};

export const Item: React.FC<ItemProps> = ({ item, handleDelete }) => {
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