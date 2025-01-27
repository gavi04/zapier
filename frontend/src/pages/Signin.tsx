

export default function Signin ()  {
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
              <h2 className="text-center text-white text-2xl font-bold  ">
                Signin
              </h2>
              <div className="flex justify-center ">
                <div className="bg-black flex flex-col w-72 border border-gray-700 rounded-lg px-6 py-8 ">
                  <form className="flex flex-col space-y-6">
                    
                    <label className="font-medium text-white text-sm">Email</label>
                    <input
                      type="password"
                      placeholder="jack@gmail.com"
                      className="border rounded-lg py-2 px-3 bg-black border-indigo-600 placeholder-gray-500 text-white text-sm"
                    />
                    <label className="font-medium text-white text-sm">
                      Password
                    </label>
                    <input
                      type="text"
                      placeholder="***"
                      className="border rounded-lg py-2 px-3 bg-black border-indigo-600 placeholder-gray-500 text-white text-sm "
                    />
                   
                    <button
                      type="submit"
                      className="border border-indigo-600 bg-black text-white rounded-lg py-2 font-semibold text-sm "
                    >
                      Sign up
                    </button>
                    
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  