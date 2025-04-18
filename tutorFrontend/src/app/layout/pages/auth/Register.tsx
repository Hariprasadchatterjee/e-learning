import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/components/store/store";
import { fetchRegister } from "@/components/store/slice/userSlice";
import styled, { useTheme } from "styled-components";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";

// Styled Components
const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
  background-image: url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  transition: all 0.3s ease;
`;

const RegisterCard = styled.div`
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.cardBackground};
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  text-align: center;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AvatarPreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.inputBackground};
  border: 2px solid ${({ theme }) => theme.primary};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.primary}10;
  color: ${({ theme }) => theme.primary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.875rem;

  &:hover {
    background-color: ${({ theme }) => theme.primary}20;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
    transform: none;
  }
`;

const TextLink = styled(NavLink)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    text-decoration: underline;
  }
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  interface UserCredentials {
    name: string;
    email: string;
    password: string;
    file: File | null;
  }

  const [intVal, setIntVal] = useState<UserCredentials>({
    name: "",
    email: "",
    password: "",
    file: null,
  });

  const [imagePrev, setImagePrev] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

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
      setIntVal({ ...intVal, file });
    } else {
      setIntVal({ ...intVal, [name]: value });
    }
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!intVal.name || !intVal.email || !intVal.password) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', intVal.name);
      formData.append('email', intVal.email);
      formData.append('password', intVal.password);
      if (intVal.file) {
        formData.append('file', intVal.file);
      }

      const result = await dispatch(fetchRegister({ formData }));
      
      if (fetchRegister.fulfilled.match(result)) {
        setIntVal({
          name: "",
          email: "",
          password: "",
          file: null,
        });
        setImagePrev("");
        navigate("/profile");
      } else {
        setError(result.error.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>Create Your Account</Title>
        
        <AvatarContainer>
          <AvatarPreview>
            {imagePrev ? (
              <AvatarImage src={imagePrev} alt="Profile preview" />
            ) : (
              <AvatarPlaceholder>
                <FaUser size={40} />
              </AvatarPlaceholder>
            )}
          </AvatarPreview>
          <FileInputLabel>
            <FaUpload style={{ marginRight: "0.5rem" }} />
            Upload Avatar
            <FileInput 
              type="file" 
              accept="image/*"
              name="file"
              onChange={handleChange}
            />
          </FileInputLabel>
        </AvatarContainer>

        <form onSubmit={handleRegister}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <InputWrapper>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <InputField
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={intVal.name}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              <InputField
                id="email"
                name="email"
                type="email"
                placeholder="me@example.com"
                value={intVal.email}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <InputField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={intVal.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <PasswordToggle 
                type="button" 
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Register"}
          </SubmitButton>
        </form>

        <FooterText>
          Already have an account?{" "}
          <NavLink to="/login">Sign In</NavLink>
        </FooterText>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;