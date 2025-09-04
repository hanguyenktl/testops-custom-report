import { create } from 'zustand';
import { TemplateConfig, ScopeSelection, TemplateConfiguration } from '@/lib/types';

interface TemplateStore {
  // Current template selection
  selectedTemplate: TemplateConfig | null;
  
  // Configuration state
  scopeSelection: ScopeSelection | null;
  configurationLevel: 1 | 2 | 3;
  selectedOptions: Record<string, string | string[]>;
  
  // Template configuration
  templateConfiguration: TemplateConfiguration | null;
  
  // Actions
  initializeTemplate: (template: TemplateConfig) => void;
  setScopeSelection: (scope: ScopeSelection) => void;
  setConfigurationLevel: (level: 1 | 2 | 3) => void;
  setOption: (optionId: string, value: string | string[]) => void;
  resetTemplate: () => void;
  
  // Bridge to chart builder
  exportToChartBuilder: () => any;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  selectedTemplate: null,
  scopeSelection: null,
  configurationLevel: 1,
  selectedOptions: {},
  templateConfiguration: null,

  initializeTemplate: (template: TemplateConfig) => {
    // Initialize with smart defaults
    const defaultScope: ScopeSelection = {
      type: template.optimalScope[0] || 'time',
      value: template.optimalScope[0] === 'time' ? 'last_30_days' : 'current_sprint',
      label: template.optimalScope[0] === 'time' ? 'Last 30 days' : 'Current Sprint'
    };

    // Initialize default options from level1Options
    const defaultOptions: Record<string, string | string[]> = {};
    template.level1Options.forEach(option => {
      if (option.defaultValue) {
        defaultOptions[option.id] = option.defaultValue;
      }
    });

    set({
      selectedTemplate: template,
      scopeSelection: defaultScope,
      configurationLevel: 1,
      selectedOptions: defaultOptions,
      templateConfiguration: {
        templateId: template.id,
        scope: defaultScope,
        level: 1,
        selectedOptions: defaultOptions
      }
    });
  },

  setScopeSelection: (scope: ScopeSelection) => {
    set((state) => ({
      scopeSelection: scope,
      templateConfiguration: state.templateConfiguration ? {
        ...state.templateConfiguration,
        scope
      } : null
    }));
  },

  setConfigurationLevel: (level: 1 | 2 | 3) => {
    set((state) => ({
      configurationLevel: level,
      templateConfiguration: state.templateConfiguration ? {
        ...state.templateConfiguration,
        level
      } : null
    }));
  },

  setOption: (optionId: string, value: string | string[]) => {
    set((state) => {
      const newOptions = {
        ...state.selectedOptions,
        [optionId]: value
      };
      
      return {
        selectedOptions: newOptions,
        templateConfiguration: state.templateConfiguration ? {
          ...state.templateConfiguration,
          selectedOptions: newOptions
        } : null
      };
    });
  },

  resetTemplate: () => {
    set({
      selectedTemplate: null,
      scopeSelection: null,
      configurationLevel: 1,
      selectedOptions: {},
      templateConfiguration: null
    });
  },

  exportToChartBuilder: () => {
    const state = get();
    if (!state.selectedTemplate || !state.scopeSelection) {
      return null;
    }

    // Convert template configuration to chart builder format
    return {
      entryMode: 'template' as const,
      templateId: state.selectedTemplate.id,
      selectedDataset: {
        id: state.selectedTemplate.dataset,
        name: state.selectedTemplate.name
      },
      // Pre-populate with template's auto-config
      metrics: state.selectedTemplate.autoConfig.metrics,
      groupBy: state.selectedTemplate.autoConfig.groupBy || [],
      filters: state.selectedTemplate.autoConfig.preFilters || [],
      chartType: state.selectedTemplate.chartType,
      scope: state.scopeSelection,
      templateLevel: state.configurationLevel,
      templateOptions: state.selectedOptions
    };
  }
}));