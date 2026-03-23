import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { doc, updateDoc, arrayUnion, onSnapshot, deleteDoc } from 'firebase/firestore';
import DOMPurify from 'dompurify';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import '../css/blogDetail.css';

const categoryImage = {
  Community: 'https://plus.unsplash.com/premium_photo-1681505195930-388c317b7a76?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29tbXVuaXR5fGVufDB8fDB8fHww',
  Volunteering: 'https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  Health: 'https://plus.unsplash.com/premium_photo-1675808577247-2281dc17147a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aGVhbHRofGVufDB8fDB8fHww',
  Education: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZWR1Y2F0aW9ufGVufDB8fDB8fHww',
  Business: 'https://plus.unsplash.com/premium_photo-1661772661721-b16346fe5b0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QnVzaW5lc3N8ZW58MHx8MHx8fDA%3D',
  Events: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZXZlbnRzfGVufDB8fDB8fHww',
};

const returnCategoryImage = (category) => {
  return categoryImage[category] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzMzMzMzMiLz48cmVjdCB4PSIyNSIgeT0iMjUiIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjNjZkOWVmIiBzdHJva2U9IiMwYjdiYzYiIHN0cm9rZS13aWR0aD0iMyIgcng9IjEwIi8+PHRleHQgeD0iMTAwIiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0iQXJpYWwiPlBsYWNlIjwvdGV4dD48L3N2Zz4=';
};

const BLOG_STORAGE_KEY = 'blogPosts';

const defaultBlogPosts = Array.from({ length: 6 }, (_, i) => ({
  id: `default-${i + 1}`,
  title: `Community Spotlight: Local Heroes Making a Difference #${i + 1}`,
  excerpt: 'Discover the inspiring stories of Coppell residents who are going above and beyond to make our community a better place for everyone.',
  author: 'Community Team',
  authorEmail: 'team@coppellhub.com',
  date: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)),
  readTime: `${5 + i} min read`,
  category: ['Community', 'Volunteering', 'Health', 'Education', 'Business', 'Events'][i % 6],
  image: returnCategoryImage(['Community', 'Volunteering', 'Health', 'Education', 'Business', 'Events'][i % 6]),
  content: `<h3>Making Our Community Stronger</h3>
<p>Every day, members of our community step up to make Coppell a better place. From organizing neighborhood clean-ups to supporting local food banks, these unsung heroes demonstrate what it means to be a good neighbor.</p>

<h3>How You Can Get Involved</h3>
<p>There are many ways to contribute to our community. Whether you have an hour a week or a full day to spare, your involvement matters. Check out our resources page to find volunteer opportunities near you.</p>

<p>Remember, small acts of kindness can create ripples of positive change throughout our entire community. Start today and be part of something bigger than yourself.</p>`,
  featured: i === 0,
  likes: Math.floor(Math.random() * 50) + 10,
  comments: [],
}));

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to get posts from local storage
  const getLocalPosts = () => {
    try {
      const stored = localStorage.getItem(BLOG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveLocalPosts = (posts) => {
    try {
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // Ignore local save errors
    }
  };

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      
      // Check if it's a default post
      if (id.startsWith('default-')) {
        const defaultPost = defaultBlogPosts.find(p => p.id === id);
        if (defaultPost) {
          setPost(defaultPost);
          setLikesCount(defaultPost.likes || 0);
          setComments(defaultPost.comments || []);
        }
        setLoading(false);
        return;
      }

      // For post-* IDs (local-only posts), check local storage first
      if (id.startsWith('post-')) {
        const localPosts = getLocalPosts();
        const localPost = localPosts.find(p => p.id === id);
        if (localPost) {
          setPost({
            ...localPost,
            date: localPost.date ? new Date(localPost.date) : new Date()
          });
          setLikesCount(localPost.likes || 0);
          setComments(localPost.comments || []);
          setLoading(false);
          return;
        }
        // If not found locally, show not found (post-* IDs are local-only)
        setPost(null);
        setLoading(false);
        return;
      }

      // For Firebase document IDs, try Firebase first then local storage fallback
      try {
        const postRef = doc(db, 'blogPosts', id);
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(postRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPost({
              id: docSnap.id,
              ...data,
              date: data.date?.toDate() || new Date()
            });
            setLikesCount(data.likes || 0);
            setComments(data.comments || []);
          } else {
            // Also check local storage as fallback
            const localPosts = getLocalPosts();
            const localPost = localPosts.find(p => p.id === id);
            if (localPost) {
              setPost({
                ...localPost,
                date: localPost.date ? new Date(localPost.date) : new Date()
              });
              setLikesCount(localPost.likes || 0);
              setComments(localPost.comments || []);
            } else {
              setPost(null);
            }
          }
          setLoading(false);
        }, () => {
          // Firebase unavailable, checking local storage
          // Try local storage as fallback
          const localPosts = getLocalPosts();
          const localPost = localPosts.find(p => p.id === id);
          if (localPost) {
            setPost({
              ...localPost,
              date: localPost.date ? new Date(localPost.date) : new Date()
            });
            setLikesCount(localPost.likes || 0);
            setComments(localPost.comments || []);
          } else {
            setPost(null);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch {
        // Final fallback to local storage
        const localPosts = getLocalPosts();
        const localPost = localPosts.find(p => p.id === id);
        if (localPost) {
          setPost({
            ...localPost,
            date: localPost.date ? new Date(localPost.date) : new Date()
          });
          setLikesCount(localPost.likes || 0);
          setComments(localPost.comments || []);
        }
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const formatDate = (date) => {
    if (typeof date === 'string') return date;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like this post');
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    // Update Firebase if not a default post
    if (!id.startsWith('default-')) {
      try {
        const postRef = doc(db, 'blogPosts', id);
        await updateDoc(postRef, {
          likes: newLiked ? likesCount + 1 : likesCount - 1
        });
      } catch {
        // Revert on error
        setLiked(!newLiked);
        setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!isAuthenticated) {
      alert('Please log in to comment');
      return;
    }

    setIsSubmitting(true);
    const commentData = {
      id: Date.now().toString(),
      author: user?.email?.split('@')[0] || 'Anonymous',
      authorEmail: user?.email || '',
      content: newComment.trim(),
      date: new Date().toISOString(),
      likes: 0
    };

    // Update local state immediately
    setComments(prev => [commentData, ...prev]);
    setNewComment('');

    // Update Firebase if not a default post
    if (!id.startsWith('default-')) {
      try {
        const postRef = doc(db, 'blogPosts', id);
        await updateDoc(postRef, {
          comments: arrayUnion(commentData)
        });
      } catch {
        // Revert on error
        setComments(prev => prev.filter(c => c.id !== commentData.id));
        alert('Error posting comment. Please try again.');
      }
    }
    
    setIsSubmitting(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url
        });
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const canDeletePost =
    isAuthenticated &&
    !!user &&
    !id.startsWith('default-') &&
    ((post?.authorId && post.authorId === user.uid) ||
      (post?.authorEmail && post.authorEmail === user.email));

  const handleDeletePost = async () => {
    if (!canDeletePost) {
      alert('Only the creator can delete this post.');
      return;
    }

    const confirmed = window.confirm('Delete this post permanently?');
    if (!confirmed) return;

    try {
      if (!id.startsWith('post-')) {
        await deleteDoc(doc(db, 'blogPosts', id));
      }

      const localPosts = getLocalPosts();
      if (localPosts.length > 0) {
        saveLocalPosts(localPosts.filter((localPost) => localPost.id !== id));
      }

      alert('Post deleted successfully.');
      navigate('/blog');
    } catch {
      alert('Could not delete post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="blog-detail-loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-not-found">
        <div className="blog-detail-not-found-content">
          <h2>Post Not Found</h2>
          <button
            onClick={() => navigate('/blog')}
            className="blog-detail-back-btn"
          >
            Return to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      {/* Header */}
      <div className="blog-detail-header">
        <img
          src={post.image}
          alt={post.title}
          className="blog-detail-header-image"
        />
        <div className="blog-detail-header-overlay"></div>
        <div className="blog-detail-header-content">
          <button
            onClick={() => navigate('/blog')}
            className="blog-detail-back-link"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </button>
          <span className="blog-detail-category">{post.category}</span>
          <h1 className="blog-detail-title">{post.title}</h1>
          <div className="blog-detail-meta">
            <div className="blog-detail-meta-item">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="blog-detail-meta-item">
              <Calendar size={16} />
              <span>{formatDate(post.date)}</span>
            </div>
            <div className="blog-detail-meta-item">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="blog-detail-content">
        {/* Action Bar */}
        <div className="blog-detail-actions">
          <div className="blog-detail-actions-left">
            <button 
              className={`blog-detail-action-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              <span>{likesCount}</span>
            </button>
            <button className="blog-detail-action-btn">
              <MessageCircle size={18} />
              <span>{comments.length}</span>
            </button>
          </div>
          <div className="blog-detail-actions-right">
            {canDeletePost && (
              <button className="blog-detail-delete-btn" onClick={handleDeletePost}>
                <Trash2 size={18} />
                Delete
              </button>
            )}
            <button className="blog-detail-share-btn" onClick={handleShare}>
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        {/* Article Content */}
        <article 
          className="blog-detail-article"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {/* Author Bio */}
        <div className="blog-detail-author-bio">
          <div className="blog-detail-author-avatar">
            {post.author?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
          </div>
          <div className="blog-detail-author-info">
            <h3>About {post.author}</h3>
            <p>
              {post.author} is a passionate community advocate and regular contributor to the Coppell Community Resource Hub. 
              With years of experience in community organizing and social services, they bring valuable insights to help residents connect with local resources.
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="blog-detail-comments">
          <h3>
            <MessageCircle size={24} />
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="blog-comment-form">
            <div className="blog-comment-input-wrapper">
              <div className="blog-comment-avatar">
                {isAuthenticated ? (user?.email?.[0]?.toUpperCase() || 'U') : '?'}
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isAuthenticated ? "Share your thoughts..." : "Log in to comment..."}
                disabled={!isAuthenticated}
                rows={3}
              />
            </div>
            <button 
              type="submit" 
              className="blog-comment-submit"
              disabled={!isAuthenticated || isSubmitting || !newComment.trim()}
            >
              <Send size={18} />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          {/* Comments List */}
          <div className="blog-comments-list">
            {comments.length === 0 ? (
              <div className="blog-no-comments">
                <MessageCircle size={48} />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="blog-comment">
                  <div className="blog-comment-header">
                    <div className="blog-comment-author-avatar">
                      {comment.author?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="blog-comment-meta">
                      <span className="blog-comment-author">{comment.author}</span>
                      <span className="blog-comment-date">
                        {new Date(comment.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="blog-comment-content">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Articles */}
        <div className="blog-detail-related">
          <h3>Related Articles</h3>
          <div className="blog-detail-related-grid">
            {defaultBlogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2).map((relatedPost) => (
              <div
                key={relatedPost.id}
                onClick={() => navigate(`/blog/${relatedPost.id}`)}
                className="blog-detail-related-card"
              >
                <div className="blog-detail-related-image">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                  />
                </div>
                <div className="blog-detail-related-content">
                  <span className="blog-detail-related-category">
                    {relatedPost.category}
                  </span>
                  <h4>{relatedPost.title}</h4>
                  <div className="blog-detail-related-meta">
                    <span>{relatedPost.author}</span>
                    <span>•</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
