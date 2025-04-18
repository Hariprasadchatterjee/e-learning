import { useEffect, useMemo, useCallback, useState } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchAllUsers, changeUserRole, deleteUser } from '../../../../components/store/slice/adminSlice';
import Slider from './Slider';

// Styled Components for Black and White Theme
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f0f0; /* Light background for header */
  border-bottom: 1px solid #ccc;
  color: #333;
`;

const IconWrapper = styled.div`
  cursor: pointer;
  font-size: 20px; /* Adjust size as needed */
  padding: 5px;
`;

const Box = styled.div`
  padding: 20px;
  border: 1px solid #333; /* Dark border */
  border-radius: 5px;
  background-color: #fff; /* White background */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Subtle dark shadow */
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin: 20px 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: #333; /* Dark text */
`;

const Th = styled.th`
  background-color: #eee; /* Light gray header */
  padding: 12px 15px;
  border: 1px solid #333; /* Dark border */
  cursor: pointer;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px 15px;
  border: 1px solid #ddd; /* Lighter gray border for cells */
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f7f7f7; /* Slightly darker background for even rows */
  }
  &:hover {
    background-color: #e0e0e0; /* Light gray on hover */
  }
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 6px 12px;
  border: 1px solid #555; /* Darker gray border */
  border-radius: 4px;
  background-color: #333; /* Dark background */
  color: #fff; /* White text */
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555; /* Slightly lighter dark on hover */
    border-color: #555;
  }

  &:disabled {
    background-color: #ccc; /* Light gray disabled */
    color: #666; /* Darker gray disabled text */
    border-color: #ccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #777; /* Darker gray for delete */

  &:hover {
    background-color: #999; /* Slightly lighter gray on hover */
  }
`;

const PaginationButton = styled(Button)`
  background-color: #444; /* Another shade of dark gray */

  &:hover {
    background-color: #666;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const PageInfo = styled.span`
  margin: 0 10px;
  font-size: 14px;
  color: #333; /* Dark text */
`;

const PageSizeSelect = styled.select`
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #777; /* Darker gray border */
  font-size: 14px;
  color: #333; /* Dark text */
  background-color: #fff; /* White background */
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8); /* Slightly opaque white */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  color: #333; /* Dark loading text */
  font-size: 16px;
`;

const Users = () => {
  const { users, loading, error, message } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState({});

  const [prevError, setPrevError] = useState(null);
  const [prevMessage, setPrevMessage] = useState(null);


  useEffect(() => {
         dispatch(fetchAllUsers());
  }, [dispatch]);

  // Handle messages and errors (only show once)
  useEffect(() => {
    if (message && message !== prevMessage) {
      toast.success(message);
      setPrevMessage(message);
    }
    if (error && error !== prevError) {
      toast.error(error);
      setPrevError(error);
    }
  }, [message, error, prevMessage, prevError]);

  // Clear previous messages when unmounting
  useEffect(() => {
    return () => {
      setPrevError(null);
      setPrevMessage(null);
    };
  }, []);

  const data = useMemo(
    () => users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription,
    })),
    [users]
  );

  const handleChangeRole = useCallback(async (user) => {
    setActionLoading(prev => ({ ...prev, [user.id]: true }));
    try {
      const result = await dispatch(changeUserRole({ id: user.id }));
      if (changeUserRole.fulfilled.match(result)) {
        dispatch(fetchAllUsers());
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [user.id]: false }));
    }
  }, [dispatch]);

  const handleDelete = useCallback(async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;

    setActionLoading(prev => ({ ...prev, [`delete-${user.id}`]: true }));
    try {
      const result = await dispatch(deleteUser({ id: user.id }));
      if (deleteUser.fulfilled.match(result)) {
        dispatch(fetchAllUsers());
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${user.id}`]: false }));
    }
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id', width: 100 },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      {
        Header: 'Role',
        accessor: 'role',
        Cell: ({ value }) => value.charAt(0).toUpperCase() + value.slice(1)
      },
      {
        Header: 'Subscription',
        accessor: 'subscription',
        Cell: ({ value }) => (value?.status === 'active' ? 'Premium' : 'Free')
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        disableSortBy: true,
        width: 200,
        Cell: ({ row }) => (
          <div>
            <Button
              onClick={() => handleChangeRole(row.original)}
              disabled={actionLoading[row.original.id]}
            >
              {actionLoading[row.original.id] ? 'Changing...' : 'Change Role'}
            </Button>
            <DeleteButton
              onClick={() => handleDelete(row.original)}
              disabled={actionLoading[`delete-${row.original.id}`]}
            >
              {actionLoading[`delete-${row.original.id}`] ? 'Deleting...' : 'Delete'}
            </DeleteButton>
          </div>
        ),
      },
    ],
    [handleChangeRole, handleDelete, actionLoading]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  if (loading === true && users.length === 0) {
    return (
      <Slider>
        <Box style={{ position: 'relative', minHeight: '200px' }}>
          <LoadingOverlay>Loading users...</LoadingOverlay>
        </Box>
      </Slider>
    );
  }

  return (
    <Slider>
       <Box style={{ position: 'relative' }}>
        <Header>
          <IconWrapper onClick={() => { /* Handle menu toggle */ }}>
            {/* Menu Icon */}
            ☰
          </IconWrapper>
          <IconWrapper onClick={() => { /* Handle theme toggle */ }}>
            {/* Theme Icon (e.g., ☀️ or 🌙) */}
            🔆
          </IconWrapper>
        </Header>

        {loading && <LoadingOverlay>Processing...</LoadingOverlay>}

        <TableContainer>
          <Table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {column.render('Header')}
                        <span style={{ marginLeft: '5px' }}>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' ↓'
                              : ' ↑'
                            : ''}
                        </span>
                      </div>
                    </Th>
                  ))}
                </Tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                    ))}
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableContainer>

        <PaginationContainer>
          <PaginationButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </PaginationButton>
          <PaginationButton onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </PaginationButton>

          <PageInfo>
            Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
          </PageInfo>

          <PaginationButton onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </PaginationButton>
          <PaginationButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </PaginationButton>

          <PageSizeSelect
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </PageSizeSelect>
        </PaginationContainer>
      </Box>
    </Slider>
  );
};

export default Users;



