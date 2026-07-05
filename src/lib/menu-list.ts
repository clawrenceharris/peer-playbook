import { Playbook, Session } from "@/components/icons";
import { Home, Search } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/home",
          label: "Home",
          icon: Home,
          submenus: [],
          active: pathname === "/home",
        },
        {
          href: "/my-library/playbooks",
          label: "My Library",
          icon: Playbook,
          active: pathname.startsWith("/my-library"),
        },
        {
          href: `/sessions`,
          label: "Sessions",
          icon: Session,
          active: pathname.startsWith(`/sessions`),
        },

        {
          href: `/discover`,
          label: "Discover",
          icon: Search,
          active: pathname.startsWith(`/discover`),
        },
      ],
    },
  ];
}
