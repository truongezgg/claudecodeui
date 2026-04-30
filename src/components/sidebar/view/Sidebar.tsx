import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeviceSettings } from '../../../hooks/useDeviceSettings';
import { useVersionCheck } from '../../../hooks/useVersionCheck';
import { useCodexSdkVersionCheck } from '../../../hooks/useCodexSdkVersionCheck';
import { useUiPreferences } from '../../../hooks/useUiPreferences';
import { useSidebarController } from '../hooks/useSidebarController';
import { useTaskMaster } from '../../../contexts/TaskMasterContext';
import { useTasksSettings } from '../../../contexts/TasksSettingsContext';
import type { Project, LLMProvider } from '../../../types/app';
import type { MCPServerStatus, SidebarProps } from '../types/types';
import { RelativeTimeProvider } from '../contexts/RelativeTimeContext';
import SidebarCollapsed from './subcomponents/SidebarCollapsed';
import SidebarContent from './subcomponents/SidebarContent';
import SidebarModals from './subcomponents/SidebarModals';
import type { SidebarProjectListProps } from './subcomponents/SidebarProjectList';

type TaskMasterSidebarContext = {
  setCurrentProject: (project: Project) => void;
  mcpServerStatus: MCPServerStatus;
};

function Sidebar({
  projects,
  selectedProject,
  selectedSession,
  onProjectSelect,
  onSessionSelect,
  onNewSession,
  onSessionDelete,
  onProjectDelete,
  isLoading,
  loadingProgress,
  onRefresh,
  onShowSettings,
  showSettings,
  settingsInitialTab,
  onCloseSettings,
  isMobile,
}: SidebarProps) {
  const { t } = useTranslation(['sidebar', 'common']);
  const { isPWA } = useDeviceSettings({ trackMobile: false });
  const { updateAvailable: appUpdateAvailable, latestVersion, currentVersion, releaseInfo, installMode } = useVersionCheck(
    'siteboon',
    'claudecodeui',
  );
  const codexSdkInfo = useCodexSdkVersionCheck();
  const updateAvailable = appUpdateAvailable || !!codexSdkInfo?.updateAvailable;
  const { preferences, setPreference } = useUiPreferences();
  const { sidebarVisible } = preferences;
  const { setCurrentProject, mcpServerStatus } = useTaskMaster() as TaskMasterSidebarContext;
  const { tasksEnabled } = useTasksSettings();

  const {
    isSidebarCollapsed,
    expandedProjects,
    editingProject,
    showNewProject,
    editingName,
    loadingSessions,
    initialSessionsLoaded,
    isRefreshing,
    editingSession,
    editingSessionName,
    searchFilter,
    searchMode,
    setSearchMode,
    conversationResults,
    isSearching,
    searchProgress,
    clearConversationResults,
    deletingProjects,
    deleteConfirmation,
    sessionDeleteConfirmation,
    showVersionModal,
    filteredProjects,
    toggleProject,
    handleSessionClick,
    toggleStarProject,
    isProjectStarred,
    getProjectSessions,
    startEditing,
    cancelEditing,
    saveProjectName,
    showDeleteSessionConfirmation,
    confirmDeleteSession,
    requestProjectDelete,
    confirmDeleteProject,
    loadMoreSessions,
    handleProjectSelect,
    refreshProjects,
    updateSessionSummary,
    collapseSidebar: handleCollapseSidebar,
    expandSidebar: handleExpandSidebar,
    setShowNewProject,
    setEditingName,
    setEditingSession,
    setEditingSessionName,
    setSearchFilter,
    setDeleteConfirmation,
    setSessionDeleteConfirmation,
    setShowVersionModal,
  } = useSidebarController({
    projects,
    selectedProject,
    selectedSession,
    isLoading,
    isMobile,
    t,
    onRefresh,
    onProjectSelect,
    onSessionSelect,
    onSessionDelete,
    onProjectDelete,
    setCurrentProject,
    setSidebarVisible: (visible) => setPreference('sidebarVisible', visible),
    sidebarVisible,
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle('pwa-mode', isPWA);
    document.body.classList.toggle('pwa-mode', isPWA);
  }, [isPWA]);

  const handleProjectCreated = useCallback(() => {
    if (window.refreshProjects) {
      void window.refreshProjects();
      return;
    }

    window.location.reload();
  }, []);

  const handleSaveProjectName = useCallback(
    (projectName: string) => {
      void saveProjectName(projectName);
    },
    [saveProjectName],
  );

  const handleLoadMoreSessions = useCallback(
    (project: Project) => {
      void loadMoreSessions(project);
    },
    [loadMoreSessions],
  );

  const handleStartEditingSession = useCallback(
    (sessionId: string, initialName: string) => {
      setEditingSession(sessionId);
      setEditingSessionName(initialName);
    },
    [setEditingSession, setEditingSessionName],
  );

  const handleCancelEditingSession = useCallback(() => {
    setEditingSession(null);
    setEditingSessionName('');
  }, [setEditingSession, setEditingSessionName]);

  const handleSaveEditingSession = useCallback(
    (projectName: string, sessionId: string, summary: string, provider: LLMProvider) => {
      void updateSessionSummary(projectName, sessionId, summary, provider);
    },
    [updateSessionSummary],
  );

  const projectListProps: SidebarProjectListProps = useMemo(
    () => ({
      projects,
      filteredProjects,
      selectedProject,
      selectedSession,
      isLoading,
      loadingProgress,
      expandedProjects,
      editingProject,
      editingName,
      loadingSessions,
      initialSessionsLoaded,
      editingSession,
      editingSessionName,
      deletingProjects,
      tasksEnabled,
      mcpServerStatus,
      getProjectSessions,
      isProjectStarred,
      onEditingNameChange: setEditingName,
      onToggleProject: toggleProject,
      onProjectSelect: handleProjectSelect,
      onToggleStarProject: toggleStarProject,
      onStartEditingProject: startEditing,
      onCancelEditingProject: cancelEditing,
      onSaveProjectName: handleSaveProjectName,
      onDeleteProject: requestProjectDelete,
      onSessionSelect: handleSessionClick,
      onDeleteSession: showDeleteSessionConfirmation,
      onLoadMoreSessions: handleLoadMoreSessions,
      onNewSession,
      onEditingSessionNameChange: setEditingSessionName,
      onStartEditingSession: handleStartEditingSession,
      onCancelEditingSession: handleCancelEditingSession,
      onSaveEditingSession: handleSaveEditingSession,
      t,
    }),
    [
      projects,
      filteredProjects,
      selectedProject,
      selectedSession,
      isLoading,
      loadingProgress,
      expandedProjects,
      editingProject,
      editingName,
      loadingSessions,
      initialSessionsLoaded,
      editingSession,
      editingSessionName,
      deletingProjects,
      tasksEnabled,
      mcpServerStatus,
      getProjectSessions,
      isProjectStarred,
      setEditingName,
      toggleProject,
      handleProjectSelect,
      toggleStarProject,
      startEditing,
      cancelEditing,
      handleSaveProjectName,
      requestProjectDelete,
      handleSessionClick,
      showDeleteSessionConfirmation,
      handleLoadMoreSessions,
      onNewSession,
      setEditingSessionName,
      handleStartEditingSession,
      handleCancelEditingSession,
      handleSaveEditingSession,
      t,
    ],
  );

  const handleCloseNewProject = useCallback(() => setShowNewProject(false), [setShowNewProject]);
  const handleCancelDeleteProject = useCallback(() => setDeleteConfirmation(null), [setDeleteConfirmation]);
  const handleCancelDeleteSession = useCallback(
    () => setSessionDeleteConfirmation(null),
    [setSessionDeleteConfirmation],
  );
  const handleCloseVersionModal = useCallback(() => setShowVersionModal(false), [setShowVersionModal]);
  const handleShowVersionModal = useCallback(() => setShowVersionModal(true), [setShowVersionModal]);
  const handleClearSearchFilter = useCallback(() => setSearchFilter(''), [setSearchFilter]);
  const handleSearchModeChange = useCallback(
    (mode: 'projects' | 'conversations') => {
      setSearchMode(mode);
      if (mode === 'projects') clearConversationResults();
    },
    [setSearchMode, clearConversationResults],
  );
  const handleRefreshClick = useCallback(() => {
    void refreshProjects();
  }, [refreshProjects]);
  const handleCreateProject = useCallback(() => setShowNewProject(true), [setShowNewProject]);

  const handleConversationResultClick = useCallback(
    (
      projectName: string,
      sessionId: string,
      provider: string,
      messageTimestamp?: string | null,
      messageSnippet?: string | null,
    ) => {
      const resolvedProvider = (provider || 'claude') as LLMProvider;
      const project = projects.find((p) => p.name === projectName);
      const searchTarget = {
        __searchTargetTimestamp: messageTimestamp || null,
        __searchTargetSnippet: messageSnippet || null,
      };
      const sessionObj = {
        id: sessionId,
        __provider: resolvedProvider,
        __projectName: projectName,
        ...searchTarget,
      };
      if (project) {
        handleProjectSelect(project);
        const sessions = getProjectSessions(project);
        const existing = sessions.find((s) => s.id === sessionId);
        if (existing) {
          handleSessionClick({ ...existing, ...searchTarget }, projectName);
        } else {
          handleSessionClick(sessionObj, projectName);
        }
      } else {
        handleSessionClick(sessionObj, projectName);
      }
    },
    [projects, handleProjectSelect, getProjectSessions, handleSessionClick],
  );

  return (
    <RelativeTimeProvider>
      <SidebarModals
        projects={projects}
        showSettings={showSettings}
        settingsInitialTab={settingsInitialTab}
        onCloseSettings={onCloseSettings}
        showNewProject={showNewProject}
        onCloseNewProject={handleCloseNewProject}
        onProjectCreated={handleProjectCreated}
        deleteConfirmation={deleteConfirmation}
        onCancelDeleteProject={handleCancelDeleteProject}
        onConfirmDeleteProject={confirmDeleteProject}
        sessionDeleteConfirmation={sessionDeleteConfirmation}
        onCancelDeleteSession={handleCancelDeleteSession}
        onConfirmDeleteSession={confirmDeleteSession}
        showVersionModal={showVersionModal}
        onCloseVersionModal={handleCloseVersionModal}
        releaseInfo={releaseInfo}
        currentVersion={currentVersion}
        latestVersion={latestVersion}
        installMode={installMode}
        codexSdkInfo={codexSdkInfo}
        t={t}
      />

      {isSidebarCollapsed ? (
        <SidebarCollapsed
          onExpand={handleExpandSidebar}
          onShowSettings={onShowSettings}
          updateAvailable={updateAvailable}
          onShowVersionModal={handleShowVersionModal}
          t={t}
        />
      ) : (
        <SidebarContent
          isPWA={isPWA}
          isMobile={isMobile}
          isLoading={isLoading}
          projects={projects}
          searchFilter={searchFilter}
          onSearchFilterChange={setSearchFilter}
          onClearSearchFilter={handleClearSearchFilter}
          searchMode={searchMode}
          onSearchModeChange={handleSearchModeChange}
          conversationResults={conversationResults}
          isSearching={isSearching}
          searchProgress={searchProgress}
          onConversationResultClick={handleConversationResultClick}
          onRefresh={handleRefreshClick}
          isRefreshing={isRefreshing}
          onCreateProject={handleCreateProject}
          onCollapseSidebar={handleCollapseSidebar}
          updateAvailable={updateAvailable}
          releaseInfo={releaseInfo}
          latestVersion={latestVersion}
          currentVersion={currentVersion}
          onShowVersionModal={handleShowVersionModal}
          onShowSettings={onShowSettings}
          projectListProps={projectListProps}
          t={t}
        />
      )}
    </RelativeTimeProvider>
  );
}

export default Sidebar;
