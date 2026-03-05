export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900">Terms of Use</h1>
        <p className="mt-4 text-gray-600">
          These terms govern access to KenzaMedLink and its services.
          (Replace this text with your final legal terms.)
        </p>

        <div className="mt-8 space-y-4 text-gray-700">
          <section>
            <h2 className="font-bold">Acceptable use</h2>
            <p className="text-sm text-gray-600">
              Do not misuse the platform, attempt unauthorized access, or upload harmful content.
            </p>
          </section>

          <section>
            <h2 className="font-bold">Accounts</h2>
            <p className="text-sm text-gray-600">
              Users are responsible for their credentials and activities within their accounts.
            </p>
          </section>

          <section>
            <h2 className="font-bold">Disclaimer</h2>
            <p className="text-sm text-gray-600">
              KenzaMedLink supports healthcare workflows; clinical decisions remain the responsibility of providers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}