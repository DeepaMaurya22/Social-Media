import { useEffect } from "react";
import { useUser } from "../context/AuthContext"; // User context
import { useNavigate } from "react-router-dom"; // Navigation
import PropTypes from "prop-types"; // To validate component props

const PrivateRoute = ({ children }) => {
  const { user, setUser } = useUser(); // Access user context
  const navigate = useNavigate(); // Navigation

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/check-user",
          {
            credentials: "include", // Ensure cookies are sent with request
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.username); // Update context with fetched user
        } else {
          navigate("/login"); // Redirect to login if unauthorized
        }
      } catch (error) {
        navigate("/login"); // Redirect on error
      }
    };

    // Fetch user if not already set
    if (!user) {
      fetchUser();
    }
  }, [user, setUser, navigate]); // Dependencies to trigger re-fetching

  if (!user) {
    // Return a loading screen or a fallback UI while fetching user information
    return <div>Loading...</div>;
  }

  // Render children if user is authenticated
  return <>{children}</>;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validate children prop
};

export default PrivateRoute;
