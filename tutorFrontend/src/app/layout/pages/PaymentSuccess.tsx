
import { Box, Heading, Text, VStack, Button, Container, List } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { NavLink, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const search = useSearchParams()[0];
  const paymentId = search.get('reference');
  console.log("paymentId", paymentId);
  
  return (
    <Container maxW="container.md" py={10}>
      <VStack spaceY={6} align="center">
        {/* Success Message Section */}
        <Heading as="h1" size="2xl" textAlign="center">
          You have Pro Pack
        </Heading>

        {/* Payment Success Section */}
        <Box textAlign="center" p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
          <Heading as="h2" size="lg" mb={4}>
            Payment Success
          </Heading>
          <List.Root spaceY={3} textAlign="left">
            <List.Item display="flex" alignItems="center">
              <Box as={FaCheckCircle} color="green.500" mr={2} />
              Congratulation you're a pro member. You have access to premium content.
            </List.Item>
          </List.Root>
        </Box>

        {/* Go to Profile Button */}
        <Button colorScheme="teal" size="lg">
         <NavLink to="/profile">Go to Profile</NavLink> 
        </Button>

        {/* Reference Section */}
        <Text fontSize="sm" color="gray.600" mt={4}>
         { paymentId && `Payment Reference ID: ${paymentId}`}
        </Text>
      </VStack>
    </Container>
  );
};

export default PaymentSuccess;