// DCFV BDC Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize tooltips
    initializeTooltips();
    
    // Add click tracking for analytics
    initializePortalTracking();
    
    console.log('DCFV BDC Dashboard initialized successfully');
}

function initializePortalTracking() {
    const portalLinks = document.querySelectorAll('.clickable-card');
    
    portalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const portalId = this.querySelector('.portal-card').dataset.portalId;
            console.log(`Portal accessed: ${portalId} at ${new Date().toISOString()}`);
            
            // You can add analytics tracking here
            // trackPortalAccess(portalId);
        });
    });
}

function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const url = this.dataset.url;
            copyToClipboard(url);
        });
    });
}

function initializeBookmarkButtons() {
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const portalName = this.dataset.portal;
            const url = this.dataset.url;
            bookmarkPortal(portalName, url);
        });
    });
}

function initializeShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const portalName = this.dataset.portal;
            const url = this.dataset.url;
            sharePortal(portalName, url);
        });
    });
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('URL copied to clipboard successfully!', 'success');
    } catch (err) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('URL copied to clipboard successfully!', 'success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showToast('Failed to copy URL. Please copy manually.', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

function bookmarkPortal(portalName, url) {
    // Check if browser supports bookmark API
    if (window.sidebar && window.sidebar.addPanel) {
        // Firefox
        window.sidebar.addPanel(portalName, url, '');
        showToast('Bookmark added (Firefox)', 'success');
    } else if (window.external && ('AddFavorite' in window.external)) {
        // Internet Explorer
        window.external.AddFavorite(url, portalName);
        showToast('Bookmark added (IE)', 'success');
    } else {
        // Other browsers - show instructions
        const message = `Press Ctrl+D (Windows/Linux) or Cmd+D (Mac) to bookmark this page.`;
        showToast(message, 'info');
        
        // Also copy URL to clipboard for convenience
        copyToClipboard(url);
    }
}

function sharePortal(portalName, url) {
    if (navigator.share) {
        // Web Share API is supported
        navigator.share({
            title: `DCFV BDC - ${portalName}`,
            text: `Access the ${portalName} portal`,
            url: url
        }).then(() => {
            showToast('Portal link shared successfully!', 'success');
        }).catch((error) => {
            console.error('Error sharing:', error);
            fallbackShare(portalName, url);
        });
    } else {
        fallbackShare(portalName, url);
    }
}

function fallbackShare(portalName, url) {
    // Fallback sharing options
    const shareText = `DCFV BDC - ${portalName}: ${url}`;
    copyToClipboard(shareText);
    showToast('Share link copied to clipboard!', 'success');
}

function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    let toast = document.getElementById('copyToast') || document.getElementById('actionToast');
    
    if (!toast) {
        // Create a new toast if none exists
        toast = createToast();
        toastContainer.appendChild(toast);
    }
    
    const toastBody = toast.querySelector('.toast-body');
    const toastIcon = toast.querySelector('.toast-header i');
    
    // Update toast content
    toastBody.textContent = message;
    
    // Update icon based on type
    toastIcon.className = getToastIconClass(type);
    
    // Show the toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    bsToast.show();
}

function createToast() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.role = 'alert';
    toast.innerHTML = `
        <div class="toast-header">
            <i class="fas fa-info-circle text-info me-2"></i>
            <strong class="me-auto">Notification</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            Message
        </div>
    `;
    return toast;
}

function getToastIconClass(type) {
    const iconClasses = {
        success: 'fas fa-check-circle text-success me-2',
        error: 'fas fa-exclamation-circle text-danger me-2',
        warning: 'fas fa-exclamation-triangle text-warning me-2',
        info: 'fas fa-info-circle text-info me-2'
    };
    return iconClasses[type] || iconClasses.info;
}

function initializePortalStatusChecks() {
    const portalCards = document.querySelectorAll('.portal-card');
    
    portalCards.forEach(card => {
        const portalId = card.dataset.portalId;
        if (portalId) {
            checkPortalStatus(portalId, card);
        }
    });
}

async function checkPortalStatus(portalId, cardElement) {
    try {
        // This is a placeholder for actual portal status checking
        // In a real implementation, you would ping the portal endpoints
        
        const statusIndicator = createStatusIndicator('active');
        const cardHeader = cardElement.querySelector('.card-header');
        
        if (cardHeader) {
            cardHeader.appendChild(statusIndicator);
        }
        
    } catch (error) {
        console.error(`Error checking status for portal ${portalId}:`, error);
        
        const statusIndicator = createStatusIndicator('unknown');
        const cardHeader = cardElement.querySelector('.card-header');
        
        if (cardHeader) {
            cardHeader.appendChild(statusIndicator);
        }
    }
}

function createStatusIndicator(status) {
    const indicator = document.createElement('span');
    indicator.className = 'badge position-absolute top-0 end-0 m-2';
    
    switch (status) {
        case 'active':
            indicator.className += ' bg-success';
            indicator.innerHTML = '<i class="fas fa-circle"></i>';
            indicator.title = 'Portal is active';
            break;
        case 'inactive':
            indicator.className += ' bg-danger';
            indicator.innerHTML = '<i class="fas fa-circle"></i>';
            indicator.title = 'Portal is inactive';
            break;
        case 'maintenance':
            indicator.className += ' bg-warning';
            indicator.innerHTML = '<i class="fas fa-wrench"></i>';
            indicator.title = 'Portal is under maintenance';
            break;
        default:
            indicator.className += ' bg-secondary';
            indicator.innerHTML = '<i class="fas fa-question"></i>';
            indicator.title = 'Portal status unknown';
    }
    
    return indicator;
}

function initializeTooltips() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Utility functions
function formatDateTime(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
    }).format(date);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Portal health monitoring
function startPortalHealthMonitoring() {
    // Check portal health every 5 minutes
    setInterval(() => {
        const portalCards = document.querySelectorAll('.portal-card');
        portalCards.forEach(card => {
            const portalId = card.dataset.portalId;
            if (portalId) {
                checkPortalStatus(portalId, card);
            }
        });
    }, 5 * 60 * 1000); // 5 minutes
}

// Auto-refresh page data
function enableAutoRefresh() {
    // Refresh page data every 30 minutes
    setTimeout(() => {
        if (confirm('Refresh dashboard data?')) {
            window.location.reload();
        }
    }, 30 * 60 * 1000); // 30 minutes
}

// Export functions for global access
window.DCFV_Dashboard = {
    copyToClipboard,
    bookmarkPortal,
    sharePortal,
    showToast,
    checkPortalStatus
};