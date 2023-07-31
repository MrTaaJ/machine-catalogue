/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "../../layout/Layout";
import { useEffect, useState, useContext } from "react";
import AddCategory from "../../components/AddCategory";
import { CatContext } from "../../context/Categories";
import { v4 as uuidv4 } from "uuid";

type NewCatDataSchema = {
  categories: React.ReactNode | React.ReactNode[];
  id: string;
};

export default function Categories() {
  const { categories, setCategories } = useContext(CatContext);
  const [addCat, setAddCat] = useState<Array<NewCatDataSchema>>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [firstContent, setFirstContent] = useState<any>([]);
  function Add() {
    const id = uuidv4();
    const newField = {
      id: id,
      categories: <AddCategory id={id} loadCategory={null} />,
    };
    setAddCat((prev) => [...prev, newField]);
  }

  useEffect(() => {
    const onLoad = JSON.parse(
      localStorage.getItem("categoryHandler") as string
    );
    setFirstContent(onLoad);
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (firstLoad === false) {
      if (firstContent?.length >= 1) {
        setCategories(firstContent);
      }
    }
  }, [firstContent]);

  useEffect(() => {
    if (firstLoad === false) {
      if (categories?.length >= 1) {
        const newCumField: any = [];
        categories.forEach((category: any) => {
          newCumField.push({
            id: category.id,
            categories: (
              <AddCategory id={category.id} loadCategory={category} />
            ),
          });
          setAddCat(newCumField);
        });
      } else {
        setAddCat([]);
      }
    }
  }, [categories]);

  return (
    <Layout>
      <div className="w-full h-screen flex flex-col relative">
        <h1 className="text-center w-full my-4">Manage Categories</h1>

        <div className="flex flex-wrap gap-10">
          {addCat.map((newField) => {
            return (
              <div key={newField.id} id={newField.id}>
                {newField.categories}
              </div>
            );
          })}
        </div>
        <button
          className="bg-[#424296] text-[white] mt-2 p-2 rounded"
          onClick={Add}
        >
          ADD NEW CATEGORY
        </button>
      </div>
    </Layout>
  );
}
