'use client';

import { useCallback, useState, type Key } from 'react';
import {
  Button,
  Dropdown as HeroDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import { CheckIcon, LanguagesIcon, MoonIcon, SunIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebar } from '~/config/sidebar';
import { useConfig } from '~/context/ConfigContext';
import useTheme from '~/hooks/useTheme';
import { languageOptions, type LocaleKey } from '~/modules/messages';

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
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { localeKey, setLocaleKey } = useConfig();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const currentLanguage =
    languageOptions.find(option => option.value === localeKey)?.label ?? 'English';

  const handleLanguageAction = useCallback(
    (key: Key) => {
      setLocaleKey(String(key) as LocaleKey);
      setIsLanguageMenuOpen(false);
    },
    [setLocaleKey],
  );

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
        <NavbarBrand className="gap-2 mr-6">
          <Link
            className="flex items-center gap-2 text-foreground rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href="/"
          >
            <Maze size={32} />
            <span className="hidden sm:block font-bold">React Joyride</span>
          </Link>
        </NavbarBrand>
        <NavbarContent as="nav" aria-label="Primary" className="hidden sm:flex gap-4">
          <NavbarItem>
            <Dropdown
              isOpen={isDocumentationMenuOpen}
              isSelected={pathname.startsWith('/docs')}
              onToggle={() => {
                setIsDocumentationMenuOpen(previous => !previous);
                setIsDemosMenuOpen(false);
              }}
              title="Documentation"
            >
              <Links items={sidebar.docs} onNavigate={() => setIsDocumentationMenuOpen(false)} />
            </Dropdown>
          </NavbarItem>
          <NavbarItem>
            <Dropdown
              isOpen={isDemosMenuOpen}
              isSelected={pathname.startsWith('/demos')}
              onToggle={() => {
                setIsDemosMenuOpen(previous => !previous);
                setIsDocumentationMenuOpen(false);
              }}
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
          <HeroDropdown
            classNames={{ content: '!z-[1000] min-w-40' }}
            isOpen={isLanguageMenuOpen}
            onOpenChange={setIsLanguageMenuOpen}
            placement="bottom-end"
          >
            <DropdownTrigger>
              <Button
                aria-label={`Language: ${currentLanguage}`}
                className="min-w-0 px-2 gap-1.5"
                startContent={<LanguagesIcon className="size-5" />}
                variant="light"
              >
                <span className="text-sm font-medium uppercase">{localeKey}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Select language" onAction={handleLanguageAction}>
              {languageOptions.map(option => (
                <DropdownItem
                  key={option.value}
                  endContent={
                    option.value === localeKey ? <CheckIcon aria-hidden className="size-4" /> : null
                  }
                  textValue={option.label}
                >
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </HeroDropdown>
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
        <NavbarMenuItem className="text-foreground-500 text-xs font-semibold tracking-wide uppercase px-3 pb-2">
          Docs
        </NavbarMenuItem>
        <Links items={sidebar.docs} onNavigate={closeMenu} wrapper={NavbarMenuItem} />
        <NavbarMenuItem className="text-foreground-500 text-xs font-semibold tracking-wide uppercase px-3 pb-2 pt-4">
          Demos
        </NavbarMenuItem>
        <Links items={sidebar.demos} onNavigate={closeMenu} wrapper={NavbarMenuItem} />
      </NavbarMenu>
    </Navbar>
  );
}

export default Header;
