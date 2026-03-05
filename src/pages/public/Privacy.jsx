export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="mt-4 text-gray-600">
          This page explains how KenzaMedLink collects, uses, stores, and protects user data.
          (Replace this text with your final legal policy.)
        </p>

        <div className="mt-8 space-y-4 text-gray-700">
          <section>
            <h2 className="font-bold">Data we collect</h2>
            <p className="text-sm text-gray-600">
              Account info, clinical records (where applicable), usage logs, and billing records.
            </p>
          </section>

          <section>
            <h2 className="font-bold">How we use data</h2>
            <p className="text-sm text-gray-600">
              To deliver healthcare workflows, improve the service, and maintain security/audit trails.
            </p>
          </section>

          <section>
            <h2 className="font-bold">Security</h2>
            <p className="text-sm text-gray-600">
              Access controls, audit logs, and secure authentication are applied to protect data.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}