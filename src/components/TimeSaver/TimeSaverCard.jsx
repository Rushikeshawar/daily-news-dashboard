// src/components/TimeSaver/TimeSaverCard.jsx - USER-FRIENDLY ARTICLE LINKING

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import timeSaverService from '../../services/timeSaverService';
import './TimeSaverCard.css';

const TimeSaverCard = ({ content, onView }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Get article navigation info
  const articleNav = timeSaverService.getArticleNavigationUrl(content, isAuthenticated);
  const hasLinkedArticle = timeSaverService.hasLinkedArticle(content);
  const linkedArticleInfo = timeSaverService.getLinkedArticleInfo(content);

  // Handle article click
  const handleArticleClick = async () => {
    // Record view
    if (onView) {
      onView(content.id);
    }
    await timeSaverService.recordView(content.id);

    // Navigate to article
    if (articleNav.url) {
      if (articleNav.isExternal) {
        // Open external links in new tab
        window.open(articleNav.url, '_blank', 'noopener,noreferrer');
      } else if (articleNav.needsLogin) {
        // Show login prompt and redirect
        navigate(articleNav.url, { 
          state: { 
            message: 'Please login to read this AI-generated article',
            from: window.location.pathname 
          } 
        });
      } else {
        // Navigate to internal article
        navigate(articleNav.url);
      }
      
      // Record interaction
      await timeSaverService.recordInteraction(content.id, 'click');
    }
  };

  // Format read time
  const formatReadTime = (seconds) => {
    if (!seconds) return 'Quick read';
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} min read`;
  };

  // Render article link button
  const renderArticleLink = () => {
    if (!hasLinkedArticle) {
      return null;
    }

    let buttonText = 'Read Full Article';
    let buttonIcon = '📖';
    let buttonClass = 'article-link-btn';

    if (linkedArticleInfo) {
      switch (linkedArticleInfo.type) {
        case 'ai':
          buttonText = isAuthenticated ? 'Read AI Article' : 'Login to Read AI Article';
          buttonIcon = '🤖';
          buttonClass = 'article-link-btn ai-article';
          break;
        case 'external':
          buttonText = 'Read on Source';
          buttonIcon = '🔗';
          buttonClass = 'article-link-btn external';
          break;
        default:
          buttonText = 'Read Full Article';
          buttonIcon = '📖';
          buttonClass = 'article-link-btn regular';
      }
    }

    return (
      <button 
        className={buttonClass}
        onClick={handleArticleClick}
        aria-label={buttonText}
      >
        <span className="button-icon">{buttonIcon}</span>
        <span className="button-text">{buttonText}</span>
        {linkedArticleInfo?.requiresAuth && !isAuthenticated && (
          <span className="auth-badge">Login Required</span>
        )}
      </button>
    );
  };

  // Render linked article info badge
  const renderArticleBadge = () => {
    if (!linkedArticleInfo) return null;

    const badges = {
      regular: { text: 'Full Article Available', class: 'badge-regular', icon: '📄' },
      ai: { text: 'AI Article', class: 'badge-ai', icon: '🤖' },
      external: { text: 'External Source', class: 'badge-external', icon: '🔗' }
    };

    const badge = badges[linkedArticleInfo.type];
    if (!badge) return null;

    return (
      <div className={`article-badge ${badge.class}`}>
        <span className="badge-icon">{badge.icon}</span>
        <span className="badge-text">{badge.text}</span>
      </div>
    );
  };

  // Parse key points
  const keyPointsArray = content.keyPoints 
    ? (typeof content.keyPoints === 'string' 
        ? content.keyPoints.split('|').filter(p => p.trim())
        : content.keyPoints)
    : [];

  return (
    <div className="timesaver-card">
      {/* Priority Badge */}
      {content.isPriority && (
        <div className="priority-badge">
          <span className="priority-icon">⚡</span>
          <span className="priority-text">Priority</span>
        </div>
      )}

      {/* Article Badge */}
      {renderArticleBadge()}

      {/* Image */}
      {content.imageUrl && (
        <div className="card-image">
          <img src={content.imageUrl} alt={content.title} loading="lazy" />
          <div className="image-overlay">
            <span className="category-tag">{content.category}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="card-content">
        {/* Title */}
        <h3 className="card-title">{content.title}</h3>

        {/* Summary */}
        <p className="card-summary">{content.summary}</p>

        {/* Key Points */}
        {keyPointsArray.length > 0 && (
          <div className="key-points">
            <h4 className="key-points-title">Key Points:</h4>
            <ul className="key-points-list">
              {keyPointsArray.slice(0, 3).map((point, index) => (
                <li key={index} className="key-point-item">
                  <span className="bullet">•</span>
                  <span className="point-text">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Linked Article Info */}
        {linkedArticleInfo && (
          <div className="linked-article-info">
            <div className="info-icon">
              {linkedArticleInfo.type === 'ai' ? '🤖' : 
               linkedArticleInfo.type === 'external' ? '🔗' : '📖'}
            </div>
            <div className="info-text">
              {linkedArticleInfo.title ? (
                <span className="linked-title">
                  Linked: <strong>{linkedArticleInfo.title}</strong>
                </span>
              ) : (
                <span className="linked-title">Full article available</span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="card-footer">
          <div className="footer-left">
            <span className="read-time">
              <span className="time-icon">⏱️</span>
              {formatReadTime(content.readTimeSeconds)}
            </span>
            {content.viewCount > 0 && (
              <span className="view-count">
                <span className="view-icon">👁️</span>
                {content.viewCount.toLocaleString()} views
              </span>
            )}
          </div>

          <div className="footer-right">
            {renderArticleLink()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSaverCard;