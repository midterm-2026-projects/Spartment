import { useState } from "react";

export default function CredentialDisplay({ credentials }) {
  const [copiedField, setCopiedField] = useState("");

  if (!credentials) {
    return null;
  }

  const username = credentials.username || credentials.user?.username || "";

  const email = credentials.email || credentials.user?.email || "";

  const password =
    credentials.password ||
    credentials.temporaryPassword ||
    credentials.temporary_password ||
    "";

  const copyValue = async (field, value) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      setCopiedField(field);

      window.setTimeout(() => {
        setCopiedField("");
      }, 1500);
    } catch {
      setCopiedField("");
    }
  };

  return (
    <section className="rounded-xl border border-green-200 bg-green-50 p-5">
      <h2 className="text-xl font-bold text-green-800">
        Tenant Account Created
      </h2>

      <p className="mt-1 text-sm text-green-700">
        Save these credentials before closing this section.
      </p>

      <div className="mt-4 space-y-3">
        {username ? (
          <CredentialRow
            label="Username"
            value={username}
            copied={copiedField === "username"}
            onCopy={() => copyValue("username", username)}
          />
        ) : null}

        {email ? (
          <CredentialRow
            label="Email"
            value={email}
            copied={copiedField === "email"}
            onCopy={() => copyValue("email", email)}
          />
        ) : null}

        {password ? (
          <CredentialRow
            label="Temporary Password"
            value={password}
            copied={copiedField === "password"}
            onCopy={() => copyValue("password", password)}
          />
        ) : null}
      </div>
    </section>
  );
}

function CredentialRow({ label, value, copied, onCopy }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-white p-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase text-gray-500">{label}</p>

        <p className="break-all font-semibold text-gray-900">{value}</p>
      </div>

      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 rounded border px-3 py-1 text-sm hover:bg-gray-100"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
