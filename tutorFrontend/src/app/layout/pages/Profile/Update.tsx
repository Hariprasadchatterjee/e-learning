import { updateProfile } from '@/components/store/slice/userSlice';
import { AppDispatch } from '@/components/store/store';
import { Box, Button, Input, VStack, Field } from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const UpdateProfile =  () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
    const handleChangePassword = async () => {
      // Handle password change logic here
      console.log('Old Password:', name);
      console.log('New Password:', email);
      const result =  await dispatch(updateProfile({name, email}));
      setLoading(true);
      if (updateProfile.fulfilled.match(result)) {
       toast("Profile updated successfully");
        navigate("/profile");
        setLoading(false);
      }
      else{
        toast("error while updating profile");
        setLoading(false);
      }
    };
  
    return (
      <Box p={4} mt={20} mb={10} maxWidth="400px" mx="auto">
        <VStack gap={4}>
                    <Field.Root>
                      <Field.Label>Name</Field.Label>
                      <Input
                        placeholder="enter name"
                        type="text"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>email</Field.Label>
                      <Input
                        placeholder="enter email"
                        type="text"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                      />
                    </Field.Root>
          <Button colorScheme="blue" onClick={handleChangePassword}>
         {loading? "...Loading" : "Update Profile"}
          </Button>
        </VStack>
      </Box>
    );
}

export default UpdateProfile