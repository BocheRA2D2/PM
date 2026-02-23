// ============================================
// Anti-Cheat System
// ============================================

export class AntiCheat {
    constructor() {
        this.violations = 0;
        this.maxViolations = 3;
        this.isMonitoring = false;
        this.onViolation = null;
        this.handlers = {};
    }

    /**
     * Start monitoring app focus state
     */
    startMonitoring(onViolation) {
        if (this.isMonitoring) return;
        this.isMonitoring = true;
        this.onViolation = onViolation;

        // Browser visibility API
        this.handlers.visibilityChange = () => {
            if (document.hidden && this.isMonitoring) {
                this.handleViolation();
            }
        };

        document.addEventListener('visibilitychange', this.handlers.visibilityChange);

        // Capacitor App plugin (if available)
        this.initCapacitorMonitoring();
    }

    /**
     * Initialize Capacitor-specific monitoring
     */
    async initCapacitorMonitoring() {
        try {
            const { App } = await import('@capacitor/app');
            this.handlers.appStateChange = App.addListener('appStateChange', ({ isActive }) => {
                if (!isActive && this.isMonitoring) {
                    this.handleViolation();
                }
            });
        } catch {
            // Not in Capacitor environment, using browser only
        }
    }

    /**
     * Handle a violation
     */
    handleViolation() {
        this.violations++;

        if (this.onViolation) {
            this.onViolation({
                violations: this.violations,
                maxViolations: this.maxViolations,
                shouldKick: this.violations >= this.maxViolations
            });
        }
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        this.isMonitoring = false;

        if (this.handlers.visibilityChange) {
            document.removeEventListener('visibilitychange', this.handlers.visibilityChange);
        }

        if (this.handlers.appStateChange) {
            this.handlers.appStateChange.remove();
        }
    }

    /**
     * Reset violations for a new game
     */
    reset() {
        this.violations = 0;
    }

    /**
     * Get current violation count
     */
    getViolations() {
        return this.violations;
    }

    /**
     * Destroy the anti-cheat system
     */
    destroy() {
        this.stopMonitoring();
        this.onViolation = null;
    }
}
