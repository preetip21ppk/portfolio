import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-ink-2">
        That page does not exist. Try the projects index instead.
      </p>
      <Link
        href="/projects"
        className="shine btn-lift mt-7 inline-block rounded-lg bg-accent-fill px-4 py-2.5 text-sm font-medium text-on-fill hover:bg-accent-hover"
      >
        Browse projects
      </Link>
    </section>
  );
}
