import React from "react" 

export const useStorageState = (key: string, initialValue?: string): [string, (value: string) => void] => {
  const [value, setValue] = React.useState<string>(localStorage.getItem(key) || initialValue || '')

  React.useEffect(()=> {
    localStorage.setItem(key, value)
  },[key, value])
  
  return [value, setValue]
}