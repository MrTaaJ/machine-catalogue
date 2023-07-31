import { useState } from "react";
import { ButtonListSchema } from "../AddCategory";

export default function ButtonList({
  getBtnValue,
  defaultType,
}: ButtonListSchema) {
  const [button, setButton] = useState<string>(defaultType || "text");
  const [activate, setActivate] = useState<boolean>(false);
  const List: string[] = ["text", "number", "date", "check"];

  function buttonChange(e: any, value: string) {
    e.stopPropagation();
    setButton(value);
    setActivate(!activate);
    getBtnValue(e);
  }
  return (
    <div className="relative">
      <button
        onClick={() => setActivate(!activate)}
        className="flex flex-col uppercase text-[#424296]"
      >
        {button}
      </button>
      {activate && (
        <div className="absolute top-7 flex flex-col gap-2 bg-[#424296] z-10">
          {List.map((value, index) => (
            <button
              name={value}
              className="hover:bg-[#424296] hover:text-[white] uppercase text-left p-1 z-10"
              key={index}
              onClick={(e) => buttonChange(e, value)}
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
