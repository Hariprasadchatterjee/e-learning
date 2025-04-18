
import { Box, Button, Input, Field, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { NavLink } from "react-router-dom";


const ForgotPassword = () => {
  const [email,setEmail] = useState<string>("")

  return (
    <Box maxW="md" mx="auto" mt={20} mb={20} p={6} borderWidth={1} borderRadius="md" boxShadow="lg">
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Forgot Password
      </Heading>
       <Field.Root>
                  <Field.Label>Email address</Field.Label>
                  <Input
                    type="email"
                    placeholder="me@example.com"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                </Field.Root>
      <Button colorScheme="teal" size="md" width="full" mt={4}>
        <NavLink to="/resetPassword/:token">
        Reset Password
        </NavLink>
      </Button>
    </Box>
  );
};

export default ForgotPassword;