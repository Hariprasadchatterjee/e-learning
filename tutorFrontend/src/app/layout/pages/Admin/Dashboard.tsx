
import { Box, HStack, Text, VStack, Heading, Flex, Stack } from "@chakra-ui/react"
// import AdLayout from "./AdminLayout/AdLayout"
import Slider from './Slider';
import { FaUsers, FaChartLine } from 'react-icons/fa'; // Importing icons from react-icons
import { RiArrowDownLine, RiArrowUpLine } from "react-icons/ri";
import { GrView } from "react-icons/gr";
import { MdSubscriptions } from "react-icons/md";
import { IconType } from 'react-icons';
import styled, { keyframes } from "styled-components";
import { DoughnutChart, LineChart} from "./chart/Chart"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { useEffect } from "react";
import { dashboardStatus } from "@/components/store/slice/adminSlice";
import { format } from "date-fns";

interface DashAnalysis {
  title: string;
  qty?: number;
  qtyPercentage?: number;
  profit: boolean;
  icon?: IconType;
  value?: number;
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonBox = styled.div`
  background: #e0e0e0;
  background-image: linear-gradient(
    90deg,
    #e0e0e0 25%,
    #f0f0f0 50%,
    #e0e0e0 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const SkeletonHeading = styled(SkeletonBox)`
  height: 40px;
  width: 200px;
  margin: 0 auto;
`;

const SkeletonCard = styled(SkeletonBox)`
  height: 200px;
  width: 100%;
`;

const SkeletonChart = styled(SkeletonBox)`
  height: 400px;
  width: 100%;
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;


const ProgressContainer = styled.div`
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-bottom: 15px;
  position: relative;
  height: 20px;
  width: 100%;
`;

const ProgressBarFill = styled.div<{ value: number; profit: boolean }>`
  height: 100%;
  border-radius: 5px;
  width: ${props => Math.min(100, Math.abs(props.value))}%;
  background-color: ${props => props.profit ? "#4CAF50" : "#F44336"};
  position: relative;
  transition: width 0.5s ease;
`;

const ProgressLabel = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #333;
`;

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardStats, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(dashboardStatus());
  }, [dispatch]);

  // Destructure with proper fallbacks
  const {
    usersCount = 0,
    viewsCount = 0,
    subscriptionCount = 0,
    userPercentage = 0,
    viewsPercentage = 0,
    subscriptionPercentage = 0,
    userProfit = true,
    viewsProfit = true,
    subscriptionProfit = true,
    perYearRecord = []
  } = dashboardStats || {};

  const subscribedCount = subscriptionCount;
  const notSubscribedCount = Math.max(0, usersCount - subscribedCount);

  const lastUpdated = new Date();

  if (loading) {
    return (
      <Slider>
        <SkeletonContainer>
          <SkeletonHeading />
          <Stack direction={{ base: "column", md: "row" }} width="100%" gap={4}>
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </Stack>
          <SkeletonChart />
        </SkeletonContainer>
      </Slider>
    );
  }

  return (
    <Slider>
      <Text fontSize="2xl" fontWeight="bold">Dashboard</Text>
      <Box>
        <Text
          textAlign="center"
          opacity={0.7}
          fontSize="sm"
        >
          Last updated: {format(lastUpdated, "PPpp")}
        </Text>
      </Box>
      
      <VStack spaceY={6} mt={8}>
        <Stack w="100%" direction={{ base: "column", md: "row" }} spaceX={4}>
          <DataBox 
            icon={FaUsers} 
            title="Users" 
            qty={usersCount} 
            qtyPercentage={userPercentage} 
            profit={userProfit} 
          />
          <DataBox 
            icon={GrView} 
            title="Views" 
            qty={viewsCount} 
            qtyPercentage={viewsPercentage} 
            profit={viewsProfit} 
          />
          <DataBox 
            icon={MdSubscriptions} 
            title="Subscription" 
            qty={subscriptionCount} 
            qtyPercentage={subscriptionPercentage} 
            profit={subscriptionProfit} 
          />
        </Stack>

        <Box
          bg="white"
          width="100%"
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          boxShadow="md"
          _hover={{ boxShadow: "lg" }}
          transition="all 0.2s"
        >
          <LineChart perYearRecord={perYearRecord} />
        </Box>

        <Stack 
          direction={{ base: "column", md: "row" }} 
          width="100%" 
          gap={6}
          mt={6}
        >
          <Box width={{ base: "100%", md: "50%" }}>
            <VStack scaleX={5} width="100%">
              <ProgressBar title="Users" value={userPercentage} profit={userProfit} />
              <ProgressBar title="Views" value={viewsPercentage} profit={viewsProfit} />
              <ProgressBar title="Subscription" value={subscriptionPercentage} profit={subscriptionProfit} />
            </VStack>
          </Box>
          
          <Box width={{ base: "100%", md: "50%" }}>
            <Text fontSize="lg" fontWeight="semibold" mb={4} textAlign="center">
              Subscription Distribution
            </Text>
            <DoughnutChart 
              subscribedCount={subscribedCount} 
              notSubscribedCount={notSubscribedCount} 
            />
          </Box>
        </Stack>
      </VStack>
    </Slider>
  );
};

const ProgressBar: React.FC<DashAnalysis> = ({ title, value = 0, profit }) => {
  const displayValue = Math.min(100, Math.abs(value));
  
  return (
    <Box width="100%">
      <Text fontSize="sm" mb={1}>
        {title} ({value > 0 ? '+' : ''}{value.toFixed(1)}%)
      </Text>
      <ProgressContainer>
        <ProgressBarFill value={displayValue} profit={profit}>
          <ProgressLabel style={{ left: '8px' }}>
            {profit ? '↑' : '↓'} {displayValue}%
          </ProgressLabel>
        </ProgressBarFill>
      </ProgressContainer>
    </Box>
  );
};
// background-color: #3EECAC;
// background-image: linear-gradient(19deg, #3EECAC 0%, #EE74E1 100%);

// background-color: #FA8BFF;
// background-image: linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%);



const DataBox: React.FC<DashAnalysis> = ({ title, qty = 0, qtyPercentage = 0, profit, icon: Icon }) => {
  return (
    <Box
      css={{ backdropFilter: "blur(10px)" , backgroundColor: "FA8BFF" , backgroundImage: "linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)", color: "#df04eb" ,boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)" }}
      width="100%"
      borderWidth="1px"
      borderRadius="lg"
      p={5}
      boxShadow="md"
      _hover={{ boxShadow: "lg" }}
      transition="all 0.2s"
    >
      <Flex align="center" justify="space-between" mb={4}>
        <Heading size="md" fontWeight="semibold">
          {title} Analytics
        </Heading>
        {Icon && <Icon size={24} color="#4A5568" />}
      </Flex>

      <Stack gap={3}>
        <Text fontSize="md" color="gray.600">
          Total {title}
        </Text>
        <Heading size="xl" fontWeight="bold">
          {qty.toLocaleString()}
        </Heading>
       
        <HStack>
          <Text fontSize="sm" color="gray.500">
            {`${Math.abs(qtyPercentage)}% ${profit ? 'increase' : 'decrease'}`}
          </Text>
          {profit ? (
            <RiArrowUpLine color="green" size={18} />
          ) : (
            <RiArrowDownLine color="red" size={18} />
          )}
        </HStack>
      </Stack>

      <Flex align="center" justify="space-between" mt={4}>
        <Text fontSize="xs" color="gray.500">
          Updated recently
        </Text>
        <FaChartLine color="#4A5568" size={16} />
      </Flex>
    </Box>
  );
};

export default Dashboard;