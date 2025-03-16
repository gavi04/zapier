import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import this if you're using react-router

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use navigate if you're using rea
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSignin = async(e:any) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:3003/api/v1/signin",
        { email, password },
        
      );
      
      console.log("Success:", response.data);
      const user = JSON.stringify(response.data)
      // Store user in localStorage or context/state management
      localStorage.setItem("user", user);
      

      
      // Redirect to dashboard or home page
      navigate("/dashboard"); 
      
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.error("Error:", error.response ? error.response.data : error.message);
      setError(error.response?.data?.error || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="relative min-h-screen grid bg-black">
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0">
        {/* Left Section */}
        <div className="relative sm:w-1/3 xl:w-1/4 h-full md:flex flex-auto items-center justify-center p-8 text-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://mintlify.s3.us-west-1.amazonaws.com/zapier-82f0e938/logo/dark.svg"
              alt="Zapier Logo"
              className="w-60 h-60 object-contain z-10"
            />
          </div>
          <div className="absolute bg-black opacity-25 inset-0"></div>
        </div>
        
        {/* Right Section */}
        <div className="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full xl:w-3/5 p-6 sm:rounded-lg md:rounded-none">
          <div className="max-w-lg w-full space-y-8 ">
            <h2 className="text-center text-white text-2xl font-bold">
              Sign In
            </h2>
            <div className="flex justify-center">
              <div className="bg-black flex flex-col w-72 border border-gray-700 rounded-lg px-6 py-8">
                <form className="flex flex-col space-y-6" onSubmit={handleSignin}>
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  
                  <label className="font-medium text-white text-sm">Email</label>
                  <input
                    type="email"
                    placeholder="jack@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-lg py-2 px-3 bg-black border-indigo-600 placeholder-gray-500 text-white text-sm"
                    required
                  />
                  
                  <label className="font-medium text-white text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="***"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded-lg py-2 px-3 bg-black border-indigo-600 placeholder-gray-500 text-white text-sm"
                    required
                  />
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`border border-indigo-600 bg-black text-white rounded-lg py-2 font-semibold text-sm ${
                      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-900"
                    }`}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                  
                  <div className="text-center text-white text-sm">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-indigo-400 hover:underline">
                      Sign Up
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}