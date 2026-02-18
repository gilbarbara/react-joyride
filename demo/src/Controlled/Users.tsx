import { forwardRef } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';

import ContentBox from '../components/ContentBox';

const data = [
  { key: '1', name: 'Alan', paid: 123, width: 15 },
  { key: '2', name: 'Beatrice', paid: 234, width: 30 },
  { key: '3', name: 'Eric', paid: 456, width: 95 },
  { key: '4', name: 'Tracy', paid: 246, width: 50 },
];

const Users = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="flex flex-col bg-blue p-4 text-center">
      <h2 className="text-2xl font-bold mb-2">Users</h2>
      <ContentBox>
        <Table aria-label="Users table" classNames={{ th: 'text-sm' }} isCompact>
          <TableHeader>
            <TableColumn width={120}>Name</TableColumn>
            <TableColumn minWidth={120}>Percentage</TableColumn>
            <TableColumn>Paid</TableColumn>
          </TableHeader>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.key}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <div className="bg-green h-2" style={{ width: row.width }} />
                </TableCell>
                <TableCell>{row.paid}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContentBox>
    </div>
  );
});

export default Users;
