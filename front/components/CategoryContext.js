const { createContext, useState, useEffect } = require("react");

export const CategoryContext = createContext({});
export function CategoryContextProvider({ children }) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [lastViewCategories, setlastViewCategories] = useState([]);
  useEffect(() => {
    if (lastViewCategories?.length > 0) {
      ls?.setItem("lastViewCategories", JSON.stringify(lastViewCategories));
    }
  }, [lastViewCategories]);
  useEffect(() => {
    if (ls && ls.getItem("lastViewCategories")) {
      setlastViewCategories(JSON.parse(ls.getItem("lastViewCategories")));
    }
  }, []);
  function addCategory(ategoryId) {
    setlastViewCategories((prev) => [...prev, productId]);
  }
  return (
    <CategoryContext.Provider
      value={{
        lastViewCategories,
        setlastViewCategories,
        addCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}