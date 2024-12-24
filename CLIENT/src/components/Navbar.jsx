import { useContext,useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useNotifications } from "../context/notificationsContext";

const Navbar = () => {
  const { user, isLoggedIn } = useContext(UserContext);
  const { notifications } = useNotifications();
 
  return (
    <>
      {isLoggedIn && (
        <>
          <header className="bg-green-200 text-green-900 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold">Hello, {user.username}!</h1>
            </div>
          </header>

          <nav className="bg-green-300 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Left Section */}
                <div className="flex space-x-6">
                  <Link
                    to="/users"
                    className="text-green-800 hover:text-green-900 font-medium"
                  >
                    Users{" "}
                    {notifications?.totalPersonal > 0 && (
                      <span className="ml-1 text-red-600">
                        🔔 {notifications.totalPersonal}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/groups"
                    className="text-green-800 hover:text-green-900 font-medium"
                  >
                    Groups{" "}
                    {notifications?.totalGroup > 0 && (
                      <span className="ml-1 text-red-600">
                        🔔 {notifications.totalGroup}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Right Section */}
                <div className="flex space-x-4">
                  <button className="bg-red-300 hover:bg-red-400 text-red-900 py-2 px-4 rounded-md shadow-sm transition">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Navbar;
