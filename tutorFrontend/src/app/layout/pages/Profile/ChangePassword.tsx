import React, { useState } from 'react';
import { Box, Button, Input, VStack, Field } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/components/store/store';
import { updatePassword } from '@/components/store/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const ChangePassword: React.FC =  () => {
  const [oldpassword, setOldPassword] = useState<string | "">('');
  const [newpassword, setNewPassword] = useState<string | "">('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error,message } = useSelector((state: RootState) => state.auth);
  

  const handleChangePassword = async () => {
    // Handle password change logic here
    console.log('Old Password:', oldpassword);
    console.log('New Password:', newpassword);
    const result = await dispatch(updatePassword({ oldpassword, newpassword }));
      if (updatePassword.fulfilled.match(result)) {
        console.log(result.payload);
        toast(message);
        setNewPassword('');
        setOldPassword('');
        navigate('/profile');
      }
      else{
        toast(error);
      }
  };

  return (
    <Box p={4} mt={20} mb={10} maxWidth="400px" mx="auto">
      <VStack gap={4}>
                  <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Input
                      placeholder="Old password"
                      type="password"
                      value={oldpassword}
                      onChange={(e)=>setOldPassword(e.target.value)}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Input
                      placeholder="New password"
                      type="password"
                      value={newpassword}
                      onChange={(e)=>setNewPassword(e.target.value)}
                    />
                  </Field.Root>
        <Button colorScheme="blue" onClick={handleChangePassword}>
          Change Password
        </Button>
      </VStack>
    </Box>
  );
};

export default ChangePassword;