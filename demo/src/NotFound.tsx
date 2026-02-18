import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';
import { Frown } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Frown size={48} />
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        <Link to="/">
          <Button className="bg-black text-white">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
