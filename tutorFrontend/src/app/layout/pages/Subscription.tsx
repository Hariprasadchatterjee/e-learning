
import { fetchSubscriptionId } from '@/components/store/slice/paymentSlice';

// Declare Razorpay on the global window object

import { AppDispatch, RootState } from '@/components/store/store';
import { Box, Heading, Text, VStack, Button, Container } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';



const Subscription = () => {

  const [key, setKey] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>()
  const {subscriptionId, loading, error} =  useSelector((state: RootState) => state.subscription)
  const {user} =  useSelector((state: RootState) => state.auth)
  // Function to handle subscription purchase
  const handleSubscribe = async () => {
    // Logic to handle subscription purchase
    const {data:{ api_key }} = await axios.get(`http://localhost:3000/api/payment/getrazorpaykey`);
    console.log("api_key",api_key);
    setKey(api_key);
    dispatch(fetchSubscriptionId())
    
  }

  useEffect( ()=>{
    if (error) {
      toast(error)
    }
    if (subscriptionId) {
      const openPopup=()=>{

        const options={
          key,
          name: "Acme Corp", //your business name
          description: "Test Transaction",
          image: user?.avatar,
          subscription_id:subscriptionId,
          callback_url:`http://localhost:3000/api/payment/paymentverification`,
          prefill:{
            name:user?.name,
            email:user?.email,
            contact:"",
          },
          notes:{
           address: "Razorpay Corporate Office"
          },
          theme: {
          color: "#cf6223"
          }
        };

        const razor = new window.Razorpay(options)
        razor.open()
      };
      openPopup()
    }
  },[dispatch,error,user?.name,user?.email,key,subscriptionId])
  return (
    <Container maxW="container.md" py={10}>
      <VStack spaceY={6} align="center">
        {/* Welcome Section */}
        <Heading as="h1" size="2xl" textAlign="center">
          Welcome
        </Heading>

        {/* Pro Pack Section */}
        <Box textAlign="center" p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
          <Heading as="h2" size="lg" mb={4}>
            Pro Pack - $299.00
          </Heading>
          <Text fontSize="lg" mb={4}>
            Join pro pack and get access to all content.
          </Text>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            $299 Only
          </Text>
          <Button colorScheme="teal" size="lg" onClick={handleSubscribe}>
           {loading? "...loading":"Buy Now"} 
          </Button>
        </Box>

        {/* Cancellation Policy Section */}
        <Box textAlign="center" mt={6}>
          <Text fontSize="md" color="gray.600">
            HOW, BEHIND AT CANCELLATION
          </Text>
          <Text fontSize="md" color="gray.600">
            Learn to Customer Way
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Subscription;