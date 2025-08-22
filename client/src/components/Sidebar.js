import React from 'react';
import styled from 'styled-components';
import { X, Layers, Eye, EyeOff, Settings, Info } from 'lucide-react';
import { useViewerStore } from '../store/viewerStore';
import ViewerControls from './ViewerControls';
import ModelProperties from './ModelProperties';

const SidebarContainer = styled.div`
  width: ${props => props.open ? '320px' : '0'};
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid #2d2d2d;
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 200;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #2d2d2d;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    background: #374151;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #2d2d2d;
  margin-bottom: 16px;
`;

const Tab = styled.button`
  flex: 1;
  background: none;
  border: none;
  color: ${props => props.active ? '#3b82f6' : '#9ca3af'};
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    color: ${props => props.active ? '#3b82f6' : 'white'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  
  .icon {
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .description {
    font-size: 14px;
    line-height: 1.5;
  }
`;

function Sidebar() {
  const { sidebarOpen, toggleSidebar, activePanel, setActivePanel, currentModel } = useViewerStore();
  
  const tabs = [
    { id: 'controls', icon: Settings, label: 'Controls' },
    { id: 'properties', icon: Info, label: 'Properties' },
    { id: 'layers', icon: Layers, label: 'Layers' },
  ];
  
  const activeTab = activePanel || 'controls';
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'controls':
        return <ViewerControls />;
      case 'properties':
        return currentModel ? <ModelProperties /> : (
          <EmptyState>
            <div className="icon">
              <Info size={48} />
            </div>
            <div className="title">No Model Selected</div>
            <div className="description">
              Load a Speckle model or upload a file to view properties
            </div>
          </EmptyState>
        );
      case 'layers':
        return currentModel ? (
          <div>
            <h4 style={{ marginBottom: '16px', color: 'white' }}>Model Layers</h4>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>
              Layer management coming soon...
            </div>
          </div>
        ) : (
          <EmptyState>
            <div className="icon">
              <Layers size={48} />
            </div>
            <div className="title">No Layers Available</div>
            <div className="description">
              Load a model to view and manage layers
            </div>
          </EmptyState>
        );
      default:
        return null;
    }
  };
  
  if (!sidebarOpen) {
    return <SidebarContainer open={false} />;
  }
  
  return (
    <SidebarContainer open={sidebarOpen}>
      <SidebarHeader>
        <SidebarTitle>Inspector</SidebarTitle>
        <CloseButton onClick={toggleSidebar}>
          <X size={16} />
        </CloseButton>
      </SidebarHeader>
      
      <TabContainer>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActivePanel(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </Tab>
          );
        })}
      </TabContainer>
      
      <SidebarContent>
        {renderTabContent()}
      </SidebarContent>
    </SidebarContainer>
  );
}

export default Sidebar;