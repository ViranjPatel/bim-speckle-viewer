import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Filter, Grid, List, Trash2, Eye, Download, Calendar, HardDrive } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useViewerStore } from '../store/viewerStore';
import { useNavigate } from 'react-router-dom';

const ModelsContainer = styled.div`
  flex: 1;
  padding: 24px;
  background: #0a0a0a;
  overflow-y: auto;
`;

const ModelsHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 16px;
  line-height: 1.6;
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #404040;
  color: white;
  padding: 12px 16px 12px 44px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  background: ${props => props.active ? '#3b82f6' : 'transparent'};
  border: none;
  color: ${props => props.active ? 'white' : '#9ca3af'};
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: white;
    background: ${props => props.active ? '#2563eb' : '#374151'};
  }
`;

const FilterButton = styled.button`
  background: #374151;
  border: 1px solid #4b5563;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: #4b5563;
    border-color: #6b7280;
  }
`;

const ModelsGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr'};
  gap: 20px;
`;

const ModelCard = styled.div`
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  display: ${props => props.listView ? 'flex' : 'block'};
  
  &:hover {
    border-color: #404040;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const ModelThumbnail = styled.div`
  height: ${props => props.listView ? '80px' : '200px'};
  width: ${props => props.listView ? '120px' : '100%'};
  background: linear-gradient(135deg, #374151, #1f2937);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  }
`;

const ModelContent = styled.div`
  padding: 20px;
  display: ${props => props.listView ? 'flex' : 'block'};
  align-items: ${props => props.listView ? 'center' : 'unset'};
  gap: ${props => props.listView ? '16px' : '0'};
  flex: 1;
`;

const ModelInfo = styled.div`
  flex: 1;
`;

const ModelName = styled.h3`
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  word-break: break-word;
`;

const ModelMeta = styled.div`
  display: flex;
  flex-direction: ${props => props.listView ? 'row' : 'column'};
  gap: ${props => props.listView ? '16px' : '4px'};
  margin-bottom: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  font-size: 13px;
`;

const FormatBadge = styled.span`
  background: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ModelActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: ${props => props.listView ? 'flex-end' : 'flex-start'};
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'primary' ? '#3b82f6' : props.variant === 'danger' ? '#ef4444' : '#374151'};
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  
  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'primary': return '#2563eb';
        case 'danger': return '#dc2626';
        default: return '#4b5563';
      }
    }};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #9ca3af;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  color: #e5e7eb;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 24px;
`;

const UploadButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setSelectedModel } = useViewerStore();
  
  // Fetch models
  const { data: modelsData, isLoading, error } = useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const response = await axios.get('/api/models');
      return response.data;
    },
  });
  
  // Delete model mutation
  const deleteMutation = useMutation({
    mutationFn: async (modelId) => {
      await axios.delete(`/api/models/${modelId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['models']);
      toast.success('Model deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete model');
    },
  });
  
  const models = modelsData?.models || [];
  
  // Filter models based on search term
  const filteredModels = models.filter(model =>
    model.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.format.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleViewModel = (model) => {
    setSelectedModel(model);
    navigate('/viewer');
  };
  
  const handleDownload = (model) => {
    const link = document.createElement('a');
    link.href = model.url;
    link.download = model.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDelete = (model) => {
    if (window.confirm(`Are you sure you want to delete "${model.originalName}"?`)) {
      deleteMutation.mutate(model.id);
    }
  };
  
  if (isLoading) {
    return (
      <ModelsContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }} />
        </div>
      </ModelsContainer>
    );
  }
  
  if (error) {
    return (
      <ModelsContainer>
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          <p>Failed to load models: {error.message}</p>
        </div>
      </ModelsContainer>
    );
  }
  
  return (
    <ModelsContainer>
      <ModelsHeader>
        <Title>Model Library</Title>
        <Subtitle>
          Manage your uploaded BIM models. View, download, or delete models from your library.
          All uploaded files are stored securely and can be accessed anytime.
        </Subtitle>
      </ModelsHeader>
      
      <ControlsBar>
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search models by name or format..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <ViewToggle>
          <ViewButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={18} />
          </ViewButton>
          <ViewButton
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <List size={18} />
          </ViewButton>
        </ViewToggle>
        
        <FilterButton>
          <Filter size={16} />
          Filter
        </FilterButton>
      </ControlsBar>
      
      {filteredModels.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📁</EmptyIcon>
          <EmptyTitle>
            {models.length === 0 ? 'No Models Yet' : 'No Matching Models'}
          </EmptyTitle>
          <EmptyText>
            {models.length === 0
              ? 'Upload your first BIM model to get started with the 3D viewer.'
              : 'Try adjusting your search terms to find the models you\'re looking for.'}
          </EmptyText>
          {models.length === 0 && (
            <UploadButton onClick={() => navigate('/upload')}>
              Upload Your First Model
            </UploadButton>
          )}
        </EmptyState>
      ) : (
        <ModelsGrid viewMode={viewMode}>
          {filteredModels.map((model) => (
            <ModelCard key={model.id} listView={viewMode === 'list'}>
              <ModelThumbnail listView={viewMode === 'list'}>
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏗️</div>
                  <FormatBadge>{model.format.replace('.', '').toUpperCase()}</FormatBadge>
                </div>
              </ModelThumbnail>
              
              <ModelContent listView={viewMode === 'list'}>
                <ModelInfo>
                  <ModelName>{model.originalName}</ModelName>
                  
                  <ModelMeta listView={viewMode === 'list'}>
                    <MetaItem>
                      <HardDrive size={14} />
                      {formatFileSize(model.size)}
                    </MetaItem>
                    
                    <MetaItem>
                      <Calendar size={14} />
                      {formatDate(model.uploadDate)}
                    </MetaItem>
                  </ModelMeta>
                </ModelInfo>
                
                <ModelActions listView={viewMode === 'list'}>
                  <ActionButton
                    variant="primary"
                    onClick={() => handleViewModel(model)}
                  >
                    <Eye size={14} />
                    View
                  </ActionButton>
                  
                  <ActionButton onClick={() => handleDownload(model)}>
                    <Download size={14} />
                    Download
                  </ActionButton>
                  
                  <ActionButton
                    variant="danger"
                    onClick={() => handleDelete(model)}
                    disabled={deleteMutation.isLoading}
                  >
                    <Trash2 size={14} />
                    Delete
                  </ActionButton>
                </ModelActions>
              </ModelContent>
            </ModelCard>
          ))}
        </ModelsGrid>
      )}
    </ModelsContainer>
  );
}

export default ModelsPage;