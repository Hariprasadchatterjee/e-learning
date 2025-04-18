import { Box, Text, Button, Avatar, Input } from '@chakra-ui/react';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from 'react';

import { toast } from 'react-toastify';
import { Spinner } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/components/store/store';
import { updateProfilePicture } from '@/components/store/slice/userSlice';

const fileUploadStyle = {
  "&::file-selector-button": {
    cursor: "pointer",
    marginLeft: "-5%",
    width: "110%",
    border: "none",
    height: "100%",
    color: "#ECC94B",
    backgroundColor: "white",
  },
};

const ChangeAvatar = () => {
  const [imagePrev, setImagePrev] = useState<string | "">("");
  const [selectedFile, setSelectedFile] = useState<File | "">("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  const changeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImagePrev(reader.result);
      }
    };
  };

  const handleImageUpdate = async () => {
    if (!selectedFile) {
      toast("error while selecting file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    const result = await dispatch(updateProfilePicture({ formData }));
    
    if (updateProfilePicture.fulfilled.match(result)) {
      setLoading(false);
      setIsOpen(false); // Close the dialog
      toast("Profile picture updated successfully");
    }
  };

  return (
    <DialogRoot open={isOpen} >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>Change Photo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Avatar</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box my={4} display={"flex"} justifyContent={"center"}>
            <Avatar.Root size={"2xl"}>
              <Avatar.Fallback />
              <Avatar.Image src={imagePrev} />
            </Avatar.Root>
          </Box>

          <Box>
            <Text fontWeight="bold">Avatar</Text>
            <Input
              accept="image/*"
              required
              name="file"
              placeholder="...."
              type={'file'}
              css={fileUploadStyle}
              onChange={changeImageHandler}
            />
          </Box>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          </DialogActionTrigger>
          <Button onClick={handleImageUpdate} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Save"}
          </Button>
       
          
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default ChangeAvatar;
