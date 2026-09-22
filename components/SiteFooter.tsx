import Link from "next/link";
import { profile } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">{profile.name}</p>
          <p className="mt-1 text-sm text-ink-2">
            {profile.title} · {profile.location}
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="text-ink-2 link-sweep hover:text-accent-text"
          >
            Email
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-2 link-sweep hover:text-accent-text"
          >
            LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-2 link-sweep hover:text-accent-text"
          >
            GitHub
          </a>
          <Link
            href="/#about"
            className="text-ink-2 link-sweep hover:text-accent-text"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
