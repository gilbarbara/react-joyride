import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  cn,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import { BookOpenTextIcon } from 'lucide-react';

import Maze from './Maze';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Basic', path: '/' },
    { label: 'Multi Route', path: '/multi-route' },
    { label: 'Controlled', path: '/controlled' },
    { label: 'Custom', path: '/custom' },
    { label: 'Carousel', path: '/carousel' },
    { label: 'Modal', path: '/modal' },
    { label: 'Scroll', path: '/scroll' },
  ];

  return (
    <Navbar
      className="fixed top-0 left-0 right-0 bg-white"
      disableAnimation
      isBordered
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
      position="static"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden h-4"
        />
        <NavbarBrand className="gap-2">
          <Maze />
          <span className="hidden md:block font-bold">React Joyride</span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        {menuItems.map(item => (
          <NavbarItem key={item.path}>
            <NavLink
              className={({ isActive }) =>
                cn('text-black', {
                  'font-bold': isActive,
                })
              }
              to={item.path}
            >
              {item.label}
            </NavLink>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <a
            aria-label="GitHub Repository"
            href="https://github.com/gilbarbara/react-joyride"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              alt="GitHub"
              className="size-5"
              src="https://cdn.svglogos.dev/logos/github-icon.svg"
            />
          </a>
        </NavbarItem>
        <NavbarItem>
          <a
            aria-label="Documentation"
            className="text-black"
            href="https://docs.react-joyride.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <BookOpenTextIcon size={20} />
          </a>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="z-100000">
        {menuItems.map(item => (
          <NavbarMenuItem key={item.path} onClick={() => setIsMenuOpen(false)}>
            <NavLink
              className={({ isActive }) =>
                cn('text-black', {
                  'font-bold': isActive,
                })
              }
              to={item.path}
            >
              {item.label}
            </NavLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default Header;
