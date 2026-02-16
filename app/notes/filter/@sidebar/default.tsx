//app/notes/filter/@sidebar/default.tsx

import css from "./SidebarNotes.module.css";
import Link from "next/link";
import { TAGS, Tags } from "@/types/note";

// Тип тегів для меню
const ALL_NOTES = "All Notes" as const;
type MenuTag = (typeof TAGS)[number] | typeof ALL_NOTES;

// Повний список тегів для меню
const menuTags: MenuTag[] = [ALL_NOTES, ...TAGS];

export default function SidebarNotes() {
  const getFilterPath = (tag: MenuTag): Tags | "All" => {
    return tag === ALL_NOTES ? "All" : tag;
  };

  return (
    <ul className={css.menuList}>
      {menuTags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${getFilterPath(tag)}`}
            className={css.menuLink}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
