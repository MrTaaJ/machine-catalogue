import { useState, useEffect, useCallback, useContext } from "react";
import { NavContext } from "../../context/NavLink";
import { CatContext } from "../../context/Categories";
import ButtonList from "../ButtonList";
import { v4 as uuidv4 } from "uuid";
import deleteIcon from "../../assets/deleteIcon.png";

export type ButtonListSchema = {
  getBtnValue: (e: any) => void;
  defaultType: "text" | "number" | "check" | "date";
};

type AddFieldDataSchema = {
  onDeleteField: (e: any) => void;
  getFieldData: (data: FieldDataSchema) => void;
  id: string;
  name?: string;
  defaultType: "text" | "number" | "check" | "date";
};

type AddNewFieldSchema = {
  addNewField: (e: any) => void;
};

type FieldSchema = {
  field: string;
  id: string;
};

type NewFieldDataSchema = {
  field: React.ReactNode | React.ReactNode[];
  id: string;
};

export type FieldDataSchema = {
  type: string;
} & FieldSchema;

export default function Categories({
  id,
  loadCategory,
}: {
  id: string;
  loadCategory: any;
}) {
  const [title, setTitle] = useState<string>(
    loadCategory?.name || "New Category"
  );
  const [fields, setFields] = useState<Array<FieldDataSchema>>(
    loadCategory?.fields || []
  );
  const [field, setField] = useState<FieldDataSchema>({
    id: "",
    field: "",
    type: "",
  });

  const [fieldData, setFieldData] = useState<Array<NewFieldDataSchema>>([]);
  const { navLinkData, setNavLinkData } = useContext(NavContext);
  const { categories, setCategories } = useContext(CatContext);

  function addNewField(e: any) {
    const id = uuidv4();

    const newField = {
      id: id,
      field: (
        <AddField
          defaultType={e.target.name}
          onDeleteField={onDeleteField}
          getFieldData={getFieldData}
          id={id}
        />
      ),
    };
    setFieldData((prev) => [...prev, newField]);
  }

  function onDeleteField(e: any) {
    if (e.target.parentNode.name === "deleteField") {
      const id = e.target.parentNode.parentNode.parentNode.id;

      setFieldData((prev) => prev.filter((data) => data.id !== id));

      setFields((prev) => prev.filter((data) => data.id !== id));
    }
  }

  function getFieldData(data: any) {
    setField(data);
  }

  const addTodo = useCallback(
    (data: any) => {
      const isFound = fields?.find((field) => field.id === data.id);

      if (isFound) {
        setFields((prev) =>
          prev.map((field) => {
            if (field.id === data.id) {
              return data;
            } else {
              return field;
            }
          })
        );
      } else {
        setFields((prev) => [...prev, data]);
      }
    },
    [fields]
  );

  const addNewCategory = () => {
    const newLink = {
      link: `/${id}`,
      text: title,
    };
    const newCat = {
      id: id,
      name: title,
      fields: fields,
    };
    if (categories.length < 1) {
      setCategories([newCat]);
    } else {
      const isCat = categories?.find((cat) => cat.id === id);

      if (isCat) {
        setCategories((prev) =>
          prev.map((catData) => {
            if (catData.id === id) {
              return newCat;
            } else {
              return catData;
            }
          })
        );
      } else {
        setCategories((prev) => [...prev, newCat]);
      }
    }

    const isLink = navLinkData?.find((link) => link.link === newLink.link);

    if (!isLink) {
      setNavLinkData((prev) => [...prev, newLink]);
    } else {
      setNavLinkData((prev) =>
        prev.map((linkData) => {
          if (linkData.link === newLink.link) {
            return newLink;
          } else {
            return linkData;
          }
        })
      );
    }
  };

  function removeCategory(e: any) {
    if (e.target.name === "deleteCategory") {
      const id = e.target.parentNode.parentNode.parentNode.id;

      setCategories((prev) => prev.filter((data) => data.id !== id));

      setNavLinkData((prev) => prev.filter((data) => data.link !== `/${id}`));
    }
  }

  const categoryFirstLoad = useCallback(() => {
    const id = uuidv4();

    if (loadCategory) {
      const newFields: any = [];
      loadCategory.fields.forEach((newField: any) => {
        newFields.push({
          id: newField.id,
          field: (
            <AddField
              defaultType={newField.type}
              onDeleteField={onDeleteField}
              getFieldData={getFieldData}
              id={newField.id}
              name={newField.field}
            />
          ),
        });
      });

      setFieldData(newFields);
      setFields(loadCategory?.fields);
    } else {
      const newField = {
        id: id,
        field: (
          <AddField
            defaultType="text"
            onDeleteField={onDeleteField}
            getFieldData={getFieldData}
            id={id}
          />
        ),
      };
      setFieldData([newField]);

      setFields([{ id: id, type: "text", field: "" }]);
    }
  }, [loadCategory]);

  useEffect(() => {
    addTodo(field);
  }, [addTodo, field]);

  useEffect(() => {
    categoryFirstLoad();
  }, [categoryFirstLoad]);

  return (
    <div className="h-fit w-[350px] p-4 flex flex-col gap-3 border border-[#424296] rounded">
      <h2 className="font-bold text-xl">{title}</h2>

      <div className="w-full">
        <input
          type="text"
          className="border border-[#424296] rounded p-1 w-full"
          placeholder="New Category"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>

      <div className="flex flex-col gap-5">
        {fieldData.map((newField) => {
          return (
            <div key={newField.id} id={newField.id}>
              {newField.field}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-2 mb-1 w-full">
        <AddNewField addNewField={addNewField} />

        <button
          onClick={(e) => removeCategory(e)}
          className="uppercase text-[#f01919] hover:bg-[#f01919] hover:text-[white] p-2 rounded"
          name="deleteCategory"
        >
          Remove
        </button>
      </div>

      <button
        onClick={addNewCategory}
        className="w-full uppercase text-[#424296] hover:bg-[#424296] hover:text-[white] rounded p-2"
      >
        Save Category
      </button>
    </div>
  );
}

function AddField({
  defaultType,
  id,
  onDeleteField,
  getFieldData,
  name,
}: AddFieldDataSchema) {
  const [btnValue, setBtnValue] = useState<string>(defaultType);
  const [fdValue, setFdValue] = useState<string>(name || "");

  function getButtonValue(e: any) {
    setBtnValue(e.target.name);
  }
  function getFdValue(e: any) {
    setFdValue(e.target.value);
  }

  useEffect(() => {
    const newData = {
      id: id,
      type: btnValue,
      field: fdValue,
    };

    getFieldData(newData);
  }, [fdValue, btnValue, id, getFieldData]);

  return (
    <div className="w-full flex gap-3 items-center">
      <input
        name="fieldText"
        type="text"
        className="border border-[#424296] rounded p-1"
        placeholder="Field"
        onChange={(e) => getFdValue(e)}
        value={fdValue}
      />
      <ButtonList getBtnValue={getButtonValue} defaultType={defaultType} />
      <button
        name="deleteField"
        onClick={(e) => onDeleteField(e)}
        className="w-fit"
      >
        <img src={deleteIcon} alt="Icon" className="h-4 w-4" />
      </button>
    </div>
  );
}

export function AddNewField({ addNewField }: AddNewFieldSchema) {
  const [activate, setActivate] = useState<boolean>(false);
  const List: string[] = ["text", "number", "date", "check"];

  function buttonChange(e: any) {
    setActivate(!activate);
    addNewField(e);
  }
  return (
    <div className="relative ">
      <button
        onClick={() => setActivate(!activate)}
        className="flex flex-col uppercase text-[#424296] hover:bg-[#424296] hover:text-[white] p-2 rounded"
      >
        Add New Field
      </button>
      {activate && (
        <div className="absolute top-10 flex flex-col gap-2 bg-[white] z-10">
          {List.map((value, index) => (
            <button
              name={value}
              className="hover:bg-[#424296] hover:text-[white] uppercase text-left p-1"
              key={index}
              onClick={(e) => buttonChange(e)}
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
