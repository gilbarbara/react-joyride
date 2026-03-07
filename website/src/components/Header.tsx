import { useCallback, useState } from 'react';
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import { MoonIcon, SunIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebar } from '~/config/sidebar';
import useTheme from '~/hooks/useTheme';

import Dropdown from '~/components/Dropdown';
import GitHubIcon from '~/components/GitHubIcon';
import Links from '~/components/Links';
import NPMIcon from '~/components/NPMIcon';

import Maze from './Maze';
import Search from './Search';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDocumentationMenuOpen, setIsDocumentationMenuOpen] = useState(false);
  const [isDemosMenuOpen, setIsDemosMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <Navbar
      className="fixed top-0 left-0 right-0 h-16 z-250 print:hidden"
      disableAnimation
      id="app-header"
      isBlurred={false}
      isBordered
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
      position="static"
    >
      <NavbarContent className="grow-0!" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden h-4"
        />
        <NavbarBrand className="gap-2 mr-8">
          <Link className="flex items-center gap-2 text-foreground" href="/">
            <Maze size={32} />
            <span className="hidden sm:block font-bold">React Joyride</span>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4">
          <NavbarItem>
            <Dropdown
              isOpen={isDocumentationMenuOpen}
              isSelected={pathname.startsWith('/docs')}
              onToggle={() => setIsDocumentationMenuOpen(previous => !previous)}
              title="Documentation"
            >
              <Links items={sidebar.docs} onNavigate={() => setIsDocumentationMenuOpen(false)} />
            </Dropdown>
          </NavbarItem>
          <NavbarItem>
            <Dropdown
              isOpen={isDemosMenuOpen}
              isSelected={pathname.startsWith('/demos')}
              onToggle={() => setIsDemosMenuOpen(previous => !previous)}
              title="Demos"
            >
              <Links items={sidebar.demos} onNavigate={() => setIsDemosMenuOpen(false)} />
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>
      <NavbarContent className="gap-0.5" justify="end">
        <NavbarItem>
          <Search />
        </NavbarItem>
        <NavbarItem>
          <Button aria-label="Toggle dark mode" isIconOnly onPress={toggleDarkMode} variant="light">
            {isDarkMode ? <SunIcon className="size-6" /> : <MoonIcon className="size-6" />}
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            aria-label="GitHub Repository"
            as="a"
            href="https://github.com/gilbarbara/react-joyride"
            isIconOnly
            rel="noopener noreferrer"
            target="_blank"
            variant="light"
          >
            <GitHubIcon />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            aria-label="NPM Page"
            as="a"
            href="https://www.npmjs.com/package/react-joyride"
            isIconOnly
            rel="noopener noreferrer"
            target="_blank"
            variant="light"
          >
            <NPMIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="px-0 py-4 gap-0 border-t border-default z-250">
        <NavbarMenuItem className="text-foreground-400 text-small font-bold px-4 pb-1">
          DOCS
        </NavbarMenuItem>
        <Links items={sidebar.docs} onNavigate={closeMenu} wrapper={NavbarMenuItem} />
        <NavbarMenuItem className="text-foreground-400 text-small font-bold px-4 pb-1 mt-4">
          DEMOS
        </NavbarMenuItem>
        <Links items={sidebar.demos} onNavigate={closeMenu} wrapper={NavbarMenuItem} />
      </NavbarMenu>
    </Navbar>
  );
}

export default Header;
