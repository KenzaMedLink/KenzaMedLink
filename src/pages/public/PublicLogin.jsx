import { useNavigate } from "react-router-dom";

export default function PublicLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-gray-900">
              KenzaMedLink
            </div>
            <div className="text-xs text-gray-500 -mt-0.5">
              Public login (coming next)
            </div>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
          Choose your login
        </h1>
        <p className="mt-2 text-gray-600">
          This login area will later connect to patient, doctor, lab, pharmacy,
          and partner portals.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          <Card title="Patient Login" desc="Book consultations, pay, labs, prescriptions." onClick={() => alert("Patient login page coming next")} />
          <Card title="Doctor Login" desc="Consult, order investigations, prescribe." onClick={() => alert("Doctor login page coming next")} />
          <Card title="Lab Login" desc="Accept requests and upload results securely." onClick={() => alert("Lab login page coming next")} />
          <Card title="Pharmacy Login" desc="Dispense after payment confirmation." onClick={() => alert("Pharmacy login page coming next")} />
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-gray-100 px-5 py-2 font-semibold text-gray-800 hover:bg-gray-200 transition"
          >
            Back
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 transition"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
    >
      <div className="text-lg font-bold text-gray-900">{title}</div>
      <div className="mt-2 text-sm text-gray-600">{desc}</div>
    </button>
  );
}