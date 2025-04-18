import React from 'react';
import { Box, Image, Badge, Text, Button, HStack, Avatar } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';



interface CrsInter {
  id: string;
  title: string;
  description: string;
  poster: string;
  numberOfViews: number;
  creator: string;
  avatar:string;
  isLectureCount: number;
  addToPlayListHandler: (id: string) => void;
  watchNowHandler: () => void;
  currentId?: string; // Optional prop for current ID
}

const Course: React.FC<CrsInter> = ({
  id,
  title,
  description,
  poster,
  numberOfViews,
  creator,
  avatar,
  isLectureCount,
  addToPlayListHandler,
  watchNowHandler,
  currentId
}) => {

  

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s ease-in-out"
      _hover={{ transform: 'scale(0.98)', opacity: 0.9 }}
    >
      <Image
        src={poster}
        alt={title}
        transition="all 0.3s ease-in-out"
        _hover={{ transform: 'scale(1.05)' }}
      />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            New
          </Badge>
          
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {isLectureCount} Lectures &bull; {numberOfViews} Views
          </Box>
        </Box>

        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
          {title}
        </Box>

        <Box>
          <Text mt="2" color="gray.600" fontSize="sm">
            {description}
          </Text>
        </Box>

        <Box display="flex" mt="2" alignItems="center" gap={2}>
         
                      <Avatar.Root size={"2xl"}>
                        <Avatar.Fallback  />
                        <Avatar.Image  src={avatar } />
                      </Avatar.Root>
                      {/* <Avatar src={intVal.avtar} size={"2xl"}/> */}
                 
          <Text fontWeight="bold" mr="2">
            {creator}
          </Text>
        </Box>

        <HStack gap={4} mt="4">
          <Button colorScheme="teal" size="sm" onClick={()=>addToPlayListHandler(id)}>
           {currentId===id ? "Adding..." : "Add to Playlist"} 
          </Button>
          <Button colorScheme="teal" size="sm" onClick={watchNowHandler}>
            <NavLink to={`/courses/${id}`}>
            Watch Now
            </NavLink>
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default Course;