// ============================================
// Timer System
// ============================================

export class GameTimer {
    constructor() {
        this.duration = 30;
        this.remaining = 30;
        this.intervalId = null;
        this.onTick = null;
        this.onEnd = null;
        this.running = false;
        this.startTime = 0;
    }

    /**
     * Start the timer
     */
    start(duration, onTick, onEnd) {
        this.stop();
        this.duration = duration;
        this.remaining = duration;
        this.onTick = onTick;
        this.onEnd = onEnd;
        this.running = true;
        this.startTime = Date.now();

        if (this.onTick) this.onTick(this.remaining, this.duration);

        this.intervalId = setInterval(() => {
            this.remaining--;

            if (this.onTick) {
                this.onTick(this.remaining, this.duration);
            }

            if (this.remaining <= 0) {
                this.stop();
                if (this.onEnd) this.onEnd();
            }
        }, 1000);
    }

    /**
     * Stop the timer
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.running = false;
    }

    /**
     * Get elapsed time in seconds
     */
    getElapsed() {
        if (!this.running) return this.duration - this.remaining;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    /**
     * Get progress as fraction (0-1)
     */
    getProgress() {
        return this.remaining / this.duration;
    }

    /**
     * Check if time is running low (less than 25%)
     */
    isWarning() {
        return this.remaining <= this.duration * 0.25 && this.remaining > this.duration * 0.1;
    }

    /**
     * Check if time is critical (less than 10%)
     */
    isDanger() {
        return this.remaining <= this.duration * 0.1;
    }

    /**
     * Destroy timer
     */
    destroy() {
        this.stop();
        this.onTick = null;
        this.onEnd = null;
    }
}
