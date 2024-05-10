import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useUser } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.status === 404) {
        toast.error("Invalid UserName or Password");
      }

      if (response.ok) {
        const data = await response.json();
        // console.log("Login successful");
        // console.log(data.token);
        // console.log(data.user);
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // console.log(data);
        setUser(data.user);
        navigate("/");
      } else {
        // console.log("setUser:null");
        setUser(null);
        navigate("/login");
      }
      if (!response.ok) {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.log("frontend error " + error);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        className="card-body max-w-2xl border rounded-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="input input-bordered"
            {...register("username", { required: true })}
          />
          {errors.username && (
            <span className="text-xs text-red-600 mt-2">
              Username is required
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered"
            {...register("password", {
              required: true,
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {errors.password && (
            <span className="text-xs text-red-600 mt-2">
              {errors.password.message}
            </span>
          )}
          <label className="label">
            <a href="#" className="label-text-alt link link-hover">
              Forgot password?
            </a>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn bg-violet-700 text-white">Login</button>
        </div>
        <div className="text-center w-full mt-2">
          <div className="flex gap-2 justify-center items-center">
            <div>
              <p className="label-text-alt link link-hover">Not registered?</p>
            </div>
            <div className="flex text-violet-700">
              <Link to="/signup" className="link link:hover inline text-xs">
                Register
              </Link>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
