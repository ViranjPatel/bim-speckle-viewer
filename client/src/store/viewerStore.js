import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useViewerStore = create(
  devtools(
    (set, get) => ({
      // UI State
      sidebarOpen: true,
      activePanel: null,
      isLoading: false,
      
      // Viewer State
      viewer: null,
      currentModel: null,
      speckleUrl: '',
      
      // Models State
      uploadedModels: [],
      selectedModel: null,
      
      // View State
      viewerSettings: {
        showGrid: true,
        showAxes: true,
        backgroundColor: '#0a0a0a',
        ambientLightIntensity: 0.3,
        directionalLightIntensity: 0.7,
      },
      
      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActivePanel: (panel) => set({ activePanel: panel }),
      setLoading: (loading) => set({ isLoading: loading }),
      
      setViewer: (viewer) => set({ viewer }),
      setCurrentModel: (model) => set({ currentModel: model }),
      setSpeckleUrl: (url) => set({ speckleUrl: url }),
      
      setUploadedModels: (models) => set({ uploadedModels: models }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      
      updateViewerSettings: (settings) => 
        set((state) => ({
          viewerSettings: { ...state.viewerSettings, ...settings }
        })),
      
      // Complex Actions
      resetViewer: () => set({
        viewer: null,
        currentModel: null,
        speckleUrl: '',
        selectedModel: null,
      }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      addUploadedModel: (model) => 
        set((state) => ({
          uploadedModels: [model, ...state.uploadedModels]
        })),
      
      removeUploadedModel: (modelId) => 
        set((state) => ({
          uploadedModels: state.uploadedModels.filter(m => m.id !== modelId)
        })),
    }),
    {
      name: 'bim-viewer-store',
    }
  )
);

export { useViewerStore };