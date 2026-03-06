/**
 * Analytics Module - Visitor Tracking and Analytics
 * KISHORE Portfolio System
 */

const Analytics = (function() {
    // Configuration
    const config = {
        enabled: true,
        trackPageViews: true,
        trackEvents: true,
        trackTimeOnPage: true,
        gaId: APP_CONFIG.analytics?.googleAnalyticsId || null
    };

    // Session data
    let sessionStart = Date.now();
    let pageViews = 0;
    let events = [];

    // Initialize analytics
    async function init() {
        if (!config.enabled) return;

        // Load Google Analytics if configured
        if (config.gaId && config.gaId !== 'G-XXXXXXXXXX') {
            loadGoogleAnalytics();
        }

        // Track page view
        if (config.trackPageViews) {
            trackPageView(window.location.pathname);
        }

        // Track time on page
        if (config.trackTimeOnPage) {
            trackTimeOnPage();
        }

        // Update visitor counter
        await updateVisitorCounter();

        // Track device info
        trackDeviceInfo();
    }

    // Load Google Analytics
    function loadGoogleAnalytics() {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { dataLayer.push(arguments); };
        
        gtag('js', new Date());
        gtag('config', config.gaId, {
            'send_page_view': false,
            'anonymize_ip': true
        });
    }

    // Track page view
    function trackPageView(page) {
        pageViews++;
        
        if (window.gtag) {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: page
            });
        }

        // Store in localStorage
        const history = getPageViewHistory();
        history.push({
            page: page,
            title: document.title,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 20 pages
        if (history.length > 20) history.shift();
        localStorage.setItem('analytics_pageviews', JSON.stringify(history));

        console.log(`📊 Page view tracked: ${page}`);
    }

    // Track event
    function trackEvent(category, action, label = null, value = null) {
        events.push({ category, action, label, value, timestamp: new Date() });

        if (window.gtag) {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }

        // Log to console in development
        console.log(`📊 Event tracked: ${category} - ${action} ${label ? `(${label})` : ''}`);

        // Store in localStorage for admin
        const eventHistory = getEventHistory();
        eventHistory.push({
            category,
            action,
            label,
            value,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 events
        if (eventHistory.length > 50) eventHistory.shift();
        localStorage.setItem('analytics_events', JSON.stringify(eventHistory));
    }

    // Track time on page
    function trackTimeOnPage() {
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - sessionStart) / 1000);
            trackEvent('Engagement', 'time_on_page', window.location.pathname, timeSpent);
            
            // Send beacon for accurate tracking
            if (navigator.sendBeacon) {
                const data = JSON.stringify({
                    type: 'time_on_page',
                    path: window.location.pathname,
                    seconds: timeSpent
                });
                navigator.sendBeacon('/api/analytics', data);
            }
        });
    }

    // Track device information
    function trackDeviceInfo() {
        const device = {
            type: getDeviceType(),
            screen: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            platform: navigator.platform,
            userAgent: navigator.userAgent.substring(0, 100) // Truncate for privacy
        };

        localStorage.setItem('analytics_device', JSON.stringify(device));
        
        trackEvent('Device', 'info', device.type);
    }

    // Get device type
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    }

    // Update visitor counter in Firestore
    async function updateVisitorCounter() {
        if (!APP_CONFIG.analytics?.visitorCounter) return;
        
        try {
            const counterRef = firebaseDb.collection('counters').doc('visitors');
            
            // Use transaction to safely increment
            await firebaseDb.runTransaction(async (transaction) => {
                const doc = await transaction.get(counterRef);
                
                if (!doc.exists) {
                    transaction.set(counterRef, { 
                        count: 1,
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                        today: new Date().toDateString(),
                        dailyCount: 1
                    });
                } else {
                    const data = doc.data();
                    const today = new Date().toDateString();
                    
                    if (data.today === today) {
                        transaction.update(counterRef, {
                            count: firebase.firestore.FieldValue.increment(1),
                            dailyCount: firebase.firestore.FieldValue.increment(1),
                            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    } else {
                        transaction.update(counterRef, {
                            count: firebase.firestore.FieldValue.increment(1),
                            today: today,
                            dailyCount: 1,
                            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                }
            });

            // Get updated count
            const doc = await counterRef.get();
            if (doc.exists) {
                const countEl = document.getElementById('visitorCount');
                if (countEl) {
                    countEl.textContent = doc.data().count;
                }
            }
        } catch (error) {
            console.error('Error updating visitor counter:', error);
            
            // Fallback to localStorage
            let count = localStorage.getItem('visitorCount') || 0;
            count = parseInt(count) + 1;
            localStorage.setItem('visitorCount', count);
            
            const countEl = document.getElementById('visitorCount');
            if (countEl) {
                countEl.textContent = count;
            }
        }
    }

    // Get page view history
    function getPageViewHistory() {
        try {
            return JSON.parse(localStorage.getItem('analytics_pageviews')) || [];
        } catch {
            return [];
        }
    }

    // Get event history
    function getEventHistory() {
        try {
            return JSON.parse(localStorage.getItem('analytics_events')) || [];
        } catch {
            return [];
        }
    }

    // Get session data
    function getSessionData() {
        return {
            sessionDuration: Math.round((Date.now() - sessionStart) / 1000),
            pageViews,
            events: events.length,
            device: getDeviceType(),
            timestamp: new Date().toISOString()
        };
    }

    // Track download
    function trackDownload(fileName, fileType) {
        trackEvent('Download', 'file', `${fileName} (${fileType})`);
    }

    // Track social click
    function trackSocialClick(platform) {
        trackEvent('Social', 'click', platform);
    }

    // Track form submission
    function trackFormSubmit(formName) {
        trackEvent('Form', 'submit', formName);
    }

    // Public API
    return {
        init,
        trackPageView,
        trackEvent,
        trackDownload,
        trackSocialClick,
        trackFormSubmit,
        getSessionData,
        getPageViewHistory,
        getEventHistory
    };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Analytics.init();
});

// Track link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
        const href = link.getAttribute('href');
        
        // Track social media clicks
        if (href.includes('instagram.com')) {
            Analytics.trackSocialClick('Instagram');
        } else if (href.includes('linkedin.com')) {
            Analytics.trackSocialClick('LinkedIn');
        } else if (href.includes('github.com')) {
            Analytics.trackSocialClick('GitHub');
        } else if (href.includes('wa.me')) {
            Analytics.trackSocialClick('WhatsApp');
        } else if (href.startsWith('mailto:')) {
            Analytics.trackSocialClick('Email');
        } else if (href.startsWith('tel:')) {
            Analytics.trackSocialClick('Phone');
        }
        
        // Track download links
        if (href.includes('.pdf') || href.includes('.doc') || href.includes('.zip')) {
            Analytics.trackDownload(href.split('/').pop(), 'document');
        }
    }
});

window.Analytics = Analytics;
