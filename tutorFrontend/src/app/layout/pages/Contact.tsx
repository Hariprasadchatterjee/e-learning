import { Box, Button, Field, Input, Textarea, VStack, Stack,  } from '@chakra-ui/react';
import { useState } from 'react';

const Contact: React.FC = () => {
  interface usercredentials {
    name: string;
    email: string;
    message: string;
  }

  const [intVal, setIntVal] = useState<usercredentials>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setIntVal({ ...intVal, [name]: value });
  };

  return (
    <Stack direction={{ base: "column", md: "row" }} gap="10"align="center" justifyContent="center" p={8} mt={20}>
      <VStack as="form" spaceY={4} w="full" maxW="md">
        <Field.Root>
          <Field.Label>User Name</Field.Label>
          <Input
            name="name"
            type="text"
            placeholder="Enter Name"
            value={intVal.name}
            onChange={handleChange}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Input
            name="email"
            type="email"
            placeholder="me@example.com"
            value={intVal.email}
            onChange={handleChange}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Message</Field.Label>
          <Textarea
            name="message"
            placeholder="Enter your message"
            value={intVal.message}
            onChange={handleChange}
          />
        </Field.Root>

        <Button type="submit" colorScheme="blue" w="full">
          Send Email
        </Button>
      </VStack>
      <Box w="full" maxW="md" h="400px">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019112484634!2d144.9630579153168!3d-37.81410797975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d9b8f7b0b1b!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1633079871234!5m2!1sen!2sau"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </Box>
    </Stack>
  );
};

export default Contact;
