import React, { useState } from 'react';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/components/store/store';
import ChangeAvatar from './ChangeAvatar';
import { fetchProfile, removeFromPlaylist } from '@/components/store/slice/userSlice';
import { cancelSubscription } from '@/components/store/slice/paymentSlice';
import { toast } from 'react-toastify';
import styled, { useTheme } from 'styled-components';
import { FaUser, FaEnvelope, FaCalendarAlt, FaLock } from 'react-icons/fa';

// Styled Components
const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ProfileCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ProfileHeader = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const AvatarImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.primary};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};
`;

const InfoIcon = styled.span`
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  min-width: 120px;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.textSecondary};
`;

const SubscriptionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.error};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.errorHover};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubscribeLink = styled(NavLink)`
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionButton = styled(NavLink)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
    transform: translateY(-1px);
  }
`;

const PlaylistHeader = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin: 2rem 0 1.5rem;
  text-align: center;
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const PlaylistCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const PlaylistImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const PlaylistActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

const WatchButton = styled(NavLink)`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: ${({ theme }) => theme.error};
  border: 1px solid ${({ theme }) => theme.error};
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.error}10;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { message } = useSelector((state: RootState) => state.subscription);
  const [loading2, setLoading2] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();


  if (!user) {
    return <LoadingMessage>Loading profile...</LoadingMessage>;
  }

  const handleRemoveFromPlaylist = async (id: string) => {
    setRemovingId(id);
    try {
      const result = await dispatch(removeFromPlaylist({ removeId: id }));
      if (removeFromPlaylist.fulfilled.match(result)) {
        dispatch(fetchProfile());
        toast.success("Removed from playlist");
      } else {
        toast.error("Failed to remove from playlist");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setRemovingId(null);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading2(true);
    try {
      const result = await dispatch(cancelSubscription());
      if (cancelSubscription.fulfilled.match(result)) {
        toast.success(result.payload.message || "Subscription cancelled successfully");
        dispatch(fetchProfile());
      } else if (cancelSubscription.rejected.match(result)) {
        toast.error(result.error.message || "Failed to cancel subscription");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading2(false);
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>PROFILE</ProfileHeader>
        
        <ProfileSection>
          <AvatarContainer>
            <AvatarImage 
              src={`${user?.avatar?.url}?${Date.now()}`} 
              alt={user?.name} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
              }}
            />
            <ChangeAvatar />
          </AvatarContainer>

          <InfoRow>
            <InfoIcon><FaUser /></InfoIcon>
            <InfoLabel>Name</InfoLabel>
            <InfoValue>{user?.name || "N/A"}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoIcon><FaEnvelope /></InfoIcon>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{user?.email || "N/A"}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoIcon><FaCalendarAlt /></InfoIcon>
            <InfoLabel>Joined On</InfoLabel>
            <InfoValue>{user?.createdAt?.split("T")[0] || "N/A"}</InfoValue>
          </InfoRow>

          {user?.role === "user" && (
            <InfoRow>
              <InfoIcon><FaLock /></InfoIcon>
              <InfoLabel>Subscription</InfoLabel>
              <InfoValue>
                {user?.subscription?.status === "active" ? (
                  <SubscriptionButton 
                    onClick={handleCancelSubscription}
                    disabled={loading2}
                  >
                    {loading2 ? "Processing..." : "Cancel Subscription"}
                  </SubscriptionButton>
                ) : (
                  <SubscribeLink to="/subscription">
                    Subscribe Now
                  </SubscribeLink>
                )}
              </InfoValue>
            </InfoRow>
          )}

          <div style={{ display: 'flex', marginTop: '1.5rem' }}>
            <ActionButton to="/updateProfile">Update Profile</ActionButton>
            <ActionButton to="/changePassword">Change Password</ActionButton>
          </div>
        </ProfileSection>
      </ProfileCard>

      {user?.playlist?.length > 0 && (
        <>
          <PlaylistHeader>Your Playlist</PlaylistHeader>
          <PlaylistGrid>
            {user?.playlist?.map((element) => (
              <PlaylistCard key={element._id}>
                <PlaylistImage 
                  src={element.poster} 
                  alt={element.title} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200';
                  }}
                />
                <PlaylistActions>
                  <WatchButton to={`/courses/${element.course}`}>
                    Watch Now
                  </WatchButton>
                  <DeleteButton
                    onClick={() => handleRemoveFromPlaylist(element.course)}
                    disabled={removingId === element.course}
                  >
                    <RiDeleteBin7Fill />
                    {removingId === element.course ? "Removing..." : "Remove"}
                  </DeleteButton>
                </PlaylistActions>
              </PlaylistCard>
            ))}
          </PlaylistGrid>
        </>
      )}
    </ProfileContainer>
  );
};

export default Profile;