/**
 * A static export has no server to send a 301, so the page redirects in the browser.
 * The meta refresh also works with JavaScript off; the link is the last fallback.
 */
export function RedirectTo({ href }: { href: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <meta name="robots" content="noindex" />
      <link rel="canonical" href={href} />
      <a href={href}>کافه هور · Hoor Cafe</a>
    </>
  );
}
