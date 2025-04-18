
import { Box, Heading, Text, VStack, Container, Image } from '@chakra-ui/react';

const AboutPage = () => {
  return (
    <Container maxW="container.md" py={10}>
      <VStack spaceY={6} align="start">
        {/* Image Section */}
        <Box textAlign="center" w="100%">
          <Image
            borderRadius="full"
            boxSize="150px"
            src="https://via.placeholder.com/150" // Replace with your image URL
            alt="Abhishek Singh"
          />
        </Box>

        <Heading as="h1" size="2xl">Abhishek Singh</Heading>
        <Text fontSize="xl">
          Hi, I am a full-match developer and a scholar. Our mission is to provide quality content at a reasonable price.
        </Text>

        <Box>
          <Heading as="h2" size="lg">Co-founder</Heading>
          <Text>
            We are a video streaming platform with news premium sources available only for personal users.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg">CourseBundler</Heading>
          <Text>A Platform To Watch Quality Courses</Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default AboutPage;