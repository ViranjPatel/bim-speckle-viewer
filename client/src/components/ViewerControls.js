import React from 'react';
import styled from 'styled-components';
import { Grid, Move, RotateCcw, ZoomIn, ZoomOut, Sun, Lightbulb } from 'lucide-react';
import { useViewerStore } from '../store/viewerStore';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ControlGroup = styled.div`
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  padding: 16px;
`;

const GroupTitle = styled.h4`
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ControlLabel = styled.label`
  color: #e5e7eb;
  font-size: 13px;
  font-weight: 500;
`;

const Toggle = styled.button`
  background: ${props => props.active ? '#3b82f6' : '#374151'};
  border: none;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${props => props.active ? '22px' : '2px'};
    transition: all 0.2s ease;
  }
`;

const Slider = styled.input`
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #374151;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    background: #2563eb;
    transform: scale(1.1);
  }
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
`;

const ControlButton = styled.button`
  background: #374151;
  border: 1px solid #4b5563;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  
  &:hover {
    background: #4b5563;
    border-color: #6b7280;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

function ViewerControls() {
  const { viewerSettings, updateViewerSettings, viewer } = useViewerStore();
  
  const handleToggle = (setting) => {
    updateViewerSettings({ [setting]: !viewerSettings[setting] });
  };
  
  const handleSliderChange = (setting, value) => {
    updateViewerSettings({ [setting]: parseFloat(value) });
  };
  
  const handleViewerAction = (action) => {
    if (!viewer) return;
    
    switch (action) {
      case 'fit':
        viewer.getRenderer().fitToScreen();
        break;
      case 'reset':
        viewer.getRenderer().resetView();
        break;
      case 'zoom-in':
        viewer.getRenderer().zoom(1.2);
        break;
      case 'zoom-out':
        viewer.getRenderer().zoom(0.8);
        break;
      default:
        break;
    }
  };
  
  return (
    <ControlsContainer>
      <ControlGroup>
        <GroupTitle>
          <Grid size={16} />
          Display
        </GroupTitle>
        
        <ControlRow>
          <ControlLabel>Show Grid</ControlLabel>
          <Toggle
            active={viewerSettings.showGrid}
            onClick={() => handleToggle('showGrid')}
          />
        </ControlRow>
        
        <ControlRow>
          <ControlLabel>Show Axes</ControlLabel>
          <Toggle
            active={viewerSettings.showAxes}
            onClick={() => handleToggle('showAxes')}
          />
        </ControlRow>
      </ControlGroup>
      
      <ControlGroup>
        <GroupTitle>
          <Lightbulb size={16} />
          Lighting
        </GroupTitle>
        
        <ControlRow>
          <ControlLabel>Ambient Light</ControlLabel>
        </ControlRow>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={viewerSettings.ambientLightIntensity}
          onChange={(e) => handleSliderChange('ambientLightIntensity', e.target.value)}
        />
        
        <ControlRow style={{ marginTop: '12px' }}>
          <ControlLabel>Directional Light</ControlLabel>
        </ControlRow>
        <Slider
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={viewerSettings.directionalLightIntensity}
          onChange={(e) => handleSliderChange('directionalLightIntensity', e.target.value)}
        />
      </ControlGroup>
      
      <ControlGroup>
        <GroupTitle>
          <Move size={16} />
          Navigation
        </GroupTitle>
        
        <ButtonGrid>
          <ControlButton onClick={() => handleViewerAction('fit')}>
            <ZoomIn size={14} />
            Fit
          </ControlButton>
          
          <ControlButton onClick={() => handleViewerAction('reset')}>
            <RotateCcw size={14} />
            Reset
          </ControlButton>
          
          <ControlButton onClick={() => handleViewerAction('zoom-in')}>
            <ZoomIn size={14} />
            Zoom +
          </ControlButton>
          
          <ControlButton onClick={() => handleViewerAction('zoom-out')}>
            <ZoomOut size={14} />
            Zoom -
          </ControlButton>
        </ButtonGrid>
      </ControlGroup>
    </ControlsContainer>
  );
}

export default ViewerControls;