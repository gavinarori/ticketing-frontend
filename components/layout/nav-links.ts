// components/layout/nav-links.ts
import { ROUTES } from "@/lib/utils/constants";

export const NAV_LINKS = [
  { label: "Fixtures", href: ROUTES.events },
  { label: "Membership", href: "/membership" },
  { label: "My tickets", href: "/orders" },
] as const;