import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchCourseLectured } from "../../../../components/store/slice/courseSlice";
import { useDispatch, useSelector } from "react-redux";

const CourseModel = ({ isOpen, onClose, id, deleteButtonHandler, addLectureHandler }) => {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.course);
  
  // Find the current course by id
  const currentCourse = courses.find((course) => course._id === id);
  
  // Get lectures from the current course or empty array if not found
  const lectures = currentCourse?.lectures || [];
  
  const [intVal, setIntVal] = useState({
    title: "",
    description: "",
    file: null
  });



  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (e.target.type === 'file') {
      if (!files || files.length === 0) return;
      const file = files[0];

      setIntVal({ ...intVal, file });
    } else {
      setIntVal({ ...intVal, [name]: value });
    }
  };


  const handleAddCourseLecture = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", intVal.title);
    formData.append("description", intVal.description);
    formData.append("file", intVal.file);
   


    addLectureHandler(formData,id); // Pass the course id along with form data
    setIntVal({ title: "", description: "", video: null });
  };

  const handleClose = () => {
    onClose();
    setIntVal({ title: "", description: "", video: null });
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <ModalContent>
          {/* Left Section: Course Details */}
          <LeftSection className="courseitems">
            <h2>Course Details</h2>
            <p>Lectures for {currentCourse?.title}</p>
            {lectures.length > 0 ? (
              lectures.map((lecture, index) => (
                <CourseItem key={lecture._id || index}>
                  <p>
                    <strong>Lecture No:</strong> #{index + 1}
                  </p>
                  <p>
                    <strong>Title:</strong> {lecture.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {lecture.description}
                  </p>
                  {lecture.video && (
                    <video width="320" height="240" controls>
                      <source src={lecture.video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <RemoveButton onClick={() => deleteButtonHandler( id, lecture._id)}>
                    Remove
                  </RemoveButton>
                </CourseItem>
              ))
            ) : (
              <p>No lectures available for this course.</p>
            )}
          </LeftSection>

          {/* Right Section: Add Course Form */}
          <RightSection>
            <h2>Add New Lecture</h2>
            <Form onSubmit={handleAddCourseLecture}>
              <FormGroup>
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={intVal.title}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={intVal.description}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Video:</label>
                <input
                  accept="video/mp4"
                  type="file"
                  name="file"
                  onChange={handleInputChange}
                  required
                />
                {intVal.file && (
                  <video  width="320" height="240" controls>
                    <source src={intVal.file} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </FormGroup>

              <SubmitButton type="submit">Add Lecture</SubmitButton>
            </Form>
          </RightSection>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CourseModel;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
 
`;

const ModalContainer = styled.div`
scroll-behavior: unset;
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  height: auto;
 
  position: relative;
  overflow-y: auto;
 
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const ModalContent = styled.div`
  display: flex;
  gap: 20px;
`;

const LeftSection = styled.div`
  flex: 1;
  border-right: 1px solid #ccc;
  padding-right: 20px;
  height: auto;
`;

const RightSection = styled.div`
  flex: 1;
`;

const CourseItem = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const RemoveButton = styled.button`
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SubmitButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
`