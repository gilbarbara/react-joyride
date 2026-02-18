import { NavLink } from 'react-router-dom';
import { Button } from '@heroui/react';

export default function Header() {
  const style = { textDecoration: 'none' };

  return (
    <div className="px-4 py-6">
      <div className="flex justify-center gap-2">
        <NavLink end style={style} to="/multi-route">
          {({ isActive }) => (
            <Button color="secondary" variant={isActive ? 'solid' : 'bordered'}>
              Home
            </Button>
          )}
        </NavLink>

        <NavLink style={style} to="/multi-route/a">
          {({ isActive }) => (
            <Button color="secondary" variant={isActive ? 'solid' : 'bordered'}>
              Route A
            </Button>
          )}
        </NavLink>

        <NavLink style={style} to="/multi-route/b">
          {({ isActive }) => (
            <Button color="secondary" variant={isActive ? 'solid' : 'bordered'}>
              Route B
            </Button>
          )}
        </NavLink>
      </div>

      <h1 className="text-center text-4xl font-bold mt-6">Multi-route</h1>
    </div>
  );
}
