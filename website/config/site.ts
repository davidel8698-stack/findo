import type { SiteConfig, NavItem } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Findo",
  description:
    "מערכת אוטומטית לצמיחת העסק שלך - לידים, ביקורות, ונוכחות דיגיטלית",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://findo.co.il",
  ogImage: "/og-image.png",
  links: {
    whatsapp: "https://wa.me/972501234567", // Placeholder - update with real number
    email: "hello@findo.co.il",
    phone: "050-123-4567", // Placeholder - update with real number
  },
};

export const navItems: NavItem[] = [
  { title: "איך זה עובד", href: "#how-it-works" },
  { title: "מה אומרים עלינו", href: "#testimonials" },
  { title: "מחירים", href: "#pricing" },
  { title: "שאלות נפוצות", href: "#faq" },
];
