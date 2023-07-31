import {
  createContext,
  SetStateAction,
  useState,
  Dispatch,
  useEffect,
} from "react";
import { LayoutSchema } from "../../schema";

export type FieldValue = {
  id: string;
  val: string | boolean | number;
};

export type CategoryValueSchema = {
  id: string;
  values: FieldValue[];
};

export type CategoriesValueSchema = {
  id: string;
  contents: CategoryValueSchema[];
};

type CatValueListSchema = {
  categoryValues: CategoriesValueSchema[];
  setCategoryValues: Dispatch<SetStateAction<Array<CategoriesValueSchema>>>;
};

const catValueDefaultValues = {
  categoryValues: [],
  setCategoryValues: () => null,
};

export const CatValueContext = createContext<CatValueListSchema>(
  catValueDefaultValues
);

const CatValueProvider = ({ children }: LayoutSchema) => {
  const [categoryValues, setCategoryValues] = useState<
    Array<CategoriesValueSchema>
  >([]);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("categoryGeneralValues")) {
      setCategoryValues(
        JSON.parse(localStorage.getItem("categoryGeneralValues") as string)
      );
    }
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    !firstLoad &&
      localStorage.setItem(
        "categoryGeneralValues",
        JSON.stringify(categoryValues)
      );
  }, [categoryValues, firstLoad]);

  return (
    <CatValueContext.Provider
      value={{
        categoryValues,
        setCategoryValues,
      }}
    >
      {children}
    </CatValueContext.Provider>
  );
};

export default CatValueProvider;
