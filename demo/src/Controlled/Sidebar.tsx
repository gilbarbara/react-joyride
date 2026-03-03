import type { RefObject } from 'react';
import { push as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface SidebarProps {
  disclaimerRef: RefObject<HTMLDivElement | null>;
  handleStateChange: (state: { isOpen: boolean }) => void;
  sidebarOpen: boolean;
  sidebarRef: RefObject<HTMLDivElement | null>;
}

export default function Sidebar(props: SidebarProps) {
  const { disclaimerRef, handleStateChange, sidebarOpen, sidebarRef } = props;

  return (
    <div>
      <Menu
        customBurgerIcon={false}
        customCrossIcon={<X color="#f04" size={24} />}
        isOpen={sidebarOpen}
        onStateChange={handleStateChange}
        pageWrapId="innerContainer"
        styles={{
          bmOverlay: {
            backgroundColor: '#ff004433',
            left: '0',
            top: '0',
          },
          bmMenuWrap: {
            position: 'absolute',
            height: '100%',
            top: '0',
            left: '0',
          },
        }}
        width={240}
      >
        <div ref={sidebarRef} className="bg-white h-full overflow-auto p-4" id="sidebar">
          <h2 className="text-2xl font-bold mb-2">Menu</h2>
          <div className="flex flex-col gap-4">
            <Link className="menu-item" to="/">
              <p className="font-bold">Home</p>
              <p className="text-gray-500">The basic demo</p>
            </Link>
            <Link className="menu-item" to="/controlled">
              <p className="font-bold">Controlled</p>
              <p className="text-gray-500">The controlled demo</p>
            </Link>
            <Link className="menu-item" to="/custom">
              <p className="font-bold">Custom</p>
              <p className="text-gray-500">Custom Tooltip demo</p>
            </Link>
            <Link className="menu-item" to="/modal">
              <p className="font-bold">Modal</p>
              <p className="text-gray-500">The modal demo</p>
            </Link>
            <Link className="menu-item" to="/scroll">
              <p className="font-bold">Scroll</p>
              <p className="text-gray-500">The scroll demo</p>
            </Link>

            <h3 className="text-xl font-bold mt-4 mb-2">TOC</h3>
            <p className="text-gray-500">
              Reprehenderit dolor voluptate commodo officia magna occaecat cillum. Ipsum aliqua
              reprehenderit eu sint sint anim laborum sunt eu elit. Magna elit veniam in sunt
              commodo ipsum adipisicing labore ut. In occaecat ut dolor dolor amet minim minim.
            </p>
            <p className="text-gray-500">
              Esse labore aliqua aliqua eiusmod qui sit aute culpa proident enim consectetur dolore.
              Adipisicing id aliqua velit ipsum do dolor. Ipsum fugiat magna tempor enim. Voluptate
              esse exercitation magna cillum irure mollit nostrud in duis ipsum amet.
            </p>
            <p className="text-gray-500">
              Reprehenderit dolor voluptate commodo officia magna occaecat cillum. Ipsum aliqua
              reprehenderit eu sint sint anim laborum sunt eu elit. Magna elit veniam in sunt
              commodo ipsum adipisicing labore ut. In occaecat ut dolor dolor amet minim minim.
            </p>
            <h4 ref={disclaimerRef} className="text-lg font-bold mt-4 mb-2">
              Terms of Service
            </h4>
            <p className="text-gray-500">
              Reprehenderit et deserunt officia sunt nisi dolore nulla tempor laborum culpa esse do
              Lorem eu. Anim laborum cupidatat proident aliqua sunt. Officia nulla do deserunt ex
              culpa commodo pariatur dolor duis occaecat deserunt. Minim nulla dolore enim officia
              ut sit proident elit Lorem ex incididunt incididunt. In ex id aliquip fugiat nulla
              excepteur et. Culpa sunt voluptate excepteur veniam irure elit incididunt Lorem eu
              excepteur adipisicing aliqua laboris.
            </p>
          </div>
        </div>
      </Menu>
    </div>
  );
}
