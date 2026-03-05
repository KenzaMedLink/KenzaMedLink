import { useNavigate } from "react-router-dom";

export default function PublicRegister() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Register</h1>
        <p className="mt-2 text-gray-600">
          Public registration (patients, doctors, labs, pharmacy) will be connected here.
        </p>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-gray-100 px-5 py-2 font-semibold text-gray-800 hover:bg-gray-200 transition"
          >
            Back
          </button>
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}