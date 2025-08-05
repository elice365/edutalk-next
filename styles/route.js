export const route = {
  // 전체 레이아웃
  layout: {
    container: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50",
  },

  // 헤더
  header:{
    container:"fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 z-50 shadow-soft",
    inner: "flex justify-between items-center h-16 lg:h-20",
    wrapper: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    logo:{
      section:"flex items-center space-x-2 sm:space-x-3 group",
      icon: "w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-medium",
      text: " xs:block",
      title: "text-lg sm:text-xl lg:text-2xl font-display font-bold text-neutral-900 group-hover:text-primary-600 transition-colors",
      subtitle: "text-xs text-neutral-500 -mt-1 hidden sm:block",
    },
    // 헤더 안의 네비게이션
    navigation: {
      desktop:{
        navigation: "hidden lg:flex items-center space-x-8",
        navigationLink: "text-neutral-600 hover:text-primary-600 font-medium px-3 py-2 rounded-xl hover:bg-primary-50",
      },
    },
    cta:{
      button: "hidden lg:flex items-center space-x-3",
      login:"px-4 py-2 text-neutral-700 hover:text-primary-600 font-medium rounded-xl hover:bg-neutral-50",
      register:{
        group: "group px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium shadow-soft relative overflow-hidden",
        span:"absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        text:"relative",
      },
    },
    mobileMenuButton: "lg:hidden p-2 rounded-xl text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 relative z-50",
  }, 

  // 모바일 메뉴
  mobileMenu: {
    backdrop: "lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40",
    panel: "lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 shadow-large z-50",
    closeButtonWrap: "flex justify-end absolute top-4 right-4",
    closeButton: "p-2 rounded-xl text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 transition-colors duration-200",
    links: "space-y-2",
    link: "block px-4 py-3 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all duration-200",
    cta:{
      button: "space-y-3 mt-6 pt-6 border-t border-neutral-200",
      login: "block text-center px-6 py-3 text-neutral-700 hover:text-primary-600  font-medium hover:bg-neutral-200 rounded-xl",
      register: "block text-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium shadow-soft",
    },
  },

  // 메인 컨텐츠
  main: {
    container: "pt-16 lg:pt-20",
  },

  // 히어로 섹션
  hero: {
    container: "relative pt-8 sm:pt-12 lg:pt-16 pb-20 sm:pb-28 lg:pb-32 overflow-hidden min-h-[80vh] flex items-center",
    sectionWrap:"absolute inset-0 -z-10",
    section1: "absolute top-0 left-0 w-72 sm:w-96 lg:w-[500px] h-72 sm:h-96 lg:h-[500px] bg-gradient-to-br from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl",
    section2:"absolute bottom-0 right-0 w-72 sm:w-96 lg:w-[500px] h-72 sm:h-96 lg:h-[500px] bg-gradient-to-tl from-secondary-200/20 to-primary-200/20 rounded-full blur-3xl",
    section3: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-r from-primary-100/10 to-secondary-100/10 rounded-full blur-2xl",
    content:{
      wrap: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full",
      badge:"inline-flex items-center px-3 sm:px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-primary-200 hover:bg-primary-100 transition-all duration-300 cursor-pointer",
      text:"w-2 h-2 bg-success-500 rounded-full mr-2"
    },
    main:{
      title: "text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-neutral-900 mb-6 sm:mb-8 leading-tight tracking-tight",
      gradiant: "bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent block",
      sub:"text-neutral-800 block",
    },
    subtitle: "text-lg sm:text-xl md:text-2xl text-neutral-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4",
    cta:{
      button:"flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4",
      register:{
        section: "w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl font-semibold text-base sm:text-lg shadow-large relative overflow-hidden",
        span: "absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        text: "relative flex items-center justify-center",
      },
      demo:{
        section: "w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 border-2 border-neutral-300 text-neutral-700 rounded-2xl font-semibold text-base sm:text-lg backdrop-blur-sm hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 relative overflow-hidden",
        span: "absolute inset-0 bg-gradient-to-r from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        text: "relative flex items-center justify-center",
      },
    }, 
    feature:{
      wrap: "relative px-4",
      inner: "max-w-6xl mx-auto",
      grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8",
      card:{
        section:"group bg-white rounded-2xl sm:rounded-3xl shadow-large p-4 sm:p-6 border border-neutral-200/50 relative overflow-hidden",
        background: "absolute inset-0 bg-gradient-to-br from-primary-50/30 to-secondary-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        icon: "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4",
        title: "text-lg sm:text-xl font-bold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors duration-300",
        description: "text-sm sm:text-base text-neutral-600 group-hover:text-neutral-700 transition-colors duration-300 leading-relaxed",
        indicator: "absolute top-3 right-3 w-2 h-2 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100",
      }, 
    },
    visualWrap: "relative mt-8 sm:mt-12",
    visual1: "absolute -top-4 left-1/4 w-6 h-6 bg-primary-200 rounded-full opacity-60",
    visual2: "absolute -bottom-2 right-1/4 w-4 h-4 bg-secondary-200 rounded-full opacity-60",
    visual3: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full opacity-40",
  },

  // 기능 섹션
  features: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    section: "py-24 bg-white",
    header:{
      group: "text-center mb-20",
      title:  "text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6",
      highlight: "text-primary-600",
      description:  "text-xl text-neutral-600 max-w-3xl mx-auto",
    }, 
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
    card:{
      group:"group",
      inner: "bg-white rounded-3xl p-8 shadow-soft border border-neutral-100 cursor-pointer relative overflow-hidden",
      background: "absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
      icon: "relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
      title: "relative text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-300",
      description:"relative text-neutral-600 leading-relaxed group-hover:text-neutral-700 transition-colors duration-300",
      indicator: "absolute -top-2 -right-2 w-4 h-4 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100",
    },
  },

  // CTA 섹션
  cta: {
    section: "py-24 bg-neutral-50",
    wrapper: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
    card: "bg-white rounded-4xl p-12 shadow-large border border-neutral-100",
    title: "text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6",
    highlight: "text-primary-600",
    description: "text-xl text-neutral-600 mb-10",
    button:{
      wrap: "flex flex-col sm:flex-row items-center justify-center gap-4",
      register: "px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl font-semibold text-lg shadow-large",
      login: "px-8 py-4 text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 rounded-2xl font-semibold text-lg",
    },
  },

  // 푸터
  footer: {
    section: "bg-neutral-900 text-white py-16",
    wrapper: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    inner: "text-center",
    logo:{
      wrap: "flex items-center justify-center space-x-3 mb-6",
      icon: "w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center",
      title: "text-2xl font-display font-bold",
      subtitle: "text-neutral-400 text-sm",
    },
    description: "text-neutral-400 mb-8 max-w-md mx-auto",
    links: "flex justify-center space-x-8",
    link: "text-neutral-400 hover:text-white transition-colors",
    copyright: "mt-8 pt-8 border-t border-neutral-800 text-neutral-500 text-sm",
  },
}; 