import profileJson from "@/data/profile.json";
import experienceJson from "@/data/experience.json";
import projectsJson from "@/data/projects.json";
import dashboardsJson from "@/data/dashboards.json";
import skillsJson from "@/data/skills.json";
import leadershipJson from "@/data/leadership.json";

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  short: string;
  date: string;
  sort: string;
  featured: boolean;
  hasDashboard: boolean;
  summary: string;
  categories: string[];
  stack: string[];
  metrics: Metric[];
  bullets: string[];
  github: string | null;
  demo: string | null;
};

export type Role = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  start: string;
  end: string;
  stack: string[];
  bullets: string[];
};

export type Dashboard = {
  id: string;
  name: string;
  tool: string;
  source: string;
  projectId: string | null;
  domain: string;
  sort: string;
  highlight: string;
  description: string;
  views: string[];
  /** Business questions the report answers — the BI view, not the build story. */
  answers: string[];
  /** Who actually reads it. */
  audience: string;
  /** The data layer underneath, in one line. */
  builtOn: string;
  image: string | null;
  /** Further report pages, shown as a strip under the lead screenshot. */
  extraImages?: string[];
  /** iframe src for an embeddable dashboard (Power BI "Publish to web", Tableau Public). */
  embedUrl: string | null;
  /** Plain link, opened in a new tab, for dashboards that cannot be embedded. */
  liveUrl: string | null;
};

export type SkillGroup = { group: string; items: string[] };

export type Leadership = {
  id: string;
  role: string;
  org: string;
  institution: string;
  /** Org logo at public/org/*.png; falls back to the monogram when absent. */
  logo: string;
  short: string;
  period: string;
  sort: string;
  hue: string;
};

export type Education = {
  school: string;
  /** Affiliated college, where the degree-granting university differs. */
  college: string;
  degree: string;
  location: string;
  period: string;
  detail: string;
  /** Campus photo at public/edu/*.jpg; falls back to the monogram when absent. */
  image: string | null;
  short: string;
  hue: string;
};

export type Profile = {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  stats: { value: string; label: string }[];
  about: string[];
  education: Education[];
};

const byDateDesc = <T extends { sort: string }>(a: T, b: T) =>
  b.sort.localeCompare(a.sort);

export const profile = profileJson as Profile;
export const skills = skillsJson as SkillGroup[];
export const leadership = (leadershipJson as Leadership[])
  .slice()
  .sort((a, b) => b.sort.localeCompare(a.sort));
export const experience = (experienceJson as Role[]).slice();
export const projects = (projectsJson as Project[]).slice().sort(byDateDesc);
export const dashboards = (dashboardsJson as Dashboard[]).slice().sort(byDateDesc);

export const featuredProjects = projects.filter((p) => p.featured);

/** Category chips for the projects grid, ordered by how many projects carry them. */
export const projectCategories: string[] = Object.entries(
  projects.reduce<Record<string, number>>((acc, p) => {
    for (const c of p.categories) acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {})
)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([name]) => name);

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

/**
 * How an external artefact link should describe itself. A PDF export is not a
 * "live report", and a button that says so over-promises before the click.
 */
export function artifactLabel(url: string, tool?: string): string {
  if (url.endsWith(".pdf")) return "View the full report (PDF)";
  return tool ? `Open the live ${tool} report` : "Open live";
}

/** Only a genuinely interactive URL earns the "Live" badge. */
export function isLiveArtifact(url: string | null | undefined): boolean {
  return !!url && !url.endsWith(".pdf");
}

export function getDashboardsForProject(projectId: string): Dashboard[] {
  return dashboards.filter((d) => d.projectId === projectId);
}

/** Adjacent projects for prev/next navigation on a detail page. */
export function getProjectNeighbours(id: string) {
  const i = projects.findIndex((p) => p.id === id);
  return {
    prev: i > 0 ? projects[i - 1] : null,
    next: i >= 0 && i < projects.length - 1 ? projects[i + 1] : null,
  };
}

/**
 * Tool-name aliases. The resume writes the same technology several ways
 * ("Amazon S3" / "AWS S3", "pandas" / "Pandas"), which would split one bar into
 * two. Collapsing them keeps the frequency chart honest.
 */
const TOOL_ALIASES: Record<string, string> = {
  "Amazon S3": "AWS S3",
  "Amazon Athena": "AWS Athena",
  "AWS Lambda": "Lambda",
  "Apache Airflow": "Airflow",
  pandas: "Pandas",
  seaborn: "Seaborn",
  "Scikit-learn": "scikit-learn",
  "Logistic Regression": "scikit-learn",
  "K-Means": "scikit-learn",
  "RFM Framework": "scikit-learn",
  "Stable Diffusion v1.5": "Stable Diffusion",
  "YOLOv8x-pose": "YOLOv8",
  Greykite: "Greykite/Silverkite",
  Silverkite: "Greykite/Silverkite",
  OneLake: "Microsoft Fabric",
  RAG: "RAG Pipelines",
  "Deep Learning": "TensorFlow",
  "EER Modeling": "UML",
};

export const canonicalTool = (t: string) => TOOL_ALIASES[t] ?? t;

/** Unique, alias-collapsed stack for a project. */
export function projectTools(p: Project): string[] {
  return Array.from(new Set(p.stack.map(canonicalTool)));
}

/** Half-year bucket ("2025 H2") — coarse enough that every bucket has data. */
export function projectPeriod(p: Project): string {
  const year = p.sort.slice(0, 4);
  const month = Number(p.sort.slice(5, 7));
  return `${year} ${month <= 6 ? "H1" : "H2"}`;
}

/** Every half-year bucket present, oldest first — the x-axis of the time chart. */
export const projectPeriods: string[] = Array.from(
  new Set(projects.map(projectPeriod))
).sort();

/** The n most-used tools across all project stacks, most-used first. */
export function topTools(n = 10): string[] {
  const counts = projects.reduce<Record<string, number>>((acc, p) => {
    for (const t of projectTools(p)) acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, n)
    .map(([tool]) => tool);
}

/** Project counts by category, for the summary chart on the home page. */
export function projectsByCategory(limit = 8): { label: string; value: number }[] {
  const counts = projects.reduce<Record<string, number>>((acc, p) => {
    for (const c of p.categories) acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

/** Dashboard counts by tool, for the summary chart on the dashboards page. */
export function dashboardsByTool(): { label: string; value: number }[] {
  const normalise = (tool: string) => {
    if (tool.startsWith("Power BI")) return "Power BI";
    if (tool.startsWith("Plotly")) return "Plotly";
    return tool;
  };
  const counts = dashboards.reduce<Record<string, number>>((acc, d) => {
    const key = normalise(d.tool);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, value]) => ({ label, value }));
}
