// Simple toast notifications without React hooks
let toastContainer: HTMLElement | null = null;

function createToastContainer() {
  if (toastContainer) return toastContainer;
  
  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
  document.body.appendChild(toastContainer);
  
  return toastContainer;
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const container = createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `
    p-4 rounded-lg border transition-all duration-300 transform translate-x-full opacity-0
    ${type === 'success' ? 'bg-green-900/20 border-green-500 text-green-400' : ''}
    ${type === 'error' ? 'bg-red-900/20 border-red-500 text-red-400' : ''}
    ${type === 'info' ? 'bg-blue-900/20 border-blue-500 text-blue-400' : ''}
    max-w-sm font-mono text-sm
  `;
  
  toast.textContent = message;
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full', 'opacity-0');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

export const toast = {
  success: (message: string) => showToast(message, 'success'),
  error: (message: string) => showToast(message, 'error'),
  info: (message: string) => showToast(message, 'info'),
};