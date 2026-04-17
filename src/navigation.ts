import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";

export { Link, redirect, usePathname, useRouter };

export function getPathname(pathname: string | { href: string }): string {
  return typeof pathname === "string" ? pathname : pathname.href;
}
