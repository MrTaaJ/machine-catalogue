import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { NavContext } from "../../context/NavLink";

export default function SideBar() {
  const { navLinkData } = useContext(NavContext);
  //   const NavLinkData = [
  //     { link: '/', text: 'Dashboard' },
  //     { link: '/today', text: 'Today' },
  //     { link: '/schedule', text: 'Scheduled' },
  //     { link: '/assigned', text: 'Assigned to VA' },
  //     { link: '/alltasks', text: 'Tasks' },
  //   ]
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
