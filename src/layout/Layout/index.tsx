import { LayoutSchema } from "../../schema";
import SideBar from "../SideBar";

const Layout = ({ children }: LayoutSchema) => {
  return (
    <main className="w-full h-screen flex">
      <div className="w-1/6 min-w-[200px] border border-gray-500 p-4 bg-gray-100 h-screen ">
        <SideBar />
      </div>
      <div className="w-5/6 px-4 bg-gray-200 h-screen overflow-y-scroll overflow-x-hidden">
        {children}
      </div>
    </main>
  );
};

export default Layout;
