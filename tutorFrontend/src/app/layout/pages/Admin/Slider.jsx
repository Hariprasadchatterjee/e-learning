

import  { useState } from "react";
import styled from "styled-components";
import { FaBars, FaTimes, FaTh, FaPlus, FaBook, FaUsers } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Slider = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        {/* Logo Section */}
        <LogoContainer>
          <Logo src="\src\assets\images\front-view-young-beautiful-lady-white-t-shirt-black-jeans-coat-holding-green-book-pen-smiling-white.jpg" alt="LearnWhari Logo" />
          <LogoText isOpen={isOpen}>LearnWhari</LogoText>
        </LogoContainer>

        {/* Toggle Button */}
        <ToggleButton onClick={toggleSidebar}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </ToggleButton>

        {/* Menu Items */}
        <Menu>
          <MenuItem isOpen={isOpen}>
            <NavLink to="/admin/dashboard" activeClassName="active">
              <FaTh />
              <span>Dashboard</span>
            </NavLink>
          </MenuItem>
          <MenuItem isOpen={isOpen}>
            <NavLink to="/admin/create-course" activeClassName="active">
              <FaPlus />
              <span>Create Course</span>
            </NavLink>
          </MenuItem>
          <MenuItem isOpen={isOpen}>
            <NavLink to="/admin/courses" activeClassName="active">
              <FaBook />
              <span>Courses</span>
            </NavLink>
          </MenuItem>
          <MenuItem isOpen={isOpen}>
            <NavLink to="/admin/users" activeClassName="active">
              <FaUsers />
              <span>Users</span>
            </NavLink>
          </MenuItem>
        </Menu>
      </SidebarContainer>

      {/* Main Content */}
      <MainContent isOpen={isOpen}>
        {children}
      </MainContent>
      
    </>
  );
};

export default Slider;

// Styled Components
const SidebarContainer = styled.div`
  width: ${({ isOpen }) => (isOpen ? "250px" : "60px")};
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #34495e;
`;

const Logo = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const LogoText = styled.span`
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  display: ${({ isOpen }) => (isOpen ? "inline" : "none")};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 15px;
  width: 100%;
  text-align: left;
  &:hover {
    background-color: #34495e;
  }
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  a {
    display: flex;
    align-items: center;
    padding: 15px;
    color: white;
    text-decoration: none;
    &:hover {
      background-color: #34495e;
    }
    &.active {
      background-color: #1abc9c;
    }
    span {
      
      z-index: 999;
      color: gold;
      font-size: 1.2rem;
      font-weight: 500;
      margin-left: 10px;
      white-space: nowrap;
      display: ${({ isOpen }) => (isOpen ? "block" : "none")};
    }
  }
`;

const MainContent = styled.div`
  margin-left: ${({ isOpen }) => (isOpen ? "250px" : "60px")};
  padding: 20px;
  transition: margin-left 0.3s ease;
`;
