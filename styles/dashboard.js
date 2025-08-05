export const dashboard = {
  // Layout styles
  layout: {
    container: "h-full bg-gradient-to-br from-neutral-50 to-primary-50/20 flex flex-col overflow-hidden",
    mainContent: "pt-16 h-screen flex",
    contentArea: "flex-1 lg:ml-64 xl:ml-72 2xl:ml-80",
    contentWrapper: "max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-6 min-h-full",
    chatWrapper: "h-full w-full p-0"
  },

  // Header styles
  header: {
    container: "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 z-50 shadow-sm",
    wrapper: "mx-auto px-4 sm:px-6 lg:px-8",
    content: "flex justify-between items-center h-16 md:h-18 lg:h-20",
    leftSection: "flex items-center gap-4",
    rightSection: "flex items-center gap-3",
    
    // Logo
    logo: {
      container: "flex items-center gap-3  group",
      icon: "w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-medium",
      iconSvg: "w-6 h-6 text-white",
      title: "text-lg sm:text-xl lg:text-2xl font-display font-bold text-neutral-900 group-hover:text-primary-600  transition-colors",
      subtitle: "text-xs text-neutral-500 -mt-1"
    },

    // Menu button
    menuButton: "lg:hidden p-3 rounded-xl text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200 min-w-touch min-h-touch flex items-center justify-center",
    menuIcon: "h-6 w-6",

    // Notifications
    notifications: {
      container: "relative",
      button: "relative p-2 rounded-xl text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200",
      icon: "w-6 h-6",
      badge: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center",
      badgeText: "text-white text-xs font-bold",
      dropdown: {
        container: "absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-large border border-white/20 z-50",
        content:"p-4",
        header: "flex items-center justify-between mb-4",
        title: "font-semibold text-neutral-900",
        allRead: "text-sm text-primary-600 hover:text-primary-700",
        list: "space-y-3 max-h-80 overflow-y-auto",
        item: "flex items-start gap-3 p-3 rounded-xl",
        icon: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        section: "flex-1",
        notificationTitle: "text-sm font-medium text-neutral-900",
        text: "text-xs text-neutral-600",
        time: "text-xs text-neutral-500",
      },
      notificationFooter: "mt-4 pt-4 border-t border-neutral-200/50",
      viewAllButton: "w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
    },

    // Profile menu
    profile: {
      container: "relative",
      button: "flex items-center gap-2 p-1 rounded-xl hover:bg-neutral-100 transition-colors duration-200",
      avatar: "w-10 h-10 rounded-xl border-2 border-white shadow-sm",
      avatarDefault: "w-10 h-10 rounded-xl border-2 border-white shadow-sm bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center",
      avatarIcon: "w-6 h-6 text-white",
      dropdown:{
        container: "absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-large border border-white/20 z-50",
        content: "p-4",
        header: "flex items-center gap-3 mb-4 pb-4 border-b border-neutral-200/50",
        avatar: "w-12 h-12 rounded-xl border-2 border-white shadow-sm",
        avatarDefault: "w-12 h-12 rounded-xl border-2 border-white shadow-sm bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center",
        avatarIcon: "w-7 h-7 text-white",
        userInfo: "flex-1",
        userName: "font-semibold text-neutral-900",
        userEmail: "text-sm text-neutral-500",
        menu: "space-y-2",
        item: "w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-primary-50 transition-colors text-left",
        itemIcon: "w-5 h-5 text-neutral-600",
        itemText: "text-sm font-medium text-neutral-700",
        logout: "w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-error-50 transition-colors text-left group",
        logoutIcon : "w-5 h-5 text-neutral-600 group-hover:text-error-600",
        logoutText: "text-sm font-medium text-neutral-700 group-hover:text-error-600"
      },
    },
  },

  // Sidebar styles
  sidebar: {
    desktop: "hidden lg:block w-64 xl:w-72 2xl:w-80 fixed left-0 top-20 bottom-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-200/50 dark:border-neutral-800",
    panel: "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm border border-neutral-200/50 dark:border-neutral-800 overflow-hidden h-full flex flex-col",
    
    // Tab header
    tab:{
      header: "flex border-b border-neutral-200/50 dark:border-neutral-800 flex-shrink-0 h-18",
      button: "flex-1 flex items-center justify-center gap-2 px-3 py-4 text-sm font-medium transition-all duration-200",
      buttonActive: "text-primary-500 bg-primary-50 dark:bg-primary-500/10 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400",
      buttonInactive: "text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-25 dark:hover:bg-primary-500/5",
      icon: "w-4 h-4",
      label: "text-xs sm:text-sm"
    },
    
    // Content area
    content: "flex-1 overflow-y-auto",
    contentPadding: "p-3 sm:p-4",
    
    // Section styles
    section: {
      container: "space-y-3",
      header: "flex items-center justify-between",
      title: "font-semibold text-neutral-800 dark:text-neutral-200",
      action: "text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
    },
    
    // Notice styles
    notice: {
      container: "p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:bg-primary-25 dark:hover:bg-primary-500/5 transition-colors cursor-pointer",
      header: "flex items-start justify-between mb-2",
      title: "font-medium text-neutral-800 dark:text-neutral-200 text-sm line-clamp-1",
      badge: "px-2 py-1 rounded-lg text-xs font-medium",
      badgetype:{
        update: "bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300",
        announcement: "bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300",
        maintenance: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
      },
      date: "text-xs text-neutral-500 dark:text-neutral-400"
    },
    
    // Chat styles
    chat: {
      button: "flex items-center gap-3 p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-colors cursor-pointer group w-full text-left",
      avatar: "w-10 h-10  dark:border-neutral-700 group-hover:border-primary-300 dark:group-hover:border-primary-500 transition-colors",
      content: "flex-1 min-w-0",
      headerRow: "flex items-center justify-between",
      name: "text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors",
      time: "text-xs text-neutral-500 dark:text-neutral-400",
      messageRow: "flex items-center justify-between",
      message: "text-xs text-neutral-600 dark:text-neutral-300 truncate",
      unreadBadge: "ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full",
      // Chat interface styles
      container: "h-full flex flex-col bg-white",
      messagesContainer: "flex-1 overflow-hidden",
      inputContainer: "border-t border-neutral-200 bg-white"
    }
  },

  // Mobile sidebar styles
  mobileSidebar: {
    backdrop: "lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40",
    panel: "lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto max-h-[80vh] rounded-b-3xl",
    container: "h-full flex flex-col",
    close:{
      container: "flex justify-end p-4 border-b border-neutral-200/50",
      button: "p-2 rounded-xl text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 transition-colors duration-200",
      icon: "w-5 h-5",
    },
  },

  // Cards and components
  card: {
    base: "bg-white/70 backdrop-blur-xl rounded-2xl shadow-soft border border-white/20 p-6",
    hover: "hover:shadow-medium transition-all duration-300",
    interactive: "cursor-pointer transform hover:-translate-y-1"
  },

  // Lists : 대시보드 화면 css -> 지울 예정( 아직은 아님 )
  list: {
    container: "space-y-2 p-4",
    item: "flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors duration-200 cursor-pointer",
    itemActive: "bg-primary-100 border border-primary-200",
    itemIcon: "w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0",
    itemIconSvg: "w-5 h-5 text-white",
    itemContent: "flex-1 min-w-0",
    itemTitle: "font-medium text-neutral-900 truncate",
    itemSubtitle: "text-sm text-neutral-600 truncate",
    itemBadge: "px-2 py-1 bg-primary-500 text-white text-xs font-bold rounded-full"
  },

  // Activity cards 대시보드 화면 css -> 지울 예정 ( 아직은 아님 )
  activity: {
    container: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    card: "bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-soft border border-white/20 hover:shadow-medium transition-all duration-300",
    header: "flex items-center justify-between mb-4",
    icon: "w-12 h-12 rounded-2xl flex items-center justify-center",
    iconSvg: "w-6 h-6 text-white",
    title: "font-semibold text-neutral-900",
    value: "text-2xl font-bold text-neutral-900 mb-2",
    change: "text-sm font-medium flex items-center gap-1",
    changePositive: "text-success-600",
    changeNegative: "text-error-600",
    changeIcon: "w-4 h-4"
  },
};