import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 400) {
        const responseData = await response.json();
        if (responseData.message === "User already exists") {
          toast.error("User already exists");
          return;
        }
      }
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      const result = await response.json();
      console.log("Registration successful:", result);
      navigate("/login");
    } catch (error) {
      console.log("error" + error);
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
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="input input-bordered"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <span className="text-xs text-red-600 mt-2">
              This field is required
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className={`input input-bordered ${
              errors.username ? "input-error" : ""
            }`}
            {...register("username", {
              required: "Username is required",
              validate: {
                noSpaces: (value) =>
                  !value.includes(" ") || "No spaces allowed in username",
              },
            })}
          />
          {errors.name && (
            <span className="text-xs text-red-600 mt-2">
              This field is required
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="email"
            className="input input-bordered"
            {...register("email", { required: true })}
          />
        </div>
        {errors.email && (
          <span className="text-xs text-red-600 mt-2">
            This field is required
          </span>
        )}
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
          <button className="btn bg-violet-700 text-white">Register</button>
        </div>
        <div className="text-center w-full mt-2">
          <div className="flex gap-2 justify-center items-center">
            <div>
              <p className="label-text-alt link link-hover">
                Already registered?
              </p>
            </div>
            <div className="flex text-violet-700">
              <Link to="/login" className="link link:hover inline text-xs">
                Login
              </Link>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Register;
