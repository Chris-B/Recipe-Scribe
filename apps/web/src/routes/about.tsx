import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">About</h1>
      <p className="mt-2 text-slate-600">This is a demo route.</p>
      <Link to="/" className="mt-4 inline-block underline">
        Back home
      </Link>
    </div>
  );
}
