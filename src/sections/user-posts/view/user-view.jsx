import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { users } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import {POSTS_URL} from '../../../utils/apiUrls';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('postTitle');

  const [filterName, setFilterName] = useState('');

  const [myPosts, setMyPosts] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };
  const handleDeleteSuccess = (deletedPostIds) => {
    if (Array.isArray(deletedPostIds)) {
      setMyPosts((prevMyPosts) =>
        prevMyPosts.filter((post) => !deletedPostIds.includes(post.postId))
      );
    } else {
      console.error('deletedPostIds must be an array.');
    }
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${POSTS_URL}/personal`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
          },
        });
        const responseData = await response.json();
        setMyPosts((prevMyPosts) => responseData.data);
      } catch (error) {
        console.error('Error fetching resource types:', error);
      }
    };
  
    fetchPosts();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = myPosts.map((n) => n.postTitle);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleNewPostClick = () => {
    navigate('/post');
  };

  const handleClick = (event, postId) => {
    const selectedIndex = selected.indexOf(postId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, postId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: myPosts,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">My posts</Typography>

        <Button variant="outlined" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewPostClick}>
          New post
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          onDeleteSuccess={handleDeleteSuccess}
          selected={selected}
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={myPosts.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'postTitle', label: 'Title' },
                  { id: 'postDescription', label: 'Description' },
                  { id: 'price', label: 'Price' },
                  { id: 'address', label: 'Address' },
                  { id: 'resourceTypeDescription', label: 'Resource type' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.postId}
                      postId={row.postId}
                      postTitle={row.postTitle}
                      postDescription={row.postDescription}
                      price={row.price}
                      address={row.address}
                      resourceTypeDescription={row.resourceTypeDescription}
                      selected={selected.indexOf(row.postId) !== -1}
                      handleClick={(event) => handleClick(event, row.postId)}
                      onDeleteSuccess={handleDeleteSuccess}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, myPosts.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={myPosts.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
