
import {  Button, Field, Input, Textarea, VStack, HStack, Heading } from '@chakra-ui/react';
import { useState } from 'react';



const Request:React.FC = () => {

  interface usercredentials {
      name: string,
      email: string,
      courses: string,
     
      
    }
    const [intVal, setIntVal] = useState<usercredentials>({
      name: "",
      email: "",
      courses: "",
   
     
    })
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.preventDefault()
      const { name, value } = e.target;
          setIntVal({ ...intVal, [name]: value })
    }

  return (
    <HStack spaceX={8} align="center" alignItems={"Center"} justifyContent={"center"} p={8} mt={20}>
      <VStack as="form" spaceY={4} w="full" maxW="md">
      <Heading children="Request New Course"/>
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
                   <Field.Label>Email address</Field.Label>
                   <Textarea
                     name="courses"
                     placeholder="Explain Courses You Want"
                     value={intVal.courses}
                     onChange={handleChange}
                   />
                 </Field.Root>

        <Button type="submit" colorScheme="blue" w="full">
          Send Email
        </Button>
      </VStack>
    </HStack>
  );
};

export default Request;