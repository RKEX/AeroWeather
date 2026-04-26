import Link from "next/link";
import { redirect } from "next/navigation";

export { Link, redirect };

export function getPathname(pathname: string | { href: string }): string {
  return typeof pathname === "string" ? pathname : pathname.href;
}
