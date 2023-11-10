

import { useContext } from "react";
import { CategoryContext } from "./CategoryContext";

const GetCategory = async () => {
    const { lastViewCategory } = await useContext(CategoryContext)
    return lastViewCategory
}

export default GetCategory