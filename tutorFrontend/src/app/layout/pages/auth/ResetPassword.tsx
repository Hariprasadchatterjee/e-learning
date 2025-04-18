
import { Box, Button, Heading, Input, VStack, Field } from '@chakra-ui/react';
import { useState } from 'react';



const ResetPassword = () => {
  const [newpassword, setNewpassword] = useState("");
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <VStack spaceY={4} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Heading as="h1" size="lg">RESET PASSWORD</Heading>
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Input
            type="email"
            placeholder="me@example.com"
            value={newpassword}
            onChange={(e) => setNewpassword(e.target.value)}
          />
        </Field.Root>
        <Button colorScheme="teal" width="full">Submit</Button>
      </VStack>
    </Box>
  );
}

export default ResetPassword;