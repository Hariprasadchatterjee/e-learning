import React, { useEffect, useState } from 'react';
import { Box, Input, Button, VStack, HStack, Heading, Stack } from '@chakra-ui/react';
import Course from './Course';
import { AppDispatch, RootState } from '@/components/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from "@/components/store/slice/courseSlice";
import { addToPlaylist, fetchProfile } from '@/components/store/slice/userSlice';
// import { FiSearch } from 'react-icons/fi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 25px;
  padding: 8px 15px;
  width: 300px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    background-color: #fff;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  padding: 8px;
  font-size: 16px;
  color: #333;

  &::placeholder {
    color: #999;
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  color: #777;
  margin-right: 10px;
`;

const cateGories = ["Web Development", "Artificial Intelligence", "Data Science", "Machine Learning", "All Courses"];

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { courses, lectures } = useSelector((state: RootState) => state.course);

  const addToPlayListHandler = async (id: string) => {
    setCurrentId(id);
    try {
      const result = await dispatch(addToPlaylist({ courseId: id }));
      if (addToPlaylist.fulfilled.match(result)) {
        setCurrentId(null);
      }
      dispatch(fetchProfile());
    } catch (error) {
      console.log(error);
    } finally {
      setCurrentId(null);
    }
  };

  // Fetch courses when search term, category, or lectures change
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // If "All Courses" is selected, pass empty category to fetch all
        const categoryParam = category === "All Courses" ? '' : category;
        await dispatch(fetchCourses({
          title: searchTerm,
          category: categoryParam
        }));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, [dispatch, searchTerm, category, lectures]);

  return (
    <Box p={4}>
      <VStack spaceY={4}>
        <Heading children="Search All Courses Here" mt={12} />
        <HStack>
          <SearchContainer>
            <SearchIcon icon={faSearch} />
            <SearchInput
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

        </HStack>
        <Stack  direction={["column", "row"]}
            flexWrap="wrap"
            justifyContent={["flex-start", "space-evenly"]}
            alignItems={["center", "flex-start"]}>
          {cateGories.map((cat, index) => (
            <Button
              key={index}
              onClick={() => setCategory(cat)}
              variant={category === cat ? "solid" : "outline"}
              colorScheme="teal"
            >
              {cat}
            </Button>
          ))}
        </Stack>
        <Box>
          <Stack
            direction={["column", "row"]}
            flexWrap="wrap"
            justifyContent={["flex-start", "space-evenly"]}
            alignItems={["center", "flex-start"]}
          >
            {courses.length > 0 ? (
              courses.map((course) => (
                <Course
                  key={course._id}
                  title={course.title}
                  description={course.description}
                  poster={course.poster.url}
                  numberOfViews={course.views}
                  id={course._id}
                  creator={course.createdBy.name}
                  avatar={course.createdBy.avatar.url}
                  isLectureCount={course.numOfVideos}
                  addToPlayListHandler={addToPlayListHandler}
                  currentId={currentId}
                />
              ))
            ) : (
              <Box p={4} textAlign="center" fontSize="lg" color="gray.500">
                No courses found.
              </Box>
            )}
          </Stack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Courses;