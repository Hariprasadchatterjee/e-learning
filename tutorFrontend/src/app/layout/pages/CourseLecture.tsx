import { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text, VStack, Stack } from '@chakra-ui/react';
import { fetchCourseLectured } from '@/components/store/slice/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/components/store/store';
import { useNavigate, useParams } from 'react-router-dom';

const CourseLecture = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const navigate = useNavigate();
  const [lectureCount, setLectureCount] = useState<number>(0);
  
  // Get all state from the course slice
  const { lectures, loading, error } = useSelector((state: RootState) => state.course);
  console.log("lectures", lectures);
  
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check subscription status first
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    if (user.role === "user" && user.subscription?.status !== "active") {
      navigate('/subscription');
      return;
    }

    // Only proceed with fetching lectures if subscription is active
    if (!params.id) {
      console.error("Course ID not found in URL");
      return;
    }

    dispatch(fetchCourseLectured({ id: params.id }));
  }, [dispatch, navigate, params.id, user]);

  if (loading) {
    return <Box p={4} mt={20}>Loading lectures...</Box>;
  }

  if (error) {
    return <Box p={4} mt={20}>Error: {error}</Box>;
  }

  if (!lectures || lectures.length === 0) {
    return <Box p={4} mt={20}>No lectures available for this course</Box>;
  }

  const currentLecture = lectures[lectureCount];

  return (
    <Box p={4} mt={20}>
      {/* Top Section: Video and Lecture Details */}
      <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
        {/* Left Side: Video Content */}
        <Box flex={2} mr={{ md: 4 }}>
          <Box
            as="iframe"
            width="100%"
            height="400px"
            src={currentLecture?.video?.url || ''}
            title={currentLecture?.title}
            allowFullScreen
          />
        </Box>

        {/* Right Side: Lecture Count and Title */}
        <Box flex={1}>
          <VStack align="start" gap={4}>
            {/* Lecture List */}
            <Stack gap={3} width="100%">
              {lectures.map((lecture, index) => (
                <Box 
                  onClick={() => setLectureCount(index)} 
                  key={lecture._id} 
                  p={3} 
                  borderWidth="1px" 
                  borderRadius="md"
                  cursor="pointer"
                  bg={index === lectureCount ? 'gray.100' : 'transparent'}
                  _hover={{ bg: 'gray.50' }}
                >
                  <Text fontSize="lg" fontWeight="bold">
                    {index + 1}. {lecture.title}
                  </Text>
                </Box>
              ))}
            </Stack>
          </VStack>
        </Box>
      </Flex>

      {/* Bottom Section: Video Description */}
      <Box mt={8}>
        <Heading as="h2" size="md" mb={4}>
          #{lectureCount + 1} {currentLecture?.title}
        </Heading>
        <Text mb={4}>{currentLecture?.description}</Text>
      </Box>
    </Box>
  );
};

export default CourseLecture;