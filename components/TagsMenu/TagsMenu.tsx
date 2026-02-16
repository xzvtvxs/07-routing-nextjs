// TagsMenu.tsx

"use client";

import css from "./TagsMenu.module.css";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TAGS, Tags } from "@/types/note";

// Тип тегів для меню
const ALL_NOTES = "All Notes" as const;
type MenuTag = (typeof TAGS)[number] | typeof ALL_NOTES;

// Повний список тегів для меню
const menuTags: MenuTag[] = [ALL_NOTES, ...TAGS];

const MenuButtonLabel = ({ selectedTag }: { selectedTag: MenuTag }) => {
  return <>{selectedTag === ALL_NOTES ? "Notes" : selectedTag} ▾</>;
};

const MenuItems = ({
  menuTags,
  selectedTag,
  onTagClick,
  getFilterPath,
}: {
  menuTags: MenuTag[];
  selectedTag: MenuTag;
  onTagClick: (tag: MenuTag) => void;
  getFilterPath: (tag: MenuTag) => Tags | "All";
}) => (
  <ul className={css.menuList}>
    {menuTags.map((tag) => (
      <li key={tag} className={css.menuItem}>
        <Link
          href={`/notes/filter/${getFilterPath(tag)}`}
          className={`${css.menuLink} ${selectedTag === tag ? css.active : ""}`}
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </Link>
      </li>
    ))}
  </ul>
);

export default function TagsMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<MenuTag>(ALL_NOTES);
  const pathname = usePathname();

  // Отримуємо тег з поточного URL
  useEffect(() => {
    const pathParts = pathname.split("/");
    const filterIndex = pathParts.indexOf("filter");

    // Не оновлюємо selectedTag, якщо це маршрут модалки (/notes/[id])
    if (pathname.startsWith("/notes/") && !pathname.includes("filter")) {
      return;
    }

    let currentPathTag: string | undefined;

    if (filterIndex > -1 && pathParts.length > filterIndex + 1) {
      currentPathTag = pathParts[filterIndex + 1];
    }

    if (currentPathTag === "All" || pathname === "/") {
      setSelectedTag(ALL_NOTES);
    } else if (currentPathTag && TAGS.includes(currentPathTag as Tags)) {
      setSelectedTag(currentPathTag as MenuTag);
    } else {
      setSelectedTag(ALL_NOTES);
    }
  }, [pathname]);

  const getFilterPath = useCallback((tag: MenuTag): Tags | "All" => {
    return tag === ALL_NOTES ? "All" : tag;
  }, []);

  const handleTagClick = useCallback((tag: MenuTag) => {
    setSelectedTag(tag);
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggleMenu}>
        <MenuButtonLabel selectedTag={selectedTag} />
      </button>
      {isMenuOpen && (
        <MenuItems
          menuTags={menuTags}
          selectedTag={selectedTag}
          onTagClick={handleTagClick}
          getFilterPath={getFilterPath}
        />
      )}
    </div>
  );
}
