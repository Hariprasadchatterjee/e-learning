// import AdLayout from "./AdminLayout/AdLayout";
import React, { useState } from 'react';
import styled from 'styled-components';
import Slider from './Slider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/components/store/store';
import { createCourse } from '@/components/store/slice/courseSlice';
import { toast } from 'react-toastify';

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

const CreateCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {  error, message, loading } = useSelector(
    (state: RootState) => state.course
  );
  // State to manage form values
  const [formValues, setFormValues] = useState<{
    title: string;
    description: string;
    category: string;
    file: File | null;
  }>({
    title: '',
    description: '',
    category: '',
    file: null,
  });
  const [imagePrev, setImagePrev] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    const files = (e.target as HTMLInputElement).files;

    if (e.target.type === 'file') {
      if (!files || files.length === 0) return;
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePrev(reader.result);
        }
      };
      setFormValues({ ...formValues, file });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };


  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   
    const formdata = new FormData();
    formdata.append("title", formValues.title);
    formdata.append("description", formValues.description);
    formdata.append("category", formValues.category);
    if (formValues.file) {
      formdata.append("file", formValues.file);
    }

    // Handle course creation logic here
    const result = await dispatch(createCourse({ formdata }));
    if(createCourse.fulfilled.match(result)){
      toast.success(message);
      setFormValues({
        title: '',
        description: '',
        category: '',
        file:  null,
      });
      setImagePrev("");

    }else{
      toast.error(error);
    }
  };

  return (
    <Slider>
      <Container>
        <h1>Create Course</h1>
        <Form onSubmit={handleCreateCourse}>
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            placeholder="Enter course title"
          />

          <Label>Description</Label>
          <Textarea
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            placeholder="Enter course description"
          />


          <Label>Course Category</Label>
          <Select
            name="category"
            value={formValues.category}
            onChange={handleInputChange}
          >
            <option value="">Select category</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
          </Select>

          <Label>Choose File</Label>
          <Input
            type="file"
            name='file'
            accept="image/*"
            onChange={handleInputChange}
            css={fileUploadStyle}
          />

          {formValues.file && <ImagePreview src={imagePrev} alt="Course" />}

          <CreateButton  type="submit">{loading ? "Creating..." : "Create"}</CreateButton>
        </Form>
      </Container>
    </Slider>
  );
};


const Container = styled.div`
  padding: 20px;
  max-width: 700px;
  margin: 20px auto;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  h1 {
    font-size: 24px;
    font-weight: 500;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  min-height: 100px;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Select = styled.select`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  appearance: none; /* Remove default arrow */
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg fill="%23343a40" viewBox="0 0 4 5"><path d="M2 0L0 2h4L2 0z"/></svg>');
  background-repeat: no-repeat;
  background-position-x: 95%;
  background-position-y: 50%;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const ImagePreview = styled.img`
  margin-top: 15px;
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CreateButton = styled.button`
  padding: 14px 24px;
  margin-top: 25px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default CreateCourse;