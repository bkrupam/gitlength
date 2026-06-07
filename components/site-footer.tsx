const GITHUB_REPO = "https://github.com/bkrupam/gitlength";
const GITHUB_USER = "https://github.com/bkrupam";
const GITHUB_CONTRIBUTE = `${GITHUB_REPO}/blob/main/CONTRIBUTING.md`;
const GITHUB_STARS = `${GITHUB_REPO}/stargazers`;
const GITHUB_ISSUES = `${GITHUB_REPO}/issues`;

const FOOTER_LINKS = [
  { label: "GitHub", href: GITHUB_REPO },
  { label: "Contribute", href: GITHUB_CONTRIBUTE },
  { label: "Star on GitHub", href: GITHUB_STARS },
  { label: "Open an Issue", href: GITHUB_ISSUES },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-edge/35 bg-cool-mist">
      <div className="page-container px-[var(--spacing-24)] py-[var(--spacing-64)]">
        <div className="grid gap-[var(--spacing-64)] md:grid-cols-2">
          <div>
            <p className="type-wordmark lowercase text-midnight-ink">gitcook</p>
            <p className="mt-[var(--spacing-16)] max-w-sm type-body text-charcoal-whisper">
              Open source tool for turning GitHub trends into tool ideas.
            </p>
            <p className="mt-[var(--spacing-16)] type-body-sm text-graphite-mute">
              Built by{" "}
              <a
                href={GITHUB_USER}
                target="_blank"
                rel="noopener noreferrer"
                className="text-invoice-blue transition-colors hover:text-charcoal-whisper"
              >
                @bkrupam
              </a>
              .
            </p>
          </div>

          <div>
            <p className="type-body-sm font-medium text-midnight-ink">Links</p>
            <ul className="mt-[var(--spacing-16)] flex flex-col gap-[var(--spacing-16)]">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-body-sm text-invoice-blue transition-colors hover:text-charcoal-whisper"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-[var(--spacing-64)] border-t border-stone-edge/35 pt-[var(--spacing-24)]">
          <p className="type-body-sm text-graphite-mute">
            © 2026 Gitcook · Open Source · MIT License
          </p>
        </div>
      </div>
    </footer>
  );
}
