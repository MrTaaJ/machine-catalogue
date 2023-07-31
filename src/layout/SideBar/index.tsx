import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { NavContext } from "../../context/NavLink";

export default function SideBar() {
  const { navLinkData } = useContext(NavContext);
  return (
    <div className="h-full">
      <div className="flex flex-col gap-[20px]">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive
              ? "bg-green-500 font-bold p-2 rounded"
              : "bg-transparent font-thin"
          }
        >
          Dashboard
        </NavLink>
        {navLinkData.map((data, index) => (
          <NavLink
            to={data.link}
            className={({ isActive }) =>
              isActive
                ? "bg-green-500 font-bold p-2 rounded"
                : "bg-transparent font-thin"
            }
            key={index}
          >
            <p>{data.text}</p>
          </NavLink>
        ))}
        <NavLink
          to={"/categories"}
          className={({ isActive }) =>
            isActive
              ? "bg-green-500 font-bold p-2 rounded"
              : "bg-transparent font-thin"
          }
        >
          Manage Categories
        </NavLink>
      </div>
    </div>
  );
}
