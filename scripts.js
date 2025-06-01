// Metrics and Analytics System
class MetricsCollector {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.metrics = [];
        this.initializeTracking();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    initializeTracking() {
        // Track page load
        this.trackEvent('page_load', window.location.pathname);
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('visibility_change', document.hidden ? 'hidden' : 'visible');
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.trackEvent('scroll_depth', scrollPercent);
            }
        });

        // Send metrics periodically
        setInterval(() => {
            this.sendToCosmosDB();
        }, 30000); // Send every 30 seconds

        // Send metrics before page unload
        window.addEventListener('beforeunload', () => {
            this.sendToCosmosDB();
        });
    }

    trackEvent(eventType, eventData = null, additionalProperties = {}) {
        const metric = {
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            eventType: eventType,
            eventData: eventData,
            url: window.location.href,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            ...additionalProperties
        };

        this.metrics.push(metric);
        
        // Console log for development
        console.log('📊 Metric tracked:', metric);

        // Also store in localStorage for persistence
        this.storeMetricLocally(metric);
    }

    storeMetricLocally(metric) {
        const stored = JSON.parse(localStorage.getItem('pawnutrition_metrics') || '[]');
        stored.push(metric);
        
        // Keep only last 100 metrics locally
        if (stored.length > 100) {
            stored.splice(0, stored.length - 100);
        }
        
        localStorage.setItem('pawnutrition_metrics', JSON.stringify(stored));
    }

    async sendToCosmosDB() {
        if (this.metrics.length === 0) return;

        const metricsToSend = [...this.metrics];
        this.metrics = []; // Clear the queue

        try {
            // In a real implementation, this would connect to CosmosDB
            // For now, we'll simulate the API call and store data locally
            console.log('📤 Sending metrics to CosmosDB:', metricsToSend);
            
            // Simulate API call
            const response = await this.simulateCosmosDBCall(metricsToSend);
            
            if (response.success) {
                console.log('✅ Metrics successfully sent to CosmosDB');
            } else {
                console.error('❌ Failed to send metrics to CosmosDB');
                // Re-add metrics to queue for retry
                this.metrics.unshift(...metricsToSend);
            }
        } catch (error) {
            console.error('❌ Error sending metrics to CosmosDB:', error);
            // Re-add metrics to queue for retry
            this.metrics.unshift(...metricsToSend);
        }
    }

    async simulateCosmosDBCall(metrics) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        
        // Simulate 95% success rate
        const success = Math.random() > 0.05;
        
        if (success) {
            // Store metrics in a local "database" simulation
            const cosmosData = JSON.parse(localStorage.getItem('cosmos_db_simulation') || '[]');
            cosmosData.push(...metrics);
            localStorage.setItem('cosmos_db_simulation', JSON.stringify(cosmosData));
        }
        
        return { success };
    }

    // Method to get analytics dashboard data
    getAnalytics() {
        const allMetrics = JSON.parse(localStorage.getItem('cosmos_db_simulation') || '[]');
        
        const analytics = {
            totalEvents: allMetrics.length,
            uniqueUsers: new Set(allMetrics.map(m => m.userId)).size,
            uniqueSessions: new Set(allMetrics.map(m => m.sessionId)).size,
            topEvents: this.getTopEvents(allMetrics),
            userJourney: this.getUserJourney(allMetrics),
            conversionFunnel: this.getConversionFunnel(allMetrics)
        };
        
        return analytics;
    }

    getTopEvents(metrics) {
        const eventCounts = {};
        metrics.forEach(metric => {
            const key = `${metric.eventType}:${metric.eventData}`;
            eventCounts[key] = (eventCounts[key] || 0) + 1;
        });
        
        return Object.entries(eventCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([event, count]) => ({ event, count }));
    }

    getUserJourney(metrics) {
        const journeys = {};
        metrics.forEach(metric => {
            if (!journeys[metric.sessionId]) {
                journeys[metric.sessionId] = [];
            }
            journeys[metric.sessionId].push({
                eventType: metric.eventType,
                eventData: metric.eventData,
                timestamp: metric.timestamp
            });
        });
        
        return journeys;
    }

    getConversionFunnel(metrics) {
        const funnel = {
            pageLoad: 0,
            productView: 0,
            productClick: 0,
            blogEngagement: 0,
            socialEngagement: 0
        };
        
        const uniqueSessions = new Set();
        
        metrics.forEach(metric => {
            if (metric.eventType === 'page_load') {
                funnel.pageLoad++;
            } else if (metric.eventType === 'product_click') {
                if (!uniqueSessions.has(metric.sessionId + '_product')) {
                    funnel.productClick++;
                    uniqueSessions.add(metric.sessionId + '_product');
                }
            } else if (metric.eventType === 'blog_click') {
                if (!uniqueSessions.has(metric.sessionId + '_blog')) {
                    funnel.blogEngagement++;
                    uniqueSessions.add(metric.sessionId + '_blog');
                }
            } else if (metric.eventType === 'influencer_follow') {
                if (!uniqueSessions.has(metric.sessionId + '_social')) {
                    funnel.socialEngagement++;
                    uniqueSessions.add(metric.sessionId + '_social');
                }
            }
        });
        
        return funnel;
    }
}

// Initialize metrics collector
const metricsCollector = new MetricsCollector();

// Global function for tracking events (used in HTML)
function trackEvent(eventType, eventData = null, additionalProperties = {}) {
    metricsCollector.trackEvent(eventType, eventData, additionalProperties);
}

// Enhanced product interaction tracking
document.addEventListener('DOMContentLoaded', function() {
    // Track product card hovers
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const productId = this.getAttribute('data-product');
            trackEvent('product_hover', productId);
        });
    });

    // Track influencer card interactions
    document.querySelectorAll('.influencer-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const influencerId = this.getAttribute('data-influencer');
            trackEvent('influencer_hover', influencerId);
        });
    });

    // Track navigation clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const section = this.getAttribute('href');
            trackEvent('navigation_click', section);
        });
    });

    // Track form interactions (if any forms are added later)
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function() {
            trackEvent('form_field_focus', this.name || this.type);
        });
    });
});

// Marketing content management
class MarketingContent {
    constructor() {
        this.blogPosts = [
            {
                id: 1,
                title: "5 Signs Your Dog Needs Better Nutrition",
                excerpt: "Learn the key indicators that your furry friend might benefit from premium nutrition...",
                content: `
                    <h3>5 Signs Your Dog Needs Better Nutrition</h3>
                    <p>As loving pet owners, we want the best for our furry companions. Here are five key signs that your dog might benefit from upgrading to premium nutrition:</p>
                    <ol>
                        <li><strong>Dull Coat:</strong> A healthy dog should have a shiny, lustrous coat. If your dog's fur looks dull or feels rough, it might be lacking essential fatty acids.</li>
                        <li><strong>Low Energy:</strong> Dogs should be naturally energetic and playful. Lethargy could indicate poor nutrition.</li>
                        <li><strong>Digestive Issues:</strong> Frequent stomach upset or irregular bowel movements may signal that your current food isn't agreeing with your pet.</li>
                        <li><strong>Excessive Shedding:</strong> While all dogs shed, excessive shedding can indicate nutritional deficiencies.</li>
                        <li><strong>Poor Dental Health:</strong> Bad breath and tooth problems can be improved with proper nutrition.</li>
                    </ol>
                    <p>Our Premium Adult Formula addresses all these concerns with scientifically balanced nutrition.</p>
                `,
                tags: ["nutrition", "health", "signs"],
                publishDate: "2024-01-15"
            },
            {
                id: 2,
                title: "Transitioning to New Dog Food: A Step-by-Step Guide",
                excerpt: "Make the switch to our premium formula smooth and stress-free for your pet...",
                content: `
                    <h3>Transitioning to New Dog Food: A Step-by-Step Guide</h3>
                    <p>Switching your dog's food requires patience and a gradual approach. Here's our recommended 7-day transition plan:</p>
                    <h4>Days 1-2: 75% Old Food, 25% New Food</h4>
                    <p>Start slowly by mixing a small amount of PawNutrition with your dog's current food.</p>
                    <h4>Days 3-4: 50% Old Food, 50% New Food</h4>
                    <p>Increase the ratio as your dog's digestive system adapts.</p>
                    <h4>Days 5-6: 25% Old Food, 75% New Food</h4>
                    <p>Continue the gradual transition, watching for any digestive upset.</p>
                    <h4>Day 7+: 100% New Food</h4>
                    <p>Complete the transition to PawNutrition for optimal health benefits.</p>
                    <p><strong>Pro Tip:</strong> Monitor your dog throughout the transition and slow down if you notice any digestive issues.</p>
                `,
                tags: ["transition", "guide", "tips"],
                publishDate: "2024-01-10"
            }
        ];

        this.influencers = [
            {
                id: "dogtrainer_sarah",
                handle: "@dogtrainer_sarah",
                name: "Sarah Johnson",
                bio: "Professional dog trainer with 15+ years experience",
                followers: "125K",
                testimonial: "My training clients love PawNutrition - their dogs have more energy and focus!",
                specialties: ["Training", "Behavior", "Nutrition"],
                instagramUrl: "https://instagram.com/dogtrainer_sarah"
            },
            {
                id: "happy_paws_mom",
                handle: "@happy_paws_mom",
                name: "Jessica Martinez",
                bio: "Mom of 3 rescue dogs, sharing our journey",
                followers: "89K",
                testimonial: "Since switching to PawNutrition, my Golden Retriever's coat is shinier than ever!",
                specialties: ["Rescue Dogs", "Family Life", "Health"],
                instagramUrl: "https://instagram.com/happy_paws_mom"
            }
        ];
    }

    getBlogPost(id) {
        return this.blogPosts.find(post => post.id === id);
    }

    getInfluencer(id) {
        return this.influencers.find(influencer => influencer.id === id);
    }

    getAllBlogPosts() {
        return this.blogPosts;
    }

    getAllInfluencers() {
        return this.influencers;
    }
}

// Initialize marketing content
const marketingContent = new MarketingContent();

// Debug function to view analytics (can be called from browser console)
function viewAnalytics() {
    const analytics = metricsCollector.getAnalytics();
    console.log('📈 Analytics Dashboard:', analytics);
    return analytics;
}

// Debug function to clear all stored data
function clearAllData() {
    localStorage.removeItem('pawnutrition_metrics');
    localStorage.removeItem('cosmos_db_simulation');
    localStorage.removeItem('userId');
    console.log('🗑️ All data cleared');
}

console.log('🚀 PawNutrition website loaded with metrics tracking enabled');
console.log('💡 Use viewAnalytics() in console to see analytics data');
console.log('🧹 Use clearAllData() in console to reset all data');