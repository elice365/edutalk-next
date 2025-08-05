export const chat = {
  // Main container
  container: "h-full flex flex-col bg-white/50 backdrop-blur-xl",
  layout:"h-full flex flex-col",
  section:{
    header:"flex-shrink-0 relative z-10",
    messages:"flex-1 overflow-hidden relative",
    input:"flex-shrink-0 relative z-10",
  },
  // Header
  header: {
    container: "flex items-center justify-between p-4 border-b border-neutral-200/50 bg-white/70 backdrop-blur-xl",
    leftSection: "flex items-center gap-3 mt-3",
    
    // Avatar and info
    avatar:{
      container:"relative",
      picture:  "w-10 h-10 rounded-3xl border-2 border-white shadow-sm",
      default: "w-10 h-10 rounded-3xl border-2 border-white shadow-sm bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center",
      icon: "w-6 h-6 text-white",
      // Status indicators
      status:{
        online:"absolute w-2 h-2 right-1 bottom-1 bg-success-500 rounded-full",
        offline:"absolute w-2 h-2 right-1 bottom-1 bg-neutral-400 rounded-full",
      },
    },
    
    user:{
      info:"flex-1 min-w-0",
      name:"font-semibold text-neutral-900 truncate",
      status:"text-sm text-neutral-500",
    },
  },
  
  // Messages area
  messages: {
    container: "flex-1 overflow-y-auto p-4 space-y-4",
    scrollToBottom: "scroll-smooth",
    
    // Message grouping
    Group: "space-y-2",
    dateSeperator: "flex items-center justify-center my-6",
    dateText: "px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full",
    
     // Message bubble
    bubble: "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative",

     // Message content
    text: "text-sm leading-relaxed break-words whitespace-pre-wrap",
    time: "text-xs opacity-100 mt-1",

    // for my messages
    own:{
      wrapper:"flex items-end gap-2 justify-end",
      section: "flex flex-col items-end",
      time: "text-primary-400 opacity-100",
      bubble: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-br-md shadow-soft transition-all duration-200 group-hover:shadow-medium shadow-primary-200/25 max-w-xs sm:max-w-md lg:max-w-lg",
      status:"flex items-center",
    },
    // for other users messages
    other:{
       wrapper: "flex items-start gap-2",
       section: "flex flex-col items-start",
       name:"text-xs text-neutral-500 mb-1 px-1",
       time:  "text-neutral-500 opacity-100",
       bubble: "bg-white border border-neutral-200 text-neutral-900 rounded-tl-md shadow-soft transition-all duration-200 group-hover:shadow-medium backdrop-blur-sm hover:border-primary-200/60 max-w-xs sm:max-w-md lg:max-w-lg",
       avatar: "w-8 h-8 rounded-lg border border-neutral-200 flex-shrink-0",
       avatarDefault: "w-8 h-8 rounded-lg border border-neutral-200 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center",
       avatarIcon: "w-4 h-4 text-white",
    },
  
    // Message status
    status:{
      container:"flex items-center gap-1 mt-1 opacity-0  duration-200",
      icon: "w-3 h-3",
      sending: "text-neutral-400",
      sent: "text-neutral-500",
      delivered: "text-success-500",
      read: "text-primary-400"
    } ,
   
    // Typing indicator
    typing:{
      indicator:"flex items-center gap-2 p-4",
      avatar:"w-8 h-8 rounded-lg border border-neutral-200 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center",
      avatarIcon:"w-4 h-4 text-white",
      bubble: "bg-white border border-neutral-200 rounded-2xl rounded-bl-md px-4 py-3",
      dots: "flex gap-1",
      dot: "w-2 h-2 bg-neutral-400 rounded-full animate-pulse"
    },
  },
  
  // Input area
  input: {
    container: "border-t border-neutral-200/50 bg-white/70 backdrop-blur-xl p-4",
    wrapper: "flex items-end gap-3 items-center",
    
    // Text input
    text:{
      container: "flex-1 relative mt-1",
      field: "w-full min-h-[44px] max-h-32 px-4 py-3 pr-12 border-2 border-neutral-200 rounded-2xl resize-none focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white/80 placeholder-neutral-400",
      fieldFocused: "border-primary-500 ring-4 ring-primary-100",
    },
    
  
    // Attachment button
    attach:{
      button: "absolute p-3 right-1 top-1 rounded-xl text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200",
      icon: "w-5 h-5",
    },
    
    // Send button
    send:{
      button:"p-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
      buttonDisabled: "opacity-50 cursor-not-allowed",
      icon: "w-5 h-5",
    },
  },

  // File upload 첨부파일 화면을 직접 만들면 쓸 것 / 아니면 폐기 
  fileUpload: {
    overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",
    container: "bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-md mx-auto overflow-hidden",
    header: "px-6 py-4 border-b border-neutral-200",
    title: "text-lg font-semibold text-neutral-900",
    closeButton: "absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors duration-200",
    
    dropzone: "p-8 border-2 border-dashed border-neutral-300 rounded-xl m-6 text-center hover:border-primary-500 hover:bg-primary-50 transition-all duration-200",
    dropzoneActive: "border-primary-500 bg-primary-50",
    dropzoneIcon: "w-12 h-12 mx-auto mb-4 text-neutral-400",
    dropzoneText: "text-sm text-neutral-600 mb-2",
    dropzoneSubtext: "text-xs text-neutral-500",
    
    // File preview
    preview: "p-6 space-y-4",
    fileItem: "flex items-center gap-3 p-3 bg-neutral-50 rounded-xl",
    fileIcon: "w-8 h-8 text-primary-500",
    fileInfo: "flex-1 min-w-0",
    fileName: "font-medium text-neutral-900 truncate",
    fileSize: "text-sm text-neutral-500",
    removeButton: "p-1 rounded-lg text-neutral-400 hover:text-error-500 hover:bg-error-50 transition-colors duration-200",
    
    // Actions
    actions: "flex justify-end gap-3 p-6 border-t border-neutral-200",
    cancelButton: "px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 font-medium transition-all duration-200",
    uploadButton: "px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
  },
}
