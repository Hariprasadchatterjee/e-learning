import { RiMenu5Fill } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ColorModeButton } from "@/components/ui/color-mode";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/components/store/store";
import { fetchLogout } from "@/components/store/slice/userSlice";

// Styled Components
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.headerBg};
  color: ${({ theme }) => theme.headerText};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(NavLink)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.headerText};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const NavButton = styled(NavLink)`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  color: ${({ theme }) => theme.headerText};
  transition: all 0.2s ease;
  margin: 0 0.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }

  &.active {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ theme }) => theme.headerText};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 0.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const MobileMenuButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  height: 50px;
  width: 50px;
  font-size: 1.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background-color: ${({ theme }) => theme.drawerBg};
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  padding: 2rem;
  transform: translateX(${({ isOpen }) => (isOpen ? "0" : "100%")});
  transition: transform 0.3s ease;
  background-color: #004cbad9;
`;

const DrawerBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const DrawerTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const DrawerCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DrawerFooter = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  padding: 0 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

interface LoginDtl {
  isLogedIn: boolean | null;
  userRole: string;
}

const Header: React.FC<LoginDtl> = ({ isLogedIn, userRole }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleLogout = async () => {
    const result = await dispatch(fetchLogout());
    if (fetchLogout.fulfilled.match(result)) {
      navigate("/login");
      setIsDrawerOpen(false);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <HeaderWrapper>
     {userRole !== "admin" ?  <Logo to="/">Course Bundler</Logo> : "" }
      
      <div  style={{ marginLeft: userRole === "admin" ? "80%" : "", display: "flex", alignItems: "center", gap: "1rem" }}>
        <ColorModeButton />
        
        {/* Desktop Navigation (hidden on mobile) */}
        <div style={{ display: "none", "@media (min-width: 768px)": { display: "flex" } }}>
          <NavButton to="/">Home</NavButton>
          <NavButton to="/courses">All Courses</NavButton>
          <NavButton to="/request">Request Course</NavButton>
          <NavButton to="/contact">Contact Us</NavButton>
          
          {isLogedIn ? (
            <>
              <NavButton to="/profile">Profile</NavButton>
              <Button onClick={handleLogout}>Logout</Button>
              {userRole === "admin" && <NavButton to="/admin/dashboard">Dashboard</NavButton>}
            </>
          ) : (
            <>
              <NavButton to="/login">Login</NavButton>
              <NavButton to="/register">Register</NavButton>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <MobileMenuButton onClick={toggleDrawer} aria-label="Open menu">
          <RiMenu5Fill />
        </MobileMenuButton>
      </div>

      {/* Mobile Drawer */}
      <DrawerBackdrop isOpen={isDrawerOpen} onClick={closeDrawer} />
      <DrawerContainer isOpen={isDrawerOpen}>
        <DrawerHeader>
          <DrawerTitle>Course Bundler</DrawerTitle>
          <DrawerCloseButton onClick={closeDrawer} aria-label="Close menu">
            &times;
          </DrawerCloseButton>
        </DrawerHeader>
        
        <DrawerContent>
          <NavButton to="/" onClick={closeDrawer}>Home</NavButton>
          <NavButton to="/courses" onClick={closeDrawer}>All Courses</NavButton>
          <NavButton to="/request" onClick={closeDrawer}>Request Course</NavButton>
          <NavButton to="/contact" onClick={closeDrawer}>Contact Us</NavButton>
        </DrawerContent>

        <DrawerFooter>
          {isLogedIn ? (
            <ButtonGroup>
              <NavButton to="/profile" onClick={closeDrawer}>Profile</NavButton>
              <Button onClick={handleLogout}>Logout</Button>
              {userRole === "admin" && (
                <NavButton to="/admin/dashboard" onClick={closeDrawer}>Dashboard</NavButton>
              )}
            </ButtonGroup>
          ) : (
            <ButtonGroup>
              <NavButton to="/login" onClick={closeDrawer}>Login</NavButton>
              <NavButton to="/register" onClick={closeDrawer}>Register</NavButton>
            </ButtonGroup>
          )}
        </DrawerFooter>
      </DrawerContainer>
    </HeaderWrapper>
  );
};

export default Header;