import React from "react";
import { Stories } from "../App/AppReducer";
import { Item } from "../Item/Item";

type ListProps = {
  list: Stories;
  handleDelete: any
};

export const List: React.FC<ListProps> = ({ list, handleDelete }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} handleDelete={handleDelete}/>
    ))}
  </ul>
);