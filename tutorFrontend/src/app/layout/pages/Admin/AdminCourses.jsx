import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTable, usePagination, useSortBy } from 'react-table';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import CourseModal from './CourseModel';
import Slider from './Slider';
import { addCourseLectured, deletecourse, deleteCourseLectured, getadmincourse } from '../../../../components/store/slice/courseSlice';
import GlobalLoader from '../../../../middleware/GlobalLoader';

const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

const Th = styled.th`
  background-color: #eee;
  color: #333;
  padding: 12px 15px;
  border-bottom: 2px solid #ddd;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
`;

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f7f7f7;
  }
  &:hover {
    background-color: #e0e0e0;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled(Button)`
  background-color: #6c757d;
  margin: 0 5px;

  &:hover {
    background-color: #5a6268;
  }
`;

const PageInfo = styled.span`
  margin: 0 15px;
  font-size: 1rem;
  color: #555;
`;

const PageSizeSelect = styled.select`
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  color: #555;
`;

const Loading = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  color: #555;
`;

const AdminCourses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const dispatch = useDispatch();

  const { courses, loading, error, message } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(getadmincourse());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const data = useMemo(
    () => courses?.length > 0 ? courses.map((course, index) => ({
      id: index + 1,
      courseId: course._id, // Add courseId for actions
      Poster: { url: course.poster?.url || '' },
      Title: course.title,
      Category: course.category,
      Views: course.views,
      Lecture: course.lectures?.length || 0,
    })) : [],
    [courses]
  );

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      {
        Header: 'POSTER',
        accessor: 'Poster',
        Cell: ({ cell: { value } }) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={value.url}
              alt="Poster"
              style={{ maxWidth: '100px', maxHeight: '60px' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/100x60'; // Fallback image
              }}
            />
          </div>
        )
      },
      { Header: 'TITLE', accessor: 'Title' },
      { Header: 'CATEGORY', accessor: 'Category' },
      { Header: 'VIEWS', accessor: 'Views' },
      { Header: 'LECTURES', accessor: 'Lecture' },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <div>
            <Button onClick={() => handleCourseDetails(row.original)}>Details</Button>
            <DeleteButton onClick={() => handleDelete(row.original)}>Delete</DeleteButton>
          </div>
        ),
      },
    ],
    []
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

  const handleCourseDetails = (course) => {
    console.log('Course details:', course);
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (course) => {
    console.log('Delete course:', course);
    console.log('Delete course Id:', (course.courseId).toString());
    const id = course.courseId;
    const result = await dispatch(deletecourse({ id }));
    if (deletecourse.fulfilled.match(result)) {
      toast.success(message);
      dispatch(getadmincourse());
    } else {
      toast.error('Failed to delete course!');
    }
  };

  const deleteButtonHandler = async (courseId, lectureId) => {
    console.log(courseId, lectureId);
    const result = await dispatch(deleteCourseLectured({ courseId, lectureId }));
    if (deleteCourseLectured.fulfilled.match(result)) {
      toast.success(message);
      dispatch(getadmincourse());
    } else {
      toast.error('Failed to delete lecture!');
    }
  };

  const addLectureHandler = async (formdata, id) => {
    const result = await dispatch(addCourseLectured({ formdata, id }));
    if (addCourseLectured.fulfilled.match(result)) {
      toast.success(message);
      dispatch(getadmincourse());
    } else {
      toast.error('Failed to add lecture!');
    }
    const formEnData = Object.fromEntries(formdata.entries());
    console.log(formEnData, id);
  };

  if (loading) {
    return (
      <Slider>
        <Container>
          <GlobalLoader />
        </Container>
      </Slider>
    );
  }

  return (
    <Slider>
      <Container>
        <h2>All Available Courses In the Database</h2>
        {data.length === 0 && !loading ? (
          <p>No courses available</p>
        ) : (
          <>
            <TableContainer>
              <Table {...getTableProps()}>
                <thead>
                  {headerGroups.map(headerGroup => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render('Header')}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                              : ''}
                          </span>
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
                        {row.cells.map((cell) => (
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
              <PaginationButton onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
              </PaginationButton>
              <PaginationButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {'>>'}
              </PaginationButton>
              <PageInfo>
                Page{' '}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
              </PageInfo>
              <PageSizeSelect
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map(size => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </PageSizeSelect>
            </PaginationContainer>
          </>
        )}

        {selectedCourse && (
          <CourseModal
            id={selectedCourse.courseId}
            courseTitle={selectedCourse.Title}
            deleteButtonHandler={deleteButtonHandler}
            addLectureHandler={addLectureHandler}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Container>
    </Slider>
  );
};

export default AdminCourses;