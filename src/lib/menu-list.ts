import { Playbook } from "@/components/icons";
import { Home, Search, Plus, Library, Brain, PieChart } from "lucide-react";

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
  tooltip?: string;
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
          icon: Library,
          active: pathname.startsWith("/my-library"),
        },
        {
          href: `/sessions`,
          label: "Sessions",
          icon: PieChart,
          active: pathname.startsWith(`/sessions`),
        },
      ],
    },
    {
      groupLabel: "Create",
      menus: [
        {
          href: `/playbooks/create`,
          label: "New Playbook",
          icon: Plus,
          tooltip: "New playbook",
          active: pathname.startsWith(`/playbooks/create`),
        },
      ],
    },
    {
      groupLabel: "Find more",
      menus: [
        {
          href: `/discover`,
          label: "Discover",
          icon: Search,
          active: pathname.startsWith(`/discover`),
        },
        {
          href: `/discover/playbooks`,
          label: "Playbooks",
          icon: Playbook,
          active: pathname.startsWith(`/discover/playbooks`),
        },
        {
          href: `/discover/strategies`,
          label: "Strategies",
          icon: Brain,
          active: pathname.startsWith(`/discover/strategies`),
        },
      ],
    },
  ];
}
