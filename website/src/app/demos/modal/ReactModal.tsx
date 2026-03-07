import { useMemo } from 'react';
import Modal from 'react-modal';
import {
  Button,
  cn,
  Input,
  Select,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';

interface ReactModalProps {
  activeModal: string;
  isDarkMode: boolean;
  onAfterOpen: () => void;
  onClose: () => void;
  onOpen: () => void;
  onRequestClose: () => void;
}

const tableData = [
  { key: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { key: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  {
    key: '3',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'Viewer',
    status: 'Inactive',
  },
  { key: '4', name: 'Dave Brown', email: 'dave@example.com', role: 'Editor', status: 'Active' },
  {
    key: '5',
    name: 'Eve Martinez',
    email: 'eve@example.com',
    role: 'Admin',
    status: 'Active',
  },
];

export default function ReactModal(props: ReactModalProps) {
  const { activeModal, isDarkMode, onAfterOpen, onClose, onOpen, onRequestClose } = props;

  const customStyles = useMemo(
    () => ({
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      content: {
        backgroundColor: isDarkMode ? '#18181b' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
        top: 100,
        margin: '0 auto',
        maxHeight: '75%',
        maxWidth: 1280,
        textAlign: 'center' as const,
      },
    }),
    [isDarkMode],
  );

  return (
    <>
      <Button color="success" onPress={onOpen}>
        Open React Modal
      </Button>
      <Modal
        ariaHideApp={false}
        contentLabel="Users Modal"
        isOpen={activeModal === 'react-modal'}
        onAfterOpen={onAfterOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
      >
        <h2 className="text-2xl font-bold mb-2">User Management</h2>
        <p className="text-default-500 mb-4">Manage team members and their permissions</p>
        <div className="modal-items flex flex-col gap-4 w-full max-w-3xl mx-auto text-left">
          <div className="rm-toolbar flex items-center gap-3">
            <Input className="max-w-48" placeholder="Filter by name..." size="sm" type="text" />
            <Select className="max-w-48" placeholder="All roles" size="sm">
              <SelectItem key="all">All roles</SelectItem>
              <SelectItem key="admin">Admin</SelectItem>
              <SelectItem key="editor">Editor</SelectItem>
              <SelectItem key="viewer">Viewer</SelectItem>
            </Select>
            <Button className="ml-auto" color="primary" size="sm">
              Add User
            </Button>
          </div>
          <div className="rm-table">
            <Table aria-label="Users table" classNames={{ th: 'text-sm' }} isCompact>
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Role</TableColumn>
                <TableColumn>Status</TableColumn>
              </TableHeader>
              <TableBody>
                {tableData.map(row => (
                  <TableRow key={row.key}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded-full',
                          row.status === 'Active'
                            ? 'bg-success-100 text-success-700'
                            : 'bg-default-100 text-default-500',
                        )}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="rm-toggles flex items-center gap-4">
            <Switch defaultSelected size="sm">
              Show inactive
            </Switch>
            <Switch size="sm">Compact view</Switch>
          </div>
          <div className="rm-actions flex gap-2 justify-end mt-4">
            <Button onPress={onClose} variant="bordered">
              Close
            </Button>
            <Button color="success">Export</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
