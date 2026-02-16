// Header.tsx

import css from "./Header.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.brandLink}>
        Note<span>Hub</span>
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/" className={css.navItem}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/notes/filter/all" className={css.navItem}>
              Notes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
