//notes\[id\]error.tsx

"use client";

import css from "./error.module.css";

type Props = {
  error: Error;
};
export default function Error({ error }: Props) {
  return <h1 className={css.error}>{error.message}</h1>;
}
