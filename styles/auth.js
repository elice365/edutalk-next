export const auth = {
  // Layout styles for auth pages
  layout: {
    background: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-x-hidden xs:mt-16",
    backgroundPattern: "absolute inset-0 -z-10",
    decorativeElement: "absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl animate-float",
    decorativeElementAlt: "absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-200/20 to-primary-200/20 rounded-full blur-3xl animate-float",
    centerBubble: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-100/10 to-secondary-100/10 rounded-full blur-2xl animate-bounce-gentle",
    mainContainer: "flex min-h-screen",
    brandingSide: "hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 items-center justify-center p-12 relative overflow-hidden",
    formSide: "flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen lg:min-h-0",
    formWrapper: "w-full max-w-lg lg:max-w-2xl",
    mobile:{
      header: "hidden",
      logoContainer: "flex items-center justify-center space-x-3 mb-4",
      logo: "w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center",
      title: "text-2xl sm:text-3xl font-display font-bold text-neutral-900",
      subtitle: "text-neutral-500 text-sm -mt-1",
      description:"text-neutral-600 leading-relaxed text-sm sm:text-base",
    },
    formContainer: "relative",
    homeLink: "text-center mt-6 sm:mt-8 animate-fade-in",
    homeLinkButton: "inline-flex items-center text-neutral-600 hover:text-primary-600 transition-colors duration-200 group text-sm sm:text-base"
  },

  // Branding section styles
  branding: {
    container: "text-center text-white relative z-10 max-w-lg",
    logoSection: "flex items-center justify-center space-x-3 mb-8 animate-slide-up",
    logoIcon: "w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20",
    title: "text-4xl font-display font-bold",
    subtitle: "text-primary-100 text-sm -mt-1",
    messageSection: "animate-slide-up",
    mainHeading: "text-3xl font-bold mb-6 leading-tight",
    accent: "text-secondary-200",
    description: "text-xl mb-12 text-primary-100 leading-relaxed",
    feature: {
      container: "space-y-6 animate-slide-up",
      card:"flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300",
      icon:"w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0",
      content:"text-left",
      title: "font-semibold text-white mb-1",
      description: "text-primary-100 text-sm"
    },
    trust:{
      section :"mt-12 pt-8 border-t border-white/20 animate-slide-up",
      grid:"grid grid-cols-3 gap-6 text-center",
      number:"text-2xl font-bold text-white",
      label:"text-primary-200 text-sm"
    },
  },

  // 메인 컨테이너
  container: "bg-white/70 backdrop-blur-xl rounded-4xl shadow-large border border-white/20 p-6 sm:p-8 lg:p-10  w-full max-w-md mx-auto",
  
  // 헤더 섹션
  header: {
    login:{
       container: "text-center mb-8",
       iconContainer: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl mb-6",
       title: "text-2xl sm:text-3xl font-display font-bold text-neutral-900 mb-3",
       subtitle: "text-neutral-600 leading-relaxed text-sm sm:text-base",
    },
    register:{
      container: "text-center mb-10",
      iconContainer:"inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-success-500 to-primary-500 rounded-3xl mb-6",
      title:"text-3xl font-display font-bold text-neutral-900 mb-3",
      subtitle: "text-neutral-600 leading-relaxed",
    },
    icon: "w-8 h-8 text-white",
  },

  // 폼 스타일
  form: {
    container: "space-y-6"
  },

  // 입력 필드 스타일
  input: {
    label: "block text-sm font-semibold text-neutral-700 mb-3",
    container: "relative",
    passwordConfirmGap: "space-y-3",
    iconContainer: {
      base: "absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200",
      focused: "text-primary-500",
      default: "text-neutral-400"
    },
    icon: "w-5 h-5",
    field: {
      base: "w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:outline-none text-neutral-900 placeholder-neutral-400",
      focused: "border-primary-500 shadow-glow ring-4 ring-primary-100",
      default: "border-neutral-200 hover:border-neutral-300"
    },
    fieldWithToggle: {
      base: "w-full pl-12 pr-12 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm focus:outline-none text-neutral-900 placeholder-neutral-400",
      focused: "border-primary-500 shadow-glow ring-4 ring-primary-100",
      default: "border-neutral-200 hover:border-neutral-300"
    },
    toggleButton: "absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-primary-500 transition-colors duration-200"
  },

  // 버튼 스타일
  button: {
    primary: "w-full  bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 rounded-2xl hover:from-primary-600 hover:to-secondary-600 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-large hover:shadow-glow transform hover:-translate-y-1 flex items-center justify-center gap-2",
    secondary: "w-full bg-gradient-to-r from-neutral-500 to-neutral-600 text-white py-4  rounded-2xl hover:from-neutral-600 hover:to-neutral-700 font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-large items-center justify-center flex gap-2",
    warning: "w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-2xl hover:from-amber-600 hover:to-orange-600 font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-large"
  },

  // 알림 스타일
  alert: {
    success:{
      container :"bg-success-50 border-2 border-success-200 rounded-2xl p-4 mb-6",
      content :  "flex items-start gap-3",
      icon: "w-5 h-5 text-success-500 mt-0.5",
      title: "text-success-700 text-lg font-semibold mb-1",
      text: "text-success-700 text-sm font-medium mb-2",
    } ,
    error:{
      container: "bg-error-50 border-2 border-error-200 rounded-2xl p-4 mt-4",
      content:"flex items-center gap-3",
      icon:"w-5 h-5 text-error-500",
      text:"text-error-700 text-sm font-medium",
    },
    info:{
      container: "bg-primary-50 border border-primary-200 rounded-xl p-3",
      content: "flex items-start gap-2",
      icon: "w-4 h-4 text-primary-500 mt-0.5",
      title: "text-primary-700 text-sm font-medium mb-1",
      text: "text-primary-600 text-xs leading-relaxed",
    },
    warning:{
      container: "bg-amber-50 rounded-2xl p-4 mb-6",
      content: "flex items-start gap-3",
      icon: "w-5 h-5 text-warning-500 mt-0.5",
      title: "text-amber-700 text-sm font-medium mb-2",
      text: "text-amber-600 text-xs",
    },
  },

  // 링크 스타일
  link: {
    primary: "text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 underline underline-offset-2 hover:underline-offset-4",
    secondary: "text-neutral-600 hover:text-primary-600 transition-colors duration-200"
  },

  // 네비게이션 스타일
  navigation: {
    container: "space-y-4 pt-4 border-t border-neutral-200",
    centerLinks: "flex items-center text-sm justify-center",
    textContainer: "text-center text-sm text-neutral-600"
  },

  // 스피너 애니메이션
  spinner: "w-5 h-5 border-2 border-white border-t-transparent rounded-full",

  // Progress bar (register용)
  progress: {
    container: "mb-10",
    step:{
      container :"flex items-center justify-center mb-4",
      completed:"w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 bg-success-500 text-white",
      active:"w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 bg-primary-500 text-white",
      inactive:"w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 bg-neutral-200 text-neutral-500",
    },

    connector: {
      container:"w-16 lg:w-24 h-1 mx-3 lg:mx-4 rounded-full transition-all duration-300",
      active: "bg-success-500",
      inactive: "bg-neutral-200",
    },
    label: "text-center text-sm font-medium text-neutral-600"
  },

  // Password strength indicator
  passwordStrength: {
    container: "mt-3",
    bar:{
      container: "flex items-center gap-2 mb-2",
      section: "flex-1 bg-neutral-200 rounded-full h-2",
      fill: "h-2 rounded-full transition-all duration-300",
      weak: "bg-error-500 w-1/4",
      fair: "bg-warning-500 w-2/4",
      good: "bg-success-400 w-3/4",
      strong: "bg-success-500 w-full",
    },
    label: "text-sm font-medium",
    hint: "text-xs text-neutral-500"
  },

  // Checkbox styles
  checkbox: {
    container: "flex items-start gap-4 p-4 border-2 border-neutral-200 rounded-2xl hover:border-primary-300 transition-all duration-200 cursor-pointer group",
    input: "w-5 h-5 text-primary-600 border-2 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2 mt-0.5",
    label: "font-semibold text-neutral-800 mb-1",
    description: "text-sm text-neutral-600"
  },

  // Register specific styles
  register: {
    formContainer: "space-y-8",
    fieldGroup: "space-y-6",
    summary:{
      container: "bg-primary-50 border border-primary-200 rounded-2xl p-6",
      title:  "font-semibold text-primary-800 mb-4 flex items-center gap-2",
      icon : "w-5 h-5",
      content: "space-y-2 text-sm",
      row: "flex justify-between",
      label: "text-neutral-600",
      value: "font-medium text-neutral-800"

    },
  },

  // Footer styles
  footer: {
    container: "mt-6 pt-4 border-t border-neutral-200",
    text: "text-xs text-neutral-500"
  }
};