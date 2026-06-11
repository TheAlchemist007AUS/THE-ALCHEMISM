/**
 * Agent-editable registry of publicly-crawlable routes. Consumed by the
 * /sitemap.xml handler in src/server/entry.ts.
 *
 * Guidelines for maintaining this file:
 * - Add a new entry whenever you add a new publicly-crawlable page.
 * - Do not include dynamic-param routes like "/products/:id" directly.
 *   Instead, enumerate real values (e.g. "/products/desk-pro") or skip.
 * - `path` MUST start with "/".
 * - Priorities are between 0.0 and 1.0. Home = 1.0, main sections = 0.8,
 *   deep pages = 0.5.
 * - Dev-only or auth-required routes MUST NOT be listed.
 */

export interface SeoRoute {
	path: string;
	changefreq?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	priority?: number;
	lastmod?: string;
}

export const seoRoutes: SeoRoute[] = [
	{ path: "/",          changefreq: "weekly",  priority: 1.0 },
	{ path: "/og-clan",   changefreq: "monthly", priority: 0.8 },
	{ path: "/gaming",    changefreq: "weekly",  priority: 0.8 },
	{ path: "/music",     changefreq: "weekly",  priority: 0.8 },
	{ path: "/coaching",  changefreq: "monthly", priority: 0.8 },
	{ path: "/merch",     changefreq: "weekly",  priority: 0.8 },
	{ path: "/blog",      changefreq: "daily",   priority: 0.9 },
	{ path: "/exclusive", changefreq: "weekly",  priority: 0.7 },
	{ path: "/events",    changefreq: "weekly",  priority: 0.8 },
	{ path: "/resources", changefreq: "monthly", priority: 0.7 },
	{ path: "/clips",     changefreq: "weekly",  priority: 0.8 },
];
