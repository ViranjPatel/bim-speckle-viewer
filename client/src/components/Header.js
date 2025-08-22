import React from 'react';
import styled from 'styled-components';
import { Menu, Upload, Home, Folder, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useViewerStore } from '../store/viewerStore';

const HeaderContainer = styled.header`
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #2d2d2d;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: white;
    background: #374151;
  }
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavButton = styled.button`
  background: ${props => props.active ? '#3b82f6' : 'none'};
  border: none;
  color: ${props => props.active ? 'white' : '#9ca3af'};
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    color: white;
    background: ${props => props.active ? '#2563eb' : '#374151'};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${props => props.connected ? '#065f46' : '#7f1d1d'};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.connected ? '#10b981' : '#ef4444'};
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar, viewer, isLoading } = useViewerStore();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Viewer' },
    { path: '/models', icon: Folder, label: 'Models' },
    { path: '/upload', icon: Upload, label: 'Upload' },
  ];
  
  const isConnected = !!viewer && !isLoading;
  
  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={toggleSidebar}>
          <Menu size={20} />
        </MenuButton>
        <Logo>BIM Viewer</Logo>
      </LeftSection>
      
      <NavSection>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path === '/' && location.pathname === '/viewer');
          
          return (
            <NavButton
              key={item.path}
              active={isActive}
              onClick={() => navigate(item.path)}
            >
              <Icon size={16} />
              {item.label}
            </NavButton>
          );
        })}
      </NavSection>
      
      <RightSection>
        <StatusIndicator connected={isConnected}>
          <StatusDot connected={isConnected} />
          {isLoading ? 'Loading...' : isConnected ? 'Connected' : 'Disconnected'}
        </StatusIndicator>
      </RightSection>
    </HeaderContainer>
  );
}

export default Header;