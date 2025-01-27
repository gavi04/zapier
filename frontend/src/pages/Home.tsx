// Home.jsx
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

export default function Home() {
 

  return (
    <div className="bg-black min-h-screen overflow-hidden">
      {/* Navbar outside of BackgroundLines */}
      <div className="bg-black text-white py-4 px-6 flex justify-between items-center relative z-10">
        <div className="text-2xl font-bold">Zapier</div>
        <div className="flex space-x-4">
          <NavLink to="signin" className="inline-block" >
          <Button  className="bg-indigo-600 hover:bg-indigo-500">
            Sign In
          </Button>
          </NavLink>
          
          <NavLink to="signup" className="inline-block">
            <Button className="bg-white text-black hover:bg-gray-300">
              Signup
            </Button>
          </NavLink>
        </div>
      </div>

      {/* BackgroundLines only wraps the main content */}
      <BackgroundLines className="custom-class" svgOptions={{ duration: 5 }}>
        <div className="text-white flex flex-col justify-center items-center h-screen">
          <div className="font-mono text-7xl">Zapier</div>
          <div className="pt-3">Automate your workflow</div>
        </div>
      </BackgroundLines>
    </div>
  );
}