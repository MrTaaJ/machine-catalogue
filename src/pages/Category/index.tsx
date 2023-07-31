import Layout from "../../layout/Layout";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useContext, useCallback } from "react";
import { CatContext } from "../../context/Categories";
import {
  CatValueContext,
  CategoryValueSchema,
  CategoriesValueSchema,
  FieldValue,
} from "../../context/CategoryContents";
import { CategoriesSchema } from "../../context/Categories";
import { FieldDataSchema } from "../../components/AddCategory";
import { v4 as uuidv4 } from "uuid";

type NewItemDataSchema = {
  values: React.ReactNode | React.ReactNode[];
  id: string;
};

type CategoryItemSchema = {
  id: string;
  fields: FieldDataSchema[];
  addItems: (data: CategoryValueSchema) => void;
  removeItems: (e: any) => void;
  loadItemValues: FieldValue[] | null;
};

type TextInputSchema = {
  textValue: string;
} & FieldDataSchema;

type NumberInputSchema = {
  numberValue: number;
} & FieldDataSchema;

type BooleanInputSchema = {
  checkValue: boolean;
} & FieldDataSchema;

export default function CategoryPage() {
  const [id, setId] = useState("");
  const location = useLocation();
  const [currentCategory, setCurrentCategory] = useState<CategoriesSchema>({
    name: "",
    id: "",
    fields: [],
  });
  const { categories } = useContext(CatContext);
  const { categoryValues, setCategoryValues } = useContext(CatValueContext);
  const [itemContent, setItemContent] = useState<CategoryValueSchema>({
    id: "",
    values: [],
  });
  const [itemContents, setItemContents] = useState<Array<CategoryValueSchema>>(
    []
  );
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const [addItem, setAddItem] = useState<Array<NewItemDataSchema>>([]);

  function addItems(data: CategoryValueSchema) {
    setItemContent(data);
  }

  function addContentItem(data: CategoryValueSchema) {
    console.log("This is coming data", data);
    console.log("This is where is will be saved", itemContents);

    if (currentCategory.id === id) {
      if (itemContents.length < 1) {
        setItemContents((prev) => [...prev, data]);
      } else {
        const isFound = itemContents?.find(
          (itemContent: any) => itemContent.id === data.id
        );

        if (isFound) {
          setItemContents((prev) =>
            prev.map((itemValue) => {
              if (itemValue.id === data.id) {
                return data;
              } else {
                return itemValue;
              }
            })
          );
        } else {
          setItemContents((prev) => [...prev, data]);
        }
      }
    }
  }

  function removeItems(e: any) {
    if (e.target.name === "deleteItem") {
      const idItem = e.target.id;

      setCategoryValues((prev) =>
        prev.map((contentsData) => {
          if (contentsData.id === id) {
            const updateContent = contentsData.contents.filter(
              (content) => content.id !== idItem
            );

            const updateContentItem = {
              id: contentsData.id,
              contents: updateContent,
            };
            return updateContentItem;
          } else {
            return contentsData;
          }
        })
      );

      setAddItem((prev) => prev.filter((item) => item.id !== idItem));
    }
  }

  function add() {
    const id = uuidv4();
    const newField = {
      id: id,
      values: (
        <CategoryItem
          id={id}
          fields={currentCategory?.fields}
          addItems={addItems}
          removeItems={removeItems}
          loadItemValues={null}
        />
      ),
    };
    setAddItem((prev) => [...prev, newField]);
  }

  const loadId = useCallback(() => {
    setId(location.pathname.split("/")[1]);
  }, [location]);

  useEffect(() => {
    loadId();
  }, [location, loadId]);

  useEffect(() => {
    if (id && id !== "dashboard") {
      const onLoad = JSON.parse(
        localStorage.getItem("categoryHandler") as string
      );
      const current = onLoad?.filter(
        (load: CategoriesSchema) => load.id === id
      );
      setCurrentCategory(current[0]);

      // const onLoadItem = JSON.parse(
      //   localStorage.getItem("categoryGeneralValues") as string
      // );
      // const currentItem = onLoadItem?.filter(
      //   (load: CategoriesValueSchema) => load.id === id
      // );
      // if (currentItem) {
      //   setItemContents(currentItem[0].contents);
      // }
      // console.log("this is from general", currentItem);
    }
  }, [id]);

  useEffect(() => {
    if (!firstLoad) {
      const savedValues = categoryValues?.filter((catVal) => catVal.id === id);

      if (savedValues.length >= 1) {
        const loadedContents = savedValues[0].contents;
        const loadedAddItem: NewItemDataSchema[] = [];
        loadedContents?.forEach((content) => {
          const newField = {
            id: content.id,
            values: (
              <CategoryItem
                id={content.id}
                fields={currentCategory?.fields}
                addItems={addItems}
                removeItems={removeItems}
                loadItemValues={content.values}
              />
            ),
          };
          loadedAddItem.push(newField);
        });
        setAddItem(loadedAddItem);
        console.log("This is supposed saved values", savedValues);
      } else {
        setAddItem([]);

        const newLoad: CategoriesValueSchema = { id: id, contents: [] };
        setCategoryValues((prev) => [...prev, newLoad]);
      }
    }
  }, [currentCategory]);

  useEffect(() => {
    if (!firstLoad) {
      addContentItem(itemContent);
    }
  }, [itemContent]);

  useEffect(() => {
    if (!firstLoad) {
      const categoryContents: CategoriesValueSchema = {
        id: id,
        contents: itemContents,
      };
      setCategoryValues((prev) =>
        prev.map((contentsData) => {
          if (contentsData.id === id) {
            return categoryContents;
          } else {
            return contentsData;
          }
        })
      );
    }
  }, [itemContents]);

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  return (
    <Layout>
      <div className="w-full ">
        <div className="flex justify-between w-full p-2 mt-3">
          <h1 className="font-bold text-center text-3xl">
            {currentCategory?.name}
          </h1>

          <button
            className="bg-[#424296] text-[white] p-2 rounded"
            onClick={add}
          >
            ADD NEW ITEM
          </button>
        </div>

        <div className="flex flex-wrap gap-10">
          {addItem.map((itemField) => {
            return (
              <div key={itemField.id} id={itemField.id}>
                {itemField.values}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

function CategoryItem({
  id,
  fields,
  addItems,
  removeItems,
  loadItemValues,
}: CategoryItemSchema) {
  const [titles, setTitles] = useState<any>([]);
  const [title, setTitle] = useState<any>({});
  const [valueMap, setValueMap] = useState<any>([]);

  function addValues(e: any) {
    if (e.target.type === "checkbox") {
      setTitle({ id: e.target.id, val: e.target.checked });
    } else {
      setTitle({ id: e.target.id, val: e.target.value });
    }
  }

  function addItemCategory(e: any) {
    const newItemCat: CategoryValueSchema = {
      id: id,
      values: titles,
    };
    addItems(newItemCat);
  }

  const addTitles = useCallback(
    (data: any) => {
      const isFound = titles?.find((title: any) => title.id === data.id);

      if (isFound) {
        setTitles((prev: any) =>
          prev.map((prevTitle: any) => {
            if (prevTitle.id === data.id) {
              return data;
            } else {
              return prevTitle;
            }
          })
        );
      } else {
        setTitles((prev: any) => [...prev, data]);
      }
    },
    [titles]
  );

  useEffect(() => {
    console.log("This is titles", titles);
  }, [titles]);

  useEffect(() => {
    addTitles(title);
  }, [title]);

  useEffect(() => {
    const values: any = [];
    if (loadItemValues) {
      fields.forEach((field, index) => {
        const pusher: any = {
          number: {
            id: loadItemValues[index].id,
            val: loadItemValues[index].val,
          },
          text: {
            id: loadItemValues[index].id,
            val: loadItemValues[index].val,
          },
          check: {
            id: loadItemValues[index].id,
            val: loadItemValues[index].val,
          },
          date: {
            id: loadItemValues[index].id,
            val: loadItemValues[index].val,
          },
        };
        if (field.id === loadItemValues[index].id) {
          values.push(pusher[field.type]);
        }
      });
    } else {
      fields.forEach((field) => {
        const pusher: any = {
          number: { id: field.id, val: 0 },
          text: { id: field.id, val: "" },
          check: { id: field.id, val: false },
          date: { id: field.id, val: "" },
        };
        values.push(pusher[field.type]);
      });
    }

    setTitles(values);
  }, []);

  useEffect(() => {
    if (loadItemValues) {
      const valueMap = fields.map((field, index: any) => {
        const callInput: any = {
          text: (
            <TextInput
              field={field}
              addValues={addValues}
              key={field.id}
              value={loadItemValues[index].val}
            />
          ),
          number: (
            <NumberInput
              field={field}
              addValues={addValues}
              key={field.id}
              value={loadItemValues[index].val}
            />
          ),
          check: (
            <BooleanInput
              field={field}
              addValues={addValues}
              key={field.id}
              value={loadItemValues[index].val}
            />
          ),
          date: (
            <DateInput
              field={field}
              addValues={addValues}
              key={field.id}
              value={loadItemValues[index].val}
            />
          ),
        };
        return callInput[field.type];
      });

      setValueMap(valueMap);
    } else {
      const valueMap = fields.map((field: any) => {
        const callInput: any = {
          text: (
            <TextInput field={field} addValues={addValues} key={field.id} />
          ),
          number: (
            <NumberInput field={field} addValues={addValues} key={field.id} />
          ),
          check: (
            <BooleanInput field={field} addValues={addValues} key={field.id} />
          ),
          date: (
            <DateInput field={field} addValues={addValues} key={field.id} />
          ),
        };
        return callInput[field.type];
      });

      setValueMap(valueMap);
    }
  }, [fields]);
  return (
    <div className="h-fit w-[300px] p-4 flex flex-col gap-3 border border-[#424296] rounded">
      <h2 className="font-bold text-xl">Title</h2>

      <div className="w-full flex flex-col gap-3 items-start justify-start">
        {valueMap}
      </div>

      <div className="flex justify-between">
        <button
          onClick={(e) => addItemCategory(e)}
          className="uppercase text-[#424296] hover:bg-[#424296] hover:text-[white] p-2 rounded"
          name="addItemCategory"
          id={id}
        >
          Add Item
        </button>
        <button
          onClick={(e) => removeItems(e)}
          className="uppercase text-[#f01919] hover:bg-[#f01919] hover:text-[white] p-2 rounded"
          name="deleteItem"
          id={id}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function TextInput({ field, addValues, value }: any) {
  const [textValue, setTextValue] = useState<string>(value || "");
  function onChangeInput(e: any) {
    addValues(e);
    setTextValue(e.target.value);
  }

  // useEffect(() => {
  //   console.log(textValue);
  // }, [textValue]);
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={field.id}>{field.field}:</label>
      <input
        type="text"
        className="border border-[#424296] rounded p-1 w-full"
        placeholder={field.field}
        onChange={(e) => onChangeInput(e)}
        value={textValue}
        id={field.id}
      />
    </div>
  );
}

function NumberInput({ field, addValues, value }: any) {
  const [numberValue, setNumberValue] = useState<number>(value || 0);
  function onChangeInput(e: any) {
    addValues(e);
    setNumberValue(e.target.value);
  }

  // useEffect(() => {
  //   console.log(numberValue);
  // }, [numberValue]);
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={field.id}>{field.field}:</label>
      <input
        type="number"
        className="border border-[#424296] rounded p-1 w-full"
        placeholder={field.field}
        onChange={(e) => onChangeInput(e)}
        value={numberValue}
        id={field.id}
      />
    </div>
  );
}

function BooleanInput({ field, addValues, value }: any) {
  const [checkValue, setCheckValue] = useState<boolean>(value || false);
  function onChangeInput(e: any) {
    addValues(e);
    setCheckValue(e.target.checked);
  }

  // useEffect(() => {
  //   console.log(checkValue);
  // }, [checkValue]);
  return (
    <div className="flex gap-2 items-center">
      <label htmlFor={field.id}>{field.field}:</label>
      <input
        type="checkbox"
        className="border border-[#424296] rounded p-1 h-[20px] w-[20px]"
        placeholder={field.field}
        onChange={(e) => onChangeInput(e)}
        checked={checkValue}
        id={field.id}
      />
    </div>
  );
}

function DateInput({ field, addValues, value }: any) {
  const [dateValue, setDateValue] = useState<string>(value || "");
  function onChangeInput(e: any) {
    addValues(e);
    setDateValue(e.target.value);
  }

  // useEffect(() => {
  //   console.log(dateValue);
  // }, [dateValue]);
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={field.id}>{field.field}:</label>
      <input
        type="date"
        className="border border-[#424296] rounded p-1 w-full"
        placeholder={field.field}
        onChange={(e) => onChangeInput(e)}
        value={dateValue}
        id={field.id}
      />
    </div>
  );
}
