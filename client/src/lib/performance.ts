// Performance optimization utilities for RAUN-RACHID

export class PerformanceManager {
  private metrics: { [key: string]: number } = {};
  private observers: { [key: string]: PerformanceObserver } = {};

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics(): void {
    // Web Vitals monitoring
    this.observeLCP(); // Largest Contentful Paint
    this.observeFID(); // First Input Delay
    this.observeCLS(); // Cumulative Layout Shift
    this.observeFCP(); // First Contentful Paint
    this.observeTTFB(); // Time to First Byte
  }

  // Largest Contentful Paint
  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        console.log(`💚 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.lcp = observer;
    } catch (e) {
      console.log('LCP observer not supported');
    }
  }

  // First Input Delay
  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          console.log(`💚 FID: ${this.metrics.fid.toFixed(2)}ms`);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.fid = observer;
    } catch (e) {
      console.log('FID observer not supported');
    }
  }

  // Cumulative Layout Shift
  private observeCLS(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics.cls = clsValue;
            console.log(`💚 CLS: ${clsValue.toFixed(4)}`);
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.cls = observer;
    } catch (e) {
      console.log('CLS observer not supported');
    }
  }

  // First Contentful Paint
  private observeFCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            console.log(`💚 FCP: ${entry.startTime.toFixed(2)}ms`);
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.fcp = observer;
    } catch (e) {
      console.log('FCP observer not supported');
    }
  }

  // Time to First Byte
  private observeTTFB(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
            console.log(`💚 TTFB: ${this.metrics.ttfb.toFixed(2)}ms`);
          }
        });
      });
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.ttfb = observer;
    } catch (e) {
      console.log('TTFB observer not supported');
    }
  }

  // Get all current metrics
  public getMetrics(): { [key: string]: number } {
    return { ...this.metrics };
  }

  // Report metrics to console (for development)
  public reportMetrics(): void {
    console.log('📊 Performance Metrics:', this.metrics);
    
    // Performance scoring
    const score = this.calculatePerformanceScore();
    console.log(`🏆 Performance Score: ${score}/100`);
  }

  // Calculate overall performance score
  private calculatePerformanceScore(): number {
    let score = 100;
    
    // LCP scoring (Good: <2.5s, Needs Improvement: 2.5-4s, Poor: >4s)
    if (this.metrics.lcp > 4000) score -= 30;
    else if (this.metrics.lcp > 2500) score -= 15;
    
    // FID scoring (Good: <100ms, Needs Improvement: 100-300ms, Poor: >300ms)
    if (this.metrics.fid > 300) score -= 25;
    else if (this.metrics.fid > 100) score -= 10;
    
    // CLS scoring (Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25)
    if (this.metrics.cls > 0.25) score -= 25;
    else if (this.metrics.cls > 0.1) score -= 10;
    
    // FCP scoring (Good: <1.8s, Needs Improvement: 1.8-3s, Poor: >3s)
    if (this.metrics.fcp > 3000) score -= 15;
    else if (this.metrics.fcp > 1800) score -= 7;
    
    // TTFB scoring (Good: <600ms, Needs Improvement: 600-1.5s, Poor: >1.5s)
    if (this.metrics.ttfb > 1500) score -= 5;
    else if (this.metrics.ttfb > 600) score -= 2;
    
    return Math.max(0, score);
  }

  // Cleanup observers
  public cleanup(): void {
    Object.values(this.observers).forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        // Observer already disconnected
      }
    });
  }

  // Preload critical resources
  public preloadCriticalResources(): void {
    const criticalResources = [
      '/icon-192.svg',
      '/icon-512.svg'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.svg') ? 'image' : 'fetch';
      document.head.appendChild(link);
    });
  }

  // Optimize images loading
  public enableImageOptimization(): void {
    // Enable native lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }
}

// Global instance
export const performanceManager = new PerformanceManager();

// Initialize performance optimizations
if (typeof window !== 'undefined') {
  // Report metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceManager.reportMetrics();
    }, 5000);
  });

  // Preload critical resources
  performanceManager.preloadCriticalResources();

  // Enable image optimization
  performanceManager.enableImageOptimization();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    performanceManager.cleanup();
  });
}